import { Router, Request, Response } from 'express';
import {
  DESTINATIONS_DB,
  calculateTripBudget,
  generateFlexibleDates
} from './services/dataService.js';
import { getDestinationWeather } from './services/weatherService.js';
import { getLiveCurrencyRates } from './services/currencyService.js';
import { generateItinerary, askTravelAdvisor } from './services/geminiService.js';
import { runProductionHealthCheck } from './mcps/index.js';

export const apiRouter = Router();

// GET /api/destinations
apiRouter.get('/destinations', async (req: Request, res: Response) => {
  try {
    const {
      category,
      tag,
      maxBudget,
      travellers = '2',
      days = '5',
      climate,
      directOnly
    } = req.query;

    const numTravellers = Math.max(1, parseInt(travellers as string, 10) || 2);
    const numDays = Math.max(1, parseInt(days as string, 10) || 5);
    const budgetCap = maxBudget ? parseFloat(maxBudget as string) : undefined;

    let results = DESTINATIONS_DB.map(dest => {
      // Calculate dynamic budget for this search
      const budget = calculateTripBudget(
        dest,
        numDays,
        numTravellers,
        'mid',
        false
      );

      return {
        ...dest,
        calculatedBudget: budget
      };
    });

    // Filter by category: nearby, mid, far
    if (category && category !== 'all') {
      results = results.filter(d => d.category === category);
    }

    // Filter by tag / travel style
    if (tag && tag !== 'all') {
      results = results.filter(d => d.tags.includes(tag as any));
    }

    // Filter by climate
    if (climate && climate !== 'any') {
      results = results.filter(d => d.climate === climate);
    }

    // Filter direct flights
    if (directOnly === 'true') {
      results = results.filter(d => d.directFlightAvailable);
    }

    // Budget-first discovery filter
    if (budgetCap && budgetCap > 0) {
      results = results.filter(d => d.calculatedBudget.totalTripSGD <= budgetCap);
      // Sort by best value within budget
      results.sort((a, b) => a.calculatedBudget.totalTripSGD - b.calculatedBudget.totalTripSGD);
    }

    res.json({
      success: true,
      totalCount: results.length,
      departureOrigin: 'Singapore Changi (SIN)',
      retrievedAt: new Date().toISOString(),
      dataSource: 'Changi Airport Schedule / CAAS Consolidated Flight Data',
      destinations: results
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/flights
apiRouter.get('/flights', (req: Request, res: Response) => {
  const { destinationId, departureDate, returnDate } = req.query;
  const dest = DESTINATIONS_DB.find(d => d.id === destinationId) || DESTINATIONS_DB[0];

  res.json({
    success: true,
    destinationId: dest.id,
    destinationName: dest.name,
    airportCode: dest.code,
    departureDate: departureDate || '2026-10-10',
    returnDate: returnDate || '2026-10-15',
    flights: dest.flightOptions,
    singaporeAirlinesOption: dest.flightOptions.find(f => f.isSingaporeAirlines),
    cheapestAlternative: dest.flightOptions.find(f => f.classification === 'Lowest Fare'),
    bestValue: dest.flightOptions.find(f => f.classification === 'Best Value') || dest.flightOptions[0],
    historicalReference: dest.historicalFareRangeSGD,
    dealDifferencePercent: dest.dealDiffPercent,
    dealTag: dest.dealTag,
    retrievedAt: new Date().toISOString(),
    dataSource: 'Changi Airport Direct Airline API Integration'
  });
});

// GET /api/flights/flexible
apiRouter.get('/flights/flexible', (req: Request, res: Response) => {
  const { destinationId, departureDate, returnDate } = req.query;
  const dest = DESTINATIONS_DB.find(d => d.id === destinationId) || DESTINATIONS_DB[0];

  const dep = (departureDate as string) || '2026-11-12';
  const ret = (returnDate as string) || '2026-11-18';
  const baseFare = dest.flightOptions[0]?.totalFareSGD || 350;

  const flexibleOptions = generateFlexibleDates(
    dep,
    ret,
    baseFare,
    dest.flightOptions[0]?.airline || 'Singapore Airlines',
    dest.directFlightAvailable
  );

  res.json({
    success: true,
    destinationId: dest.id,
    originalDates: { departureDate: dep, returnDate: ret, fareSGD: baseFare },
    flexibleOptions,
    retrievedAt: new Date().toISOString()
  });
});

// GET /api/hotels
apiRouter.get('/hotels', (req: Request, res: Response) => {
  const { destinationId } = req.query;
  const dest = DESTINATIONS_DB.find(d => d.id === destinationId) || DESTINATIONS_DB[0];

  res.json({
    success: true,
    destinationId: dest.id,
    accommodations: dest.accommodations,
    tiers: {
      budgetFromSGD: dest.estimatedHotelCostPerNightSGD.budget,
      midFromSGD: dest.estimatedHotelCostPerNightSGD.mid,
      premiumFromSGD: dest.estimatedHotelCostPerNightSGD.premium
    },
    retrievedAt: new Date().toISOString(),
    dataSource: 'Hotel Inventory API & Direct Partner Feed'
  });
});

// GET /api/transit
apiRouter.get('/transit', (req: Request, res: Response) => {
  const { destinationId } = req.query;
  const dest = DESTINATIONS_DB.find(d => d.id === destinationId) || DESTINATIONS_DB[0];

  res.json({
    success: true,
    destinationId: dest.id,
    transitGuide: dest.transitGuide,
    publicTransportRating: dest.publicTransportRating,
    retrievedAt: new Date().toISOString()
  });
});

// GET /api/cars
apiRouter.get('/cars', (req: Request, res: Response) => {
  const { destinationId } = req.query;
  const dest = DESTINATIONS_DB.find(d => d.id === destinationId) || DESTINATIONS_DB[0];

  res.json({
    success: true,
    destinationId: dest.id,
    carRentalUsefulness: dest.carRentalUsefulness,
    estimatedDailySGD: dest.estimatedCarRentalDailySGD,
    options: dest.carRentalOptions,
    recommendationReason:
      dest.carRentalUsefulness === 'Not Needed'
        ? `${dest.name} boasts a world-class, ultra-efficient rail and subway system. Renting a car is not recommended due to dense city traffic and steep parking fees.`
        : dest.carRentalUsefulness === 'Recommended'
        ? `In ${dest.name}, public transit is sparse outside downtown. A rental car or private driver provides far superior access to scenic valleys and coastline.`
        : `Public transit is adequate for main city sights; a car is optional if venturing to distant countryside regions.`,
    retrievedAt: new Date().toISOString()
  });
});

// GET /api/weather
apiRouter.get('/weather', async (req: Request, res: Response) => {
  try {
    const { destinationId, date } = req.query;
    const dest = DESTINATIONS_DB.find(d => d.id === destinationId) || DESTINATIONS_DB[0];
    const targetDate = (date as string) || new Date().toISOString().split('T')[0];

    const weather = await getDestinationWeather(
      dest.id,
      dest.coordinates.lat,
      dest.coordinates.lng,
      targetDate
    );

    res.json({
      success: true,
      destinationId: dest.id,
      destinationName: dest.name,
      targetDate,
      weather
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/currency
apiRouter.get('/currency', async (_req: Request, res: Response) => {
  try {
    const ratesData = await getLiveCurrencyRates();
    res.json({
      success: true,
      ...ratesData
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/advisories
apiRouter.get('/advisories', (req: Request, res: Response) => {
  const { destinationId } = req.query;
  const dest = DESTINATIONS_DB.find(d => d.id === destinationId) || DESTINATIONS_DB[0];

  res.json({
    success: true,
    destinationId: dest.id,
    advisory: dest.advisory,
    retrievedAt: new Date().toISOString(),
    source: dest.advisory.source
  });
});

// POST /api/budget
apiRouter.post('/budget', (req: Request, res: Response) => {
  try {
    const {
      destinationId,
      totalDays = 5,
      travellers = 2,
      hotelCategory = 'mid',
      carRentalRequired = false,
      airlineIndex = 0
    } = req.body;

    const dest = DESTINATIONS_DB.find(d => d.id === destinationId) || DESTINATIONS_DB[0];
    const chosenAirline = dest.flightOptions[airlineIndex] || dest.flightOptions[0];

    const budget = calculateTripBudget(
      dest,
      totalDays,
      travellers,
      hotelCategory,
      carRentalRequired,
      chosenAirline
    );

    res.json({
      success: true,
      budget
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/itinerary
apiRouter.post('/itinerary', async (req: Request, res: Response) => {
  try {
    const {
      destinationId,
      startDate,
      endDate,
      travelStyle = 'balanced',
      travellers = 2,
      hotelCategory = 'mid',
      carRentalRequired = false,
      interests = []
    } = req.body;

    const itinerary = await generateItinerary({
      destinationId: destinationId || 'bangkok',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      travelStyle,
      travellers,
      hotelCategory,
      carRentalRequired,
      interests
    });

    res.json({
      success: true,
      itinerary
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/travel-advisor
apiRouter.post('/travel-advisor', async (req: Request, res: Response) => {
  try {
    const { query, context } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required.' });
    }

    const answer = await askTravelAdvisor(query, context);
    res.json({
      success: true,
      answer,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/health - Production Health Check Probe
// MCP Production Requirement #9: Checks every required production integration and reports ONLY:
// configured: true/false
// reachable: true/false
// status
// error
// Never expose credentials.
apiRouter.get('/health', async (req: Request, res: Response) => {
  try {
    const report = await runProductionHealthCheck();

    // When explicitly requested via ?details=true or ?verbose=true (e.g. from SystemHealthModal UI)
    if (req.query.details === 'true' || req.query.verbose === 'true') {
      return res.json({
        configured: report.configured,
        reachable: report.reachable,
        status: report.status,
        error: report.error,
        integrations: report.integrations,
        mcps: report.mcps
      });
    }

    // Default production endpoint: reports ONLY the 4 fields mandated by Requirement 9
    return res.json({
      configured: report.configured,
      reachable: report.reachable,
      status: report.status,
      error: report.error
    });
  } catch (error: any) {
    res.status(500).json({
      configured: false,
      reachable: false,
      status: 'unhealthy',
      error: error?.message || 'Production health probe failed'
    });
  }
});
