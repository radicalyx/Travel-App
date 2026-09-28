import {
  DestinationCard,
  AirlineOption,
  AccommodationOption,
  DestinationTransitGuide,
  CarRentalOption,
  TravelAdvisory,
  FlexibleDateOption,
  DistanceCategory,
  TripBudgetBreakdown,
  CompleteItinerary
} from '../../src/types/travel.js';

export interface DestinationDatabaseItem extends DestinationCard {
  flightOptions: AirlineOption[];
  accommodations: AccommodationOption[];
  transitGuide: DestinationTransitGuide;
  carRentalOptions: CarRentalOption[];
  advisory: TravelAdvisory;
  defaultItineraries: Record<string, CompleteItinerary>;
}

export const DESTINATIONS_DB: DestinationDatabaseItem[] = [
  // --- NEARBY (< 4 hours) ---
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    code: 'BKK',
    category: 'nearby',
    flightDurationMinutes: 145, // 2h 25m
    directFlightAvailable: true,
    typicalSeason: 'Cool & Dry season from Nov-Feb; Hot Mar-May; Green season Jun-Oct',
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Jul', 'Aug'],
    climate: 'tropical',
    tags: ['food', 'shopping', 'culture', 'city', 'budget', 'family'],
    
    currentEstimatedFareSGD: 240,
    singaporeAirlinesFareSGD: 360,
    cheapestAlternativeAirline: 'Scoot (TR610)',
    cheapestFareSGD: 195,
    competingAirlines: ['Singapore Airlines', 'Scoot', 'Thai Airways', 'AirAsia'],
    historicalFareRangeSGD: { min: 180, max: 420, avg: 275 },
    dealTag: 'Below Typical Range',
    dealDiffPercent: -12.7,

    estimatedHotelCostPerNightSGD: { budget: 45, mid: 95, premium: 240 },
    estimatedLocalTransportDailySGD: 12,
    estimatedCarRentalDailySGD: 45,
    estimatedFoodDailySGD: 35,
    estimatedActivitiesDailySGD: 30,

    suitabilityReason: 'Short 2.5-hour flight from Changi, unbeatable street food, world-class riverfront malls, and vibrant cultural temples ideal for a hassle-free getaway.',
    travelConsiderations: [
      'Traffic during peak hours (17:00-20:00) can be heavy; prioritize BTS Skytrain and MRT.',
      'Dress code for Grand Palace & Wat Phra Kaew requires covered shoulders and long pants/skirts.',
      'Tap water is not potable; bottled water is ubiquitous and cheap.'
    ],
    publicTransportRating: 'Exceptional',
    carRentalUsefulness: 'Not Needed',
    suggestedDays: 4,
    topAttractions: ['Grand Palace', 'Wat Arun', 'Chatuchak Weekend Market', 'ICONSIAM & Chao Phraya River', 'Jodd Fairs Night Market'],

    gradientTheme: 'from-amber-600/30 via-orange-500/10 to-transparent',
    accentColor: '#f59e0b',
    coordinates: { lat: 13.7563, lng: 100.5018 },
    dataSource: 'Changi Airport Schedule / CAAS Consolidated Flight Data',
    lastUpdated: '2026-09-28T08:15:00Z',

    flightOptions: [
      {
        airline: 'Singapore Airlines',
        airlineCode: 'SQ',
        isSingaporeAirlines: true,
        flightNumber: 'SQ708',
        departureTime: '09:30',
        arrivalTime: '11:00',
        durationMinutes: 150,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '25kg check-in + 7kg cabin + meals included',
        baseFareSGD: 295,
        taxesSGD: 65,
        totalFareSGD: 360,
        dataSource: 'Singapore Airlines Direct Distribution',
        lastUpdated: '2026-09-28T08:00:00Z',
        classification: 'Singapore Airlines',
        dealTag: 'Within Typical Range',
        dealDiffPercent: 2.8
      },
      {
        airline: 'Scoot',
        airlineCode: 'TR',
        isSingaporeAirlines: false,
        flightNumber: 'TR610',
        departureTime: '07:15',
        arrivalTime: '08:45',
        durationMinutes: 150,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '10kg cabin bag included; check-in add-on',
        baseFareSGD: 145,
        taxesSGD: 50,
        totalFareSGD: 195,
        dataSource: 'Airline Inventory Feed',
        lastUpdated: '2026-09-28T07:45:00Z',
        classification: 'Lowest Fare',
        dealTag: 'Below Typical Range',
        dealDiffPercent: -29.0
      },
      {
        airline: 'Thai Airways',
        airlineCode: 'TG',
        isSingaporeAirlines: false,
        flightNumber: 'TG404',
        departureTime: '12:25',
        arrivalTime: '13:45',
        durationMinutes: 140,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '20kg check-in + 7kg cabin',
        baseFareSGD: 220,
        taxesSGD: 62,
        totalFareSGD: 282,
        dataSource: 'Star Alliance GDS',
        lastUpdated: '2026-09-28T06:30:00Z',
        classification: 'Best Value',
        dealTag: 'Within Typical Range',
        dealDiffPercent: 2.5
      }
    ],

    accommodations: [
      {
        id: 'bkk-acc-1',
        name: 'Lub d Bangkok Siam',
        destinationId: 'bangkok',
        tier: 'budget',
        type: 'Hotel',
        neighborhood: 'Siam / Pathum Wan',
        nightlyPriceSGD: 48,
        rating: 4.6,
        reviewsCount: 1820,
        distanceToTransit: '1 min walk to National Stadium BTS',
        distanceToAttractions: '5 min walk to MBK Center, 10 min to Siam Paragon',
        convenienceReason: 'Steps from BTS Skytrain with immediate access to shopping belt and express lines.',
        amenities: ['High-speed Wi-Fi', 'Co-working space', '24h front desk', 'Luggage storage', 'Air conditioning'],
        bookingUrl: 'https://www.agoda.com/lub-d-bangkok-siam-hotel/hotel/bangkok-th.html',
        dataSource: 'Hotel API Aggregator',
        lastUpdated: '2026-09-28T08:00:00Z'
      },
      {
        id: 'bkk-acc-2',
        name: 'Centre Point Hotel Silom',
        destinationId: 'bangkok',
        tier: 'mid',
        type: 'Serviced Apartment',
        neighborhood: 'Riverside / Silom',
        nightlyPriceSGD: 98,
        rating: 4.7,
        reviewsCount: 3140,
        distanceToTransit: '3 min walk to Saphan Taksin BTS & Sathorn Pier',
        distanceToAttractions: 'Direct riverboat connection to ICONSIAM & Grand Palace',
        convenienceReason: 'Dual transit access: Skytrain line and Chao Phraya express boat pier at your doorstep.',
        amenities: ['Outdoor swimming pool', 'Kitchenette', 'River view rooms', 'Fitness center', 'Free Wi-Fi'],
        bookingUrl: 'https://www.booking.com/hotel/th/centre-point-silom.html',
        dataSource: 'Hotel API Aggregator',
        lastUpdated: '2026-09-28T08:00:00Z'
      },
      {
        id: 'bkk-acc-3',
        name: 'The Peninsula Bangkok',
        destinationId: 'bangkok',
        tier: 'premium',
        type: 'Resort',
        neighborhood: 'Chao Phraya Riverfront',
        nightlyPriceSGD: 310,
        rating: 4.9,
        reviewsCount: 2290,
        distanceToTransit: 'Private complimentary Peninsula ferry to BTS & ICONSIAM',
        distanceToAttractions: 'On the riverbank directly facing Bangkok skyline',
        convenienceReason: 'Unmatched luxury with private river shuttle boats and three-tiered riverside pool.',
        amenities: ['Three-tier riverside pool', 'Luxury spa', 'Helipad', 'Michelin-guide dining', 'Butler service'],
        bookingUrl: 'https://www.peninsula.com/en/bangkok/5-star-luxury-hotel-riverside',
        dataSource: 'Official Direct Rates',
        lastUpdated: '2026-09-28T08:00:00Z'
      }
    ],

    transitGuide: {
      destinationId: 'bangkok',
      airportToCenter: [
        {
          mode: 'Airport Express',
          title: 'Airport Rail Link (ARL)',
          durationMinutes: 28,
          costSGD: 1.8,
          transfers: 0,
          operatingHours: '05:30 - 24:00',
          frequency: 'Every 10-15 minutes',
          notes: 'Departs Suvarnabhumi basement to Phaya Thai station (interchange with BTS Sukhumvit line).'
        },
        {
          mode: 'Taxi/Grab',
          title: 'Official Airport Metered Taxi',
          durationMinutes: 45,
          costSGD: 18,
          transfers: 0,
          operatingHours: '24 hours',
          frequency: 'On demand',
          notes: 'Queue at Floor 1 taxi kiosks. Add 50 THB airport surcharge + highway expressway tolls (approx 75 THB).'
        }
      ],
      cityTransitModes: [
        {
          name: 'BTS Skytrain & MRT Subway',
          description: 'Elevated and underground trains covering downtown, Sukhumvit, Silom, and Chatuchak.',
          efficiency: 'High',
          fareGuideSGD: 'SGD 0.70 – 2.50 per trip depending on distance'
        },
        {
          name: 'Chao Phraya Express Boats & Hop-on Ferries',
          description: 'Scenic river transit connecting historic temples (Wat Arun, Wat Pho, Grand Palace) and ICONSIAM.',
          efficiency: 'High',
          fareGuideSGD: 'SGD 0.65 – 1.20 for regular orange flag boats'
        }
      ],
      recommendedPasses: [
        {
          name: 'Rabbit Card / BTS One-Day Pass',
          type: 'Stored-value / Day Pass',
          priceSGD: 6.0,
          recommendedFor: 'Travellers taking 4+ Skytrain trips in one day',
          whereToBuy: 'Any BTS ticket office with your passport'
        }
      ],
      walkingFriendliness: 'Moderate. Elevated skywalks in Siam/Chit Lom are great; street sidewalks can be uneven.',
      rideHailingApps: ['Grab', 'Bolt']
    },

    carRentalOptions: [
      {
        provider: 'Avis Thailand',
        carModel: 'Toyota Yaris / Vios',
        vehicleClass: 'Economy',
        dailyRateSGD: 42,
        transmission: 'Automatic',
        pickupLocation: 'Suvarnabhumi Airport (BKK)',
        airportPickup: true,
        fuelPolicy: 'Full to Full',
        mileage: 'Unlimited',
        insuranceIncluded: true,
        evAvailable: false,
        dataSource: 'Car Rental Aggregator'
      }
    ],

    advisory: {
      destinationId: 'bangkok',
      country: 'Thailand',
      singaporePassportVisaStatus: 'Visa-free',
      maxStayDays: 60,
      passportValidityRequiredMonths: 6,
      electronicArrivalCardRequired: false,
      advisoryLevel: 'Normal precautions',
      keyNotes: [
        'Singapore passport holders can enter visa-free for tourism up to 60 days.',
        'Ensure passport has at least 6 months validity from date of arrival.',
        'Vaping devices and e-cigarettes are strictly illegal in Thailand with severe fines.'
      ],
      emergencyContactMFA: '+66 2 344 6300 (Singapore Embassy in Bangkok)',
      lastChecked: '2026-09-28T00:00:00Z',
      source: 'Ministry of Foreign Affairs (MFA) Singapore & Royal Thai Immigration'
    },

    defaultItineraries: {}
  },

  // --- NEARBY: BALI / DENPASAR ---
  {
    id: 'bali',
    name: 'Bali (Denpasar)',
    country: 'Indonesia',
    code: 'DPS',
    category: 'nearby',
    flightDurationMinutes: 165, // 2h 45m
    directFlightAvailable: true,
    typicalSeason: 'Dry season Apr-Oct (sunny & breezy); Wet season Nov-Mar',
    bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
    climate: 'tropical',
    tags: ['beach', 'relaxation', 'nature', 'culture', 'adventure', 'food'],
    
    currentEstimatedFareSGD: 260,
    singaporeAirlinesFareSGD: 395,
    cheapestAlternativeAirline: 'AirAsia (QZ505)',
    cheapestFareSGD: 185,
    competingAirlines: ['Singapore Airlines', 'Scoot', 'AirAsia', 'Batik Air'],
    historicalFareRangeSGD: { min: 190, max: 480, avg: 295 },
    dealTag: 'Below Typical Range',
    dealDiffPercent: -11.8,

    estimatedHotelCostPerNightSGD: { budget: 50, mid: 120, premium: 350 },
    estimatedLocalTransportDailySGD: 22,
    estimatedCarRentalDailySGD: 38,
    estimatedFoodDailySGD: 32,
    estimatedActivitiesDailySGD: 35,

    suitabilityReason: 'Short 2h 45m flight from Singapore into a tropical paradise with world-renowned beach clubs, Ubud jungle retreats, and vibrant cafe culture.',
    travelConsiderations: [
      'Public transport is minimal; private driver hire (approx SGD 45-55/day) or Grab/Gojek is the standard way to travel.',
      'Bali tourist levy (IDR 150,000 / ~SGD 13) is payable online via Love Bali portal before arrival.',
      'Traffic between South Bali (Seminyak/Canggu) and Ubud can take 1.5 to 2 hours during peak periods.'
    ],
    publicTransportRating: 'Car Recommended',
    carRentalUsefulness: 'Recommended',
    suggestedDays: 5,
    topAttractions: ['Ubud Monkey Forest & Rice Terraces', 'Uluwatu Cliffside Temple & Kecak Dance', 'Seminyak & Canggu Beaches', 'Mount Batur Sunrise', 'Tirta Empul Sacred Water Temple'],

    gradientTheme: 'from-emerald-600/30 via-teal-500/10 to-transparent',
    accentColor: '#10b981',
    coordinates: { lat: -8.4095, lng: 115.1889 },
    dataSource: 'Changi Airport Schedule / CAAS Consolidated Flight Data',
    lastUpdated: '2026-09-28T08:15:00Z',

    flightOptions: [
      {
        airline: 'Singapore Airlines',
        airlineCode: 'SQ',
        isSingaporeAirlines: true,
        flightNumber: 'SQ938',
        departureTime: '08:20',
        arrivalTime: '11:05',
        durationMinutes: 165,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '25kg check-in + 7kg cabin + hot meal',
        baseFareSGD: 325,
        taxesSGD: 70,
        totalFareSGD: 395,
        dataSource: 'Singapore Airlines Direct Distribution',
        lastUpdated: '2026-09-28T08:00:00Z',
        classification: 'Singapore Airlines',
        dealTag: 'Within Typical Range',
        dealDiffPercent: 3.5
      },
      {
        airline: 'AirAsia Indonesia',
        airlineCode: 'QZ',
        isSingaporeAirlines: false,
        flightNumber: 'QZ505',
        departureTime: '11:10',
        arrivalTime: '13:55',
        durationMinutes: 165,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '7kg cabin baggage',
        baseFareSGD: 135,
        taxesSGD: 50,
        totalFareSGD: 185,
        dataSource: 'Airline Inventory Feed',
        lastUpdated: '2026-09-28T07:45:00Z',
        classification: 'Lowest Fare',
        dealTag: 'Below Typical Range',
        dealDiffPercent: -28.0
      },
      {
        airline: 'Scoot',
        airlineCode: 'TR',
        isSingaporeAirlines: false,
        flightNumber: 'TR288',
        departureTime: '15:45',
        arrivalTime: '18:30',
        durationMinutes: 165,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '10kg cabin baggage',
        baseFareSGD: 160,
        taxesSGD: 55,
        totalFareSGD: 215,
        dataSource: 'Airline Inventory Feed',
        lastUpdated: '2026-09-28T07:30:00Z',
        classification: 'Best Value',
        dealTag: 'Below Typical Range',
        dealDiffPercent: -17.5
      }
    ],

    accommodations: [
      {
        id: 'dps-acc-1',
        name: 'Komaneka at Bisma',
        destinationId: 'bali',
        tier: 'mid',
        type: 'Resort',
        neighborhood: 'Ubud',
        nightlyPriceSGD: 185,
        rating: 4.8,
        reviewsCount: 1420,
        distanceToTransit: 'Ubud central shuttle provided',
        distanceToAttractions: '10 min walk to Monkey Forest, overlooking Campuhan valley',
        convenienceReason: 'Nestled above lush river ravine while being within walking distance to Ubud center.',
        amenities: ['Infinity pool', 'Spa & wellness center', 'Complimentary afternoon tea', 'Restaurant', 'Free Wi-Fi'],
        bookingUrl: 'https://www.booking.com/hotel/id/komaneka-at-bisma.html',
        dataSource: 'Hotel API Aggregator',
        lastUpdated: '2026-09-28T08:00:00Z'
      },
      {
        id: 'dps-acc-2',
        name: 'Amnaya Resort Kuta',
        destinationId: 'bali',
        tier: 'budget',
        type: 'Hotel',
        neighborhood: 'South Kuta / Tuban',
        nightlyPriceSGD: 72,
        rating: 4.8,
        reviewsCount: 2600,
        distanceToTransit: '15 min drive from Ngurah Rai Airport',
        distanceToAttractions: '5 min walk to Waterbom Bali, 8 min to Discovery Mall',
        convenienceReason: 'Close to airport with tranquil garden design, acclaimed hospitality, and great value.',
        amenities: ['Pool', 'Sukkhacitta Spa', 'Megalep Restaurant', 'Balcony', 'Free Wi-Fi'],
        bookingUrl: 'https://www.booking.com/hotel/id/amnaya-resort-kuta.html',
        dataSource: 'Hotel API Aggregator',
        lastUpdated: '2026-09-28T08:00:00Z'
      },
      {
        id: 'dps-acc-3',
        name: 'The Mulia, Nusa Dua',
        destinationId: 'bali',
        tier: 'premium',
        type: 'Resort',
        neighborhood: 'Nusa Dua',
        nightlyPriceSGD: 420,
        rating: 4.9,
        reviewsCount: 3890,
        distanceToTransit: '20 min via Bali Mandara Tollway from airport',
        distanceToAttractions: 'Direct beachfront access to Nusa Dua white sand bay',
        convenienceReason: 'Ultra-luxurious beachfront resort with expansive ocean pools and 9 acclaimed dining venues.',
        amenities: ['Iconic oceanfront pool', 'Private beach', 'Hydrotherapy spa', 'Butler service', 'Kids club'],
        bookingUrl: 'https://www.themulia.com/bali',
        dataSource: 'Official Direct Rates',
        lastUpdated: '2026-09-28T08:00:00Z'
      }
    ],

    transitGuide: {
      destinationId: 'bali',
      airportToCenter: [
        {
          mode: 'Taxi/Grab',
          title: 'GrabCar Airport Lounge or Official Airport Taxi',
          durationMinutes: 30,
          costSGD: 16,
          transfers: 0,
          operatingHours: '24 hours',
          frequency: 'Instant via dedicated Grab Lounge at terminal exit',
          notes: 'Fixed pricing via Grab app or prepaid airport taxi voucher counter in arrivals hall.'
        }
      ],
      cityTransitModes: [
        {
          name: 'Private Car with English-speaking Driver',
          description: 'Most popular and stress-free option for full-day touring (covers fuel, parking, air-conditioned vehicle).',
          efficiency: 'High',
          fareGuideSGD: 'Approx SGD 45 – 60 per full 10-hour day'
        },
        {
          name: 'Grab & Gojek Ride-Hailing',
          description: 'Great for short point-to-point rides in Seminyak, Kuta, and Sanur. Note: Local village restrictions apply in certain Ubud zones.',
          efficiency: 'Medium',
          fareGuideSGD: 'SGD 3 – 10 per ride'
        }
      ],
      recommendedPasses: [],
      walkingFriendliness: 'Low outside resort towns and Ubud center; hiring a driver or using ride-hail is recommended.',
      rideHailingApps: ['Grab', 'Gojek']
    },

    carRentalOptions: [
      {
        provider: 'Bali Car Hire',
        carModel: 'Toyota Avanza / Rush (with or without driver)',
        vehicleClass: 'Compact',
        dailyRateSGD: 35,
        transmission: 'Automatic',
        pickupLocation: 'Ngurah Rai Airport (DPS)',
        airportPickup: true,
        fuelPolicy: 'Return same level',
        mileage: 'Unlimited on island',
        insuranceIncluded: true,
        evAvailable: false,
        dataSource: 'Local Aggregator'
      }
    ],

    advisory: {
      destinationId: 'bali',
      country: 'Indonesia',
      singaporePassportVisaStatus: 'Visa-free',
      maxStayDays: 30,
      passportValidityRequiredMonths: 6,
      electronicArrivalCardRequired: true,
      arrivalCardName: 'e-CD (Customs Declaration) + Love Bali Tourist Tax',
      advisoryLevel: 'Normal precautions',
      keyNotes: [
        'Singapore passport holders enter visa-free for tourism up to 30 days.',
        'Submit digital Electronic Customs Declaration (e-CD) online 2-3 days before arrival.',
        'Foreign Tourist Levy of IDR 150,000 applies per person (approx SGD 13).'
      ],
      emergencyContactMFA: '+62 21 520 7435 (Singapore Embassy in Jakarta)',
      lastChecked: '2026-09-28T00:00:00Z',
      source: 'MFA Singapore & Directorate General of Immigration Indonesia'
    },

    defaultItineraries: {}
  },

  // --- NEARBY: DA NANG / HOI AN ---
  {
    id: 'danang',
    name: 'Da Nang & Hoi An',
    country: 'Vietnam',
    code: 'DAD',
    category: 'nearby',
    flightDurationMinutes: 170, // 2h 50m
    directFlightAvailable: true,
    typicalSeason: 'Dry season Feb-Aug (warm & sunny); Rainy season Sep-Dec',
    bestMonths: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    climate: 'tropical',
    tags: ['beach', 'culture', 'food', 'nature', 'relaxation', 'budget'],
    
    currentEstimatedFareSGD: 290,
    singaporeAirlinesFareSGD: 380,
    cheapestAlternativeAirline: 'VietJet Air (VJ970)',
    cheapestFareSGD: 210,
    competingAirlines: ['Singapore Airlines', 'VietJet Air'],
    historicalFareRangeSGD: { min: 200, max: 490, avg: 310 },
    dealTag: 'Within Typical Range',
    dealDiffPercent: -6.4,

    estimatedHotelCostPerNightSGD: { budget: 35, mid: 80, premium: 220 },
    estimatedLocalTransportDailySGD: 14,
    estimatedCarRentalDailySGD: 45,
    estimatedFoodDailySGD: 25,
    estimatedActivitiesDailySGD: 25,

    suitabilityReason: 'Direct 2h 50m flight linking Singapore to pristine My Khe Beach, the lantern-lit UNESCO ancient town of Hoi An, and Ba Na Hills Golden Bridge.',
    travelConsiderations: [
      'Hoi An Ancient Town is 30 km (45 mins) south of Da Nang airport; Grab or pre-arranged private car is fast and economical.',
      'Hoi An ancient quarter is pedestrian-only in late afternoon/evenings—perfect for bicycling or walking.'
    ],
    publicTransportRating: 'Moderate',
    carRentalUsefulness: 'Optional',
    suggestedDays: 4,
    topAttractions: ['Hoi An Ancient Lantern Town', 'Ba Na Hills & Golden Bridge', 'My Khe Beach', 'Marble Mountains', 'Dragon Bridge Fire Show'],

    gradientTheme: 'from-cyan-600/30 via-blue-500/10 to-transparent',
    accentColor: '#06b6d4',
    coordinates: { lat: 16.0544, lng: 108.2022 },
    dataSource: 'Changi Airport Schedule / CAAS Consolidated Flight Data',
    lastUpdated: '2026-09-28T08:15:00Z',

    flightOptions: [
      {
        airline: 'Singapore Airlines',
        airlineCode: 'SQ',
        isSingaporeAirlines: true,
        flightNumber: 'SQ172',
        departureTime: '09:15',
        arrivalTime: '11:05',
        durationMinutes: 170,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '25kg check-in + 7kg cabin + meals',
        baseFareSGD: 310,
        taxesSGD: 70,
        totalFareSGD: 380,
        dataSource: 'Singapore Airlines Direct Distribution',
        lastUpdated: '2026-09-28T08:00:00Z',
        classification: 'Singapore Airlines',
        dealTag: 'Within Typical Range',
        dealDiffPercent: 2.1
      },
      {
        airline: 'VietJet Air',
        airlineCode: 'VJ',
        isSingaporeAirlines: false,
        flightNumber: 'VJ970',
        departureTime: '13:00',
        arrivalTime: '14:50',
        durationMinutes: 170,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '7kg cabin baggage',
        baseFareSGD: 155,
        taxesSGD: 55,
        totalFareSGD: 210,
        dataSource: 'Airline Inventory Feed',
        lastUpdated: '2026-09-28T07:45:00Z',
        classification: 'Lowest Fare',
        dealTag: 'Below Typical Range',
        dealDiffPercent: -22.0
      }
    ],

    accommodations: [
      {
        id: 'dad-acc-1',
        name: 'La Siesta Hoi An Resort & Spa',
        destinationId: 'danang',
        tier: 'mid',
        type: 'Resort',
        neighborhood: 'Hoi An Ancient Town Edge',
        nightlyPriceSGD: 95,
        rating: 4.9,
        reviewsCount: 2980,
        distanceToTransit: 'Complimentary shuttle and bicycles to old town & beach',
        distanceToAttractions: '10 min walk to UNESCO ancient quarter',
        convenienceReason: 'Consistently rated among the top boutique resorts in Southeast Asia with saltwater pool and lush gardens.',
        amenities: ['Two swimming pools', 'La Siesta Spa', 'Free bicycles', 'Two restaurants', 'Free Wi-Fi'],
        bookingUrl: 'https://www.lasiestaresorts.com',
        dataSource: 'Hotel API Aggregator',
        lastUpdated: '2026-09-28T08:00:00Z'
      }
    ],

    transitGuide: {
      destinationId: 'danang',
      airportToCenter: [
        {
          mode: 'Taxi/Grab',
          title: 'GrabCar to Da Nang City or Hoi An',
          durationMinutes: 15,
          costSGD: 6,
          transfers: 0,
          operatingHours: '24 hours',
          frequency: 'Instant via Grab',
          notes: 'To Da Nang city center SGD 5-8 (15m); to Hoi An ancient town SGD 18-22 (45m).'
        }
      ],
      cityTransitModes: [
        {
          name: 'Grab Ride-Hailing & Bicycles',
          description: 'Grab is extremely cheap and efficient in Da Nang. In Hoi An, cycling through paddy fields and old streets is ideal.',
          efficiency: 'High',
          fareGuideSGD: 'SGD 2 – 5 per Grab ride'
        }
      ],
      recommendedPasses: [],
      walkingFriendliness: 'High in Hoi An ancient town and along Da Nang beachfront boardwalk.',
      rideHailingApps: ['Grab', 'Xanh SM (Electric Taxis)']
    },

    carRentalOptions: [
      {
        provider: 'Da Nang Private Transport',
        carModel: 'Toyota Innova / Fortuner (with driver)',
        vehicleClass: 'SUV',
        dailyRateSGD: 50,
        transmission: 'Automatic',
        pickupLocation: 'Da Nang Airport (DAD)',
        airportPickup: true,
        fuelPolicy: 'Included with driver',
        mileage: 'Da Nang & Hoi An area',
        insuranceIncluded: true,
        evAvailable: true,
        dataSource: 'Local Partner'
      }
    ],

    advisory: {
      destinationId: 'danang',
      country: 'Vietnam',
      singaporePassportVisaStatus: 'Visa-free',
      maxStayDays: 30,
      passportValidityRequiredMonths: 6,
      electronicArrivalCardRequired: false,
      advisoryLevel: 'Normal precautions',
      keyNotes: [
        'Singapore passport holders can enter Vietnam visa-free for up to 30 days.',
        'Passport must be valid for at least 6 months.'
      ],
      emergencyContactMFA: '+84 24 3848 5725 (Singapore Embassy in Hanoi)',
      lastChecked: '2026-09-28T00:00:00Z',
      source: 'MFA Singapore & Vietnam National Administration of Tourism'
    },

    defaultItineraries: {}
  },

  // --- MID-DISTANCE (4 - 8 hours): TOKYO, JAPAN ---
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    code: 'HND',
    category: 'mid',
    flightDurationMinutes: 420, // 7h 00m
    directFlightAvailable: true,
    typicalSeason: 'Spring (cherry blossoms Mar-Apr); Autumn (foliage Oct-Nov); Winter crisp skies Dec-Feb; Summer festivals Jul-Aug',
    bestMonths: ['Mar', 'Apr', 'May', 'Oct', 'Nov', 'Dec'],
    climate: 'mild',
    tags: ['city', 'food', 'shopping', 'culture', 'family', 'luxury'],
    
    currentEstimatedFareSGD: 640,
    singaporeAirlinesFareSGD: 840,
    cheapestAlternativeAirline: 'Zipair Tokyo (ZG54) / Scoot',
    cheapestFareSGD: 480,
    competingAirlines: ['Singapore Airlines', 'All Nippon Airways (ANA)', 'Japan Airlines (JAL)', 'Zipair', 'Scoot'],
    historicalFareRangeSGD: { min: 490, max: 1150, avg: 780 },
    dealTag: 'Below Typical Range',
    dealDiffPercent: -17.9,

    estimatedHotelCostPerNightSGD: { budget: 110, mid: 220, premium: 580 },
    estimatedLocalTransportDailySGD: 18,
    estimatedCarRentalDailySGD: 85,
    estimatedFoodDailySGD: 60,
    estimatedActivitiesDailySGD: 45,

    suitabilityReason: 'Direct 7h flight into Tokyo with the world’s most punctual rail network, three-star Michelin dining at accessible prices, historic shrines, and cutting-edge tech.',
    travelConsiderations: [
      'Haneda (HND) is 25 mins from central Tokyo via Monorail/Keikyu line; Narita (NRT) takes 60 mins via Narita Express or Skyliner.',
      'Carry your physical passport at all times (tax-free shopping requires physical passport QR/stamp).',
      'Register on Visit Japan Web beforehand for express QR immigration and customs clearance.'
    ],
    publicTransportRating: 'Exceptional',
    carRentalUsefulness: 'Not Needed',
    suggestedDays: 7,
    topAttractions: ['Shibuya Crossing & Sky Observatory', 'Senso-ji Temple & Asakusa', 'Shinjuku Gyoen & Omoide Yokocho', 'TeamLab Planets / Borderless', 'Akihabara & Ginza Shopping District'],

    gradientTheme: 'from-rose-600/30 via-red-500/10 to-transparent',
    accentColor: '#f43f5e',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    dataSource: 'Changi Airport Schedule / CAAS Consolidated Flight Data',
    lastUpdated: '2026-09-28T08:15:00Z',

    flightOptions: [
      {
        airline: 'Singapore Airlines',
        airlineCode: 'SQ',
        isSingaporeAirlines: true,
        flightNumber: 'SQ638',
        departureTime: '23:55',
        arrivalTime: '08:00 (+1)',
        durationMinutes: 425,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '25kg check-in + 7kg cabin + Japanese gourmet dining',
        baseFareSGD: 710,
        taxesSGD: 130,
        totalFareSGD: 840,
        dataSource: 'Singapore Airlines Direct Distribution',
        lastUpdated: '2026-09-28T08:00:00Z',
        classification: 'Singapore Airlines',
        dealTag: 'Within Typical Range',
        dealDiffPercent: 4.2
      },
      {
        airline: 'All Nippon Airways (ANA)',
        airlineCode: 'NH',
        isSingaporeAirlines: false,
        flightNumber: 'NH844',
        departureTime: '06:15',
        arrivalTime: '14:20',
        durationMinutes: 425,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '2 x 23kg check-in pieces + meals',
        baseFareSGD: 650,
        taxesSGD: 125,
        totalFareSGD: 775,
        dataSource: 'ANA Star Alliance Feed',
        lastUpdated: '2026-09-28T07:30:00Z',
        classification: 'Best Value',
        dealTag: 'Within Typical Range',
        dealDiffPercent: -3.8
      },
      {
        airline: 'Zipair Tokyo',
        airlineCode: 'ZG',
        isSingaporeAirlines: false,
        flightNumber: 'ZG54',
        departureTime: '01:50',
        arrivalTime: '09:55',
        durationMinutes: 425,
        isDirect: true,
        stops: 0,
        cabinClass: 'Standard',
        baggageAllowance: '7kg cabin baggage; free in-flight Wi-Fi',
        baseFareSGD: 390,
        taxesSGD: 90,
        totalFareSGD: 480,
        dataSource: 'Airline Direct Feed',
        lastUpdated: '2026-09-28T07:00:00Z',
        classification: 'Lowest Fare',
        dealTag: 'Below Typical Range',
        dealDiffPercent: -38.5
      }
    ],

    accommodations: [
      {
        id: 'hnd-acc-1',
        name: 'Hotel Gracery Shinjuku',
        destinationId: 'tokyo',
        tier: 'mid',
        type: 'Hotel',
        neighborhood: 'Shinjuku Kabukicho',
        nightlyPriceSGD: 215,
        rating: 4.7,
        reviewsCount: 4520,
        distanceToTransit: '5 min walk to JR Shinjuku Station East Exit',
        distanceToAttractions: 'Iconic Godzilla head on terrace; surrounded by dining and shopping',
        convenienceReason: 'Direct access to Shinjuku transport hub connecting JR Yamanote line and express trains.',
        amenities: ['Godzilla head viewing lounge', 'Free high-speed Wi-Fi', '24h front desk', 'Coin laundry', 'Air purifier'],
        bookingUrl: 'https://shinjuku.gracery.com',
        dataSource: 'Hotel API Aggregator',
        lastUpdated: '2026-09-28T08:00:00Z'
      },
      {
        id: 'hnd-acc-2',
        name: 'Candeo Hotels Tokyo Shimbashi',
        destinationId: 'tokyo',
        tier: 'budget',
        type: 'Hotel',
        neighborhood: 'Shimbashi / Ginza border',
        nightlyPriceSGD: 145,
        rating: 4.6,
        reviewsCount: 3100,
        distanceToTransit: '3 min walk to JR Shimbashi Station',
        distanceToAttractions: '10 min walk to Ginza main shopping street',
        convenienceReason: 'Includes rooftop sky spa and onsen overlooking Tokyo Tower; direct train from Haneda.',
        amenities: ['Sky spa & open-air onsen', 'Sauna', 'Japanese breakfast buffet', 'Simmons beds', 'Free Wi-Fi'],
        bookingUrl: 'https://www.candeohotels.com',
        dataSource: 'Hotel API Aggregator',
        lastUpdated: '2026-09-28T08:00:00Z'
      },
      {
        id: 'hnd-acc-3',
        name: 'Palace Hotel Tokyo',
        destinationId: 'tokyo',
        tier: 'premium',
        type: 'Hotel',
        neighborhood: 'Marunouchi / Imperial Palace',
        nightlyPriceSGD: 680,
        rating: 4.9,
        reviewsCount: 2890,
        distanceToTransit: 'Direct underground walkway to Otemachi Subway Station; 8 min to Tokyo Station',
        distanceToAttractions: 'Overlooking Imperial Palace gardens and moats',
        convenienceReason: 'Forbes Five-Star luxury with balconies facing the Imperial Palace gardens.',
        amenities: ['Evian Spa', 'Private balconies', 'Michelin-starred dining', 'Indoor pool', 'Executive club lounge'],
        bookingUrl: 'https://en.palacehoteltokyo.com',
        dataSource: 'Official Direct Rates',
        lastUpdated: '2026-09-28T08:00:00Z'
      }
    ],

    transitGuide: {
      destinationId: 'tokyo',
      airportToCenter: [
        {
          mode: 'Train/Metro',
          title: 'Tokyo Monorail (from Haneda Airport)',
          durationMinutes: 14,
          costSGD: 4.5,
          transfers: 0,
          operatingHours: '05:15 - 23:45',
          frequency: 'Every 4-5 minutes',
          notes: 'Haneda Airport Terminal 3 to Hamamatsucho Station (direct transfer to JR Yamanote line).'
        },
        {
          mode: 'Airport Express',
          title: 'Keikyu Airport Line (from Haneda)',
          durationMinutes: 18,
          costSGD: 3.8,
          transfers: 0,
          operatingHours: '05:25 - 24:00',
          frequency: 'Every 6-10 minutes',
          notes: 'Connects to Shinagawa station or through-service to Toei Asakusa subway line.'
        },
        {
          mode: 'Airport Express',
          title: 'Keisei Skyliner / Narita Express (from Narita)',
          durationMinutes: 36,
          costSGD: 24,
          transfers: 0,
          operatingHours: '06:00 - 23:00',
          frequency: 'Every 20 minutes',
          notes: 'Skyliner reaches Ueno/Nippori in 36m at 160km/h; N’EX serves Tokyo, Shinagawa, Shinjuku.'
        }
      ],
      cityTransitModes: [
        {
          name: 'JR Yamanote Loop Line',
          description: 'Circular surface rail line linking all major hubs: Shibuya, Shinjuku, Ikebukuro, Ueno, Tokyo, Shinagawa.',
          efficiency: 'High',
          fareGuideSGD: 'SGD 1.40 – 2.20 per trip'
        },
        {
          name: 'Tokyo Metro & Toei Subway (13 lines)',
          description: 'Dense underground network reaching every neighborhood, museum, and shrine.',
          efficiency: 'High',
          fareGuideSGD: 'Tokyo Subway 24/48/72-hour pass available'
        }
      ],
      recommendedPasses: [
        {
          name: 'Welcome Suica / Digital Suica on Apple Wallet',
          type: 'IC Contactless Transit Card',
          priceSGD: 10,
          recommendedFor: 'All travellers. Tap-and-go on all trains, subways, buses, and convenience stores.',
          whereToBuy: 'Add directly to Apple Wallet or buy Welcome Suica at airport machine'
        },
        {
          name: 'Tokyo Subway 72-Hour Ticket',
          type: 'Subway Unlimited Pass',
          priceSGD: 13.5,
          recommendedFor: 'Visitors taking 3+ subway trips per day. Huge cost saver for Tokyo Metro + Toei lines.',
          whereToBuy: 'Airport ticket counters or Bic Camera / tourist info centers with passport'
        }
      ],
      walkingFriendliness: 'Exceptional. Tokyo is one of the safest and most pedestrian-friendly metropolises on earth.',
      rideHailingApps: ['GO Taxi', 'Uber Japan']
    },

    carRentalOptions: [
      {
        provider: 'Toyota Rent a Car',
        carModel: 'Toyota Aqua / Yaris Hybrid',
        vehicleClass: 'Economy',
        dailyRateSGD: 82,
        transmission: 'Automatic',
        pickupLocation: 'Haneda Airport (HND)',
        airportPickup: true,
        fuelPolicy: 'Full to Full',
        mileage: 'Unlimited',
        insuranceIncluded: true,
        evAvailable: true,
        dataSource: 'Official Toyota Fleet'
      }
    ],

    advisory: {
      destinationId: 'tokyo',
      country: 'Japan',
      singaporePassportVisaStatus: 'Visa-free',
      maxStayDays: 90,
      passportValidityRequiredMonths: 6,
      electronicArrivalCardRequired: true,
      arrivalCardName: 'Visit Japan Web (Customs & Immigration Fast Track QR)',
      advisoryLevel: 'Normal precautions',
      keyNotes: [
        'Singapore passport holders enter visa-free for tourism up to 90 days.',
        'Complete the Visit Japan Web digital registration before departure for fast QR lane entry.',
        'Carry physical passport for instant 10% consumption tax refund at participating department stores and electronics retailers.'
      ],
      emergencyContactMFA: '+81 3 3586 9111 (Singapore Embassy in Tokyo)',
      lastChecked: '2026-09-28T00:00:00Z',
      source: 'MFA Singapore & Ministry of Foreign Affairs Japan'
    },

    defaultItineraries: {}
  },

  // --- MID-DISTANCE: SEOUL, SOUTH KOREA ---
  {
    id: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    code: 'ICN',
    category: 'mid',
    flightDurationMinutes: 390, // 6h 30m
    directFlightAvailable: true,
    typicalSeason: 'Spring (cherry blossoms Apr); Autumn (golden ginkgo Oct-Nov); Winter skiing Dec-Feb; Summer Jul-Aug',
    bestMonths: ['Apr', 'May', 'Sep', 'Oct', 'Nov'],
    climate: 'mild',
    tags: ['city', 'food', 'shopping', 'culture', 'family', 'budget'],
    
    currentEstimatedFareSGD: 560,
    singaporeAirlinesFareSGD: 790,
    cheapestAlternativeAirline: 'Scoot (TR842) / T’way',
    cheapestFareSGD: 420,
    competingAirlines: ['Singapore Airlines', 'Korean Air', 'Asiana Airlines', 'Scoot', 'T’way Air'],
    historicalFareRangeSGD: { min: 420, max: 980, avg: 690 },
    dealTag: 'Below Typical Range',
    dealDiffPercent: -18.8,

    estimatedHotelCostPerNightSGD: { budget: 75, mid: 160, premium: 420 },
    estimatedLocalTransportDailySGD: 15,
    estimatedCarRentalDailySGD: 75,
    estimatedFoodDailySGD: 45,
    estimatedActivitiesDailySGD: 35,

    suitabilityReason: 'Direct 6.5h flight into Incheon with dynamic K-culture, royal palaces, buzzing Hongdae/Myeongdong districts, and Korean BBQ scenes.',
    travelConsiderations: [
      'AREX Express train reaches Seoul Station in 43 minutes non-stop from Incheon.',
      'Google Maps does not provide walking/driving routes in South Korea due to local spatial data laws; download Naver Map or KakaoMap.',
      'Singapore citizens are currently exempt from K-ETA requirements until end-2026 under the Visit Korea Year initiative.'
    ],
    publicTransportRating: 'Exceptional',
    carRentalUsefulness: 'Not Needed',
    suggestedDays: 6,
    topAttractions: ['Gyeongbokgung Palace & Bukchon Hanok Village', 'Myeongdong Street Food & Cosmetics Belt', 'N Seoul Tower & Namsan Park', 'Hongdae Indie Culture & Busking', 'Dongdaemun Design Plaza (DDP)'],

    gradientTheme: 'from-violet-600/30 via-purple-500/10 to-transparent',
    accentColor: '#8b5cf6',
    coordinates: { lat: 37.5665, lng: 126.9780 },
    dataSource: 'Changi Airport Schedule / CAAS Consolidated Flight Data',
    lastUpdated: '2026-09-28T08:15:00Z',

    flightOptions: [
      {
        airline: 'Singapore Airlines',
        airlineCode: 'SQ',
        isSingaporeAirlines: true,
        flightNumber: 'SQ608',
        departureTime: '00:10',
        arrivalTime: '07:35',
        durationMinutes: 385,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '25kg check-in + 7kg cabin + full meal service',
        baseFareSGD: 670,
        taxesSGD: 120,
        totalFareSGD: 790,
        dataSource: 'Singapore Airlines Direct Distribution',
        lastUpdated: '2026-09-28T08:00:00Z',
        classification: 'Singapore Airlines',
        dealTag: 'Within Typical Range',
        dealDiffPercent: 2.9
      },
      {
        airline: 'Korean Air',
        airlineCode: 'KE',
        isSingaporeAirlines: false,
        flightNumber: 'KE644',
        departureTime: '22:35',
        arrivalTime: '06:00 (+1)',
        durationMinutes: 385,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '23kg check-in + 7kg cabin',
        baseFareSGD: 620,
        taxesSGD: 110,
        totalFareSGD: 730,
        dataSource: 'SkyTeam GDS',
        lastUpdated: '2026-09-28T07:15:00Z',
        classification: 'Best Value',
        dealTag: 'Within Typical Range',
        dealDiffPercent: -4.0
      },
      {
        airline: 'Scoot',
        airlineCode: 'TR',
        isSingaporeAirlines: false,
        flightNumber: 'TR842',
        departureTime: '01:25',
        arrivalTime: '08:50',
        durationMinutes: 385,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '10kg cabin baggage',
        baseFareSGD: 340,
        taxesSGD: 80,
        totalFareSGD: 420,
        dataSource: 'Airline Direct Feed',
        lastUpdated: '2026-09-28T07:00:00Z',
        classification: 'Lowest Fare',
        dealTag: 'Below Typical Range',
        dealDiffPercent: -39.1
      }
    ],

    accommodations: [
      {
        id: 'icn-acc-1',
        name: 'L7 Myeongdong by LOTTE',
        destinationId: 'seoul',
        tier: 'mid',
        type: 'Hotel',
        neighborhood: 'Myeongdong / Jung-gu',
        nightlyPriceSGD: 165,
        rating: 4.8,
        reviewsCount: 3890,
        distanceToTransit: '1 min walk to Myeongdong Subway Station (Line 4)',
        distanceToAttractions: 'Directly in Myeongdong shopping strip facing Namsan Tower',
        convenienceReason: 'Prime central location with rooftop foot spa and airport limousine bus stop at door.',
        amenities: ['Rooftop floating bar', 'Foot spa with Namsan view', 'Coin laundry', 'Fitness center', 'Free Wi-Fi'],
        bookingUrl: 'https://www.lottehotel.com/myeongdong-l7/en.html',
        dataSource: 'Hotel API Aggregator',
        lastUpdated: '2026-09-28T08:00:00Z'
      }
    ],

    transitGuide: {
      destinationId: 'seoul',
      airportToCenter: [
        {
          mode: 'Airport Express',
          title: 'AREX Non-Stop Express Train',
          durationMinutes: 43,
          costSGD: 11,
          transfers: 0,
          operatingHours: '05:15 - 22:48',
          frequency: 'Every 30-40 minutes',
          notes: 'Incheon Terminal 1/2 to Seoul Station non-stop with designated reserved seating.'
        }
      ],
      cityTransitModes: [
        {
          name: 'Seoul Metropolitan Subway (23 lines)',
          description: 'Vast, air-conditioned, bilingual subway reaching every corner of Seoul and Gyeonggi-do.',
          efficiency: 'High',
          fareGuideSGD: 'SGD 1.40 – 2.00 per trip'
        }
      ],
      recommendedPasses: [
        {
          name: 'T-Money Card / Climate Card',
          type: 'Transit Card',
          priceSGD: 4.0,
          recommendedFor: 'Essential for all public transit, subway transfers, and convenience store payments.',
          whereToBuy: 'Incheon Airport arrivals convenience stores (CU, 7-Eleven, GS25)'
        }
      ],
      walkingFriendliness: 'High. Well-lit, very safe day and night.',
      rideHailingApps: ['Kakao T', 'Uber Korea']
    },

    carRentalOptions: [
      {
        provider: 'Lotte Rent-a-Car',
        carModel: 'Hyundai Avante / Kona EV',
        vehicleClass: 'Compact',
        dailyRateSGD: 72,
        transmission: 'Automatic',
        pickupLocation: 'Incheon International Airport (ICN)',
        airportPickup: true,
        fuelPolicy: 'Full to Full',
        mileage: 'Unlimited',
        insuranceIncluded: true,
        evAvailable: true,
        dataSource: 'Lotte Auto Fleet'
      }
    ],

    advisory: {
      destinationId: 'seoul',
      country: 'South Korea',
      singaporePassportVisaStatus: 'Visa-free',
      maxStayDays: 90,
      passportValidityRequiredMonths: 6,
      electronicArrivalCardRequired: false,
      advisoryLevel: 'Normal precautions',
      keyNotes: [
        'Singapore passport holders can enter South Korea visa-free for tourism up to 90 days.',
        'K-ETA requirement is temporarily waived for Singapore citizens through December 31, 2026.',
        'Download Naver Map or KakaoMap as Google Maps walking directions are restricted.'
      ],
      emergencyContactMFA: '+82 2 774 2474 (Singapore Embassy in Seoul)',
      lastChecked: '2026-09-28T00:00:00Z',
      source: 'MFA Singapore & Korea Immigration Service'
    },

    defaultItineraries: {}
  },

  // --- FAR (> 8 hours): LONDON, UNITED KINGDOM ---
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    code: 'LHR',
    category: 'far',
    flightDurationMinutes: 830, // 13h 50m
    directFlightAvailable: true,
    typicalSeason: 'Spring (mild & green Apr-May); Summer (long daylight Jun-Aug); Autumn (Oct-Nov); Festive winter lights Dec',
    bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Dec'],
    climate: 'mild',
    tags: ['city', 'culture', 'shopping', 'food', 'family', 'luxury'],
    
    currentEstimatedFareSGD: 1080,
    singaporeAirlinesFareSGD: 1390,
    cheapestAlternativeAirline: 'British Airways (BA12) / Etihad (1 stop)',
    cheapestFareSGD: 890,
    competingAirlines: ['Singapore Airlines', 'British Airways', 'Qantas', 'Emirates', 'Qatar Airways'],
    historicalFareRangeSGD: { min: 920, max: 1850, avg: 1320 },
    dealTag: 'Below Typical Range',
    dealDiffPercent: -18.2,

    estimatedHotelCostPerNightSGD: { budget: 130, mid: 270, premium: 650 },
    estimatedLocalTransportDailySGD: 22,
    estimatedCarRentalDailySGD: 90,
    estimatedFoodDailySGD: 70,
    estimatedActivitiesDailySGD: 50,

    suitabilityReason: 'Direct flagship flight from Changi into London, featuring world-class free national museums, West End theatre, royal parks, and historic architecture.',
    travelConsiderations: [
      'Singapore citizens can use the ePassport UK eGates at Heathrow for rapid entry without lining up for manual immigration stamps.',
      'London is completely contactless: simply tap your Singapore contactless Visa/Mastercard credit/debit card on Tube, buses, and Elizabeth Line—no Oyster card needed.',
      'Major national museums (British Museum, Natural History Museum, V&A, National Gallery, Tate Modern) have 100% free permanent entry.'
    ],
    publicTransportRating: 'Exceptional',
    carRentalUsefulness: 'Not Needed',
    suggestedDays: 8,
    topAttractions: ['Tower of London & Tower Bridge', 'British Museum & Westminster Abbey', 'West End Theatre Show', 'Borough Market & South Bank', 'Hyde Park & Buckingham Palace'],

    gradientTheme: 'from-blue-700/30 via-slate-600/10 to-transparent',
    accentColor: '#3b82f6',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    dataSource: 'Changi Airport Schedule / CAAS Consolidated Flight Data',
    lastUpdated: '2026-09-28T08:15:00Z',

    flightOptions: [
      {
        airline: 'Singapore Airlines',
        airlineCode: 'SQ',
        isSingaporeAirlines: true,
        flightNumber: 'SQ322',
        departureTime: '23:45',
        arrivalTime: '05:55 (+1)',
        durationMinutes: 850,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '25kg check-in + 7kg cabin + premium dining & amenities',
        baseFareSGD: 1140,
        taxesSGD: 250,
        totalFareSGD: 1390,
        dataSource: 'Singapore Airlines Direct Distribution',
        lastUpdated: '2026-09-28T08:00:00Z',
        classification: 'Singapore Airlines',
        dealTag: 'Within Typical Range',
        dealDiffPercent: 2.1
      },
      {
        airline: 'British Airways',
        airlineCode: 'BA',
        isSingaporeAirlines: false,
        flightNumber: 'BA12',
        departureTime: '23:15',
        arrivalTime: '05:45 (+1)',
        durationMinutes: 870,
        isDirect: true,
        stops: 0,
        cabinClass: 'Economy',
        baggageAllowance: '23kg check-in + 7kg cabin',
        baseFareSGD: 980,
        taxesSGD: 260,
        totalFareSGD: 1240,
        dataSource: 'Oneworld GDS',
        lastUpdated: '2026-09-28T07:30:00Z',
        classification: 'Best Value',
        dealTag: 'Below Typical Range',
        dealDiffPercent: -6.1
      },
      {
        airline: 'Etihad Airways (1 Stop Abu Dhabi)',
        airlineCode: 'EY',
        isSingaporeAirlines: false,
        flightNumber: 'EY473 + EY19',
        departureTime: '20:10',
        arrivalTime: '06:45 (+1)',
        durationMinutes: 995,
        isDirect: false,
        stops: 1,
        stopoverAirport: 'AUH (2h 15m)',
        cabinClass: 'Economy',
        baggageAllowance: '25kg check-in + 7kg cabin',
        baseFareSGD: 680,
        taxesSGD: 210,
        totalFareSGD: 890,
        dataSource: 'Airline Direct Feed',
        lastUpdated: '2026-09-28T07:15:00Z',
        classification: 'Lowest Fare',
        dealTag: 'Below Typical Range',
        dealDiffPercent: -32.6
      }
    ],

    accommodations: [
      {
        id: 'lhr-acc-1',
        name: 'The Resident Covent Garden',
        destinationId: 'london',
        tier: 'mid',
        type: 'Boutique Hotel',
        neighborhood: 'Covent Garden / West End',
        nightlyPriceSGD: 285,
        rating: 4.8,
        reviewsCount: 2450,
        distanceToTransit: '2 min walk to Covent Garden & Charing Cross stations',
        distanceToAttractions: 'Steps from West End theatres, Trafalgar Square, and British Museum',
        convenienceReason: 'In the heart of the West End with in-room mini-kitchen and silent acoustic glazing.',
        amenities: ['In-room mini-kitchen (microwave, Nespresso, fridge)', 'Superfast Wi-Fi', 'Pocket concierge', 'Air conditioning'],
        bookingUrl: 'https://www.residenthotels.com/the-resident-covent-garden/',
        dataSource: 'Hotel API Aggregator',
        lastUpdated: '2026-09-28T08:00:00Z'
      }
    ],

    transitGuide: {
      destinationId: 'london',
      airportToCenter: [
        {
          mode: 'Train/Metro',
          title: 'Elizabeth Line (from Heathrow Airport)',
          durationMinutes: 38,
          costSGD: 22,
          transfers: 0,
          operatingHours: '05:30 - 23:50',
          frequency: 'Every 10-15 minutes',
          notes: 'High-speed air-conditioned journey directly into Paddington, Tottenham Court Road, Liverpool Street, and Canary Wharf.'
        },
        {
          mode: 'Train/Metro',
          title: 'Piccadilly Line Tube (from Heathrow)',
          durationMinutes: 52,
          costSGD: 9.8,
          transfers: 0,
          operatingHours: '05:00 - 23:45',
          frequency: 'Every 5 minutes',
          notes: 'Most economical option directly into central London (Kings Cross, Covent Garden, Piccadilly Circus).'
        }
      ],
      cityTransitModes: [
        {
          name: 'London Underground (The Tube) & Elizabeth Line',
          description: 'The world’s oldest underground network. Daily fare capping applies automatically when tapping contactless payment.',
          efficiency: 'High',
          fareGuideSGD: 'Daily cap approx SGD 14.50 for Zone 1-2'
        },
        {
          name: 'Iconic Red Double-Decker Buses',
          description: 'Hop on for scenic transit across London with Hopper fare (unlimited bus rides within 1 hour for £1.75 / ~SGD 3).',
          efficiency: 'High',
          fareGuideSGD: 'SGD 3.00 flat fare with Hopper transfer'
        }
      ],
      recommendedPasses: [
        {
          name: 'Contactless Bank Card / Apple Pay / Google Pay',
          type: 'Direct Contactless Payment',
          priceSGD: 0,
          recommendedFor: 'Strongly recommended. Automatically gives the exact lowest daily and weekly fare cap with zero card purchase fees.',
          whereToBuy: 'Use your existing Singapore credit/debit card directly at ticket gates'
        }
      ],
      walkingFriendliness: 'Exceptional. Walking between bridges, parks, and historic squares is a highlight of London.',
      rideHailingApps: ['Uber', 'Bolt', 'Free Now (Official Black Cabs)']
    },

    carRentalOptions: [
      {
        provider: 'Enterprise Rent-A-Car UK',
        carModel: 'Vauxhall Corsa / Volkswagen Golf',
        vehicleClass: 'Compact',
        dailyRateSGD: 85,
        transmission: 'Automatic',
        pickupLocation: 'London Heathrow Airport (LHR)',
        airportPickup: true,
        fuelPolicy: 'Full to Full',
        mileage: 'Unlimited',
        insuranceIncluded: true,
        evAvailable: true,
        dataSource: 'Enterprise UK API'
      }
    ],

    advisory: {
      destinationId: 'london',
      country: 'United Kingdom',
      singaporePassportVisaStatus: 'Visa-free',
      maxStayDays: 180,
      passportValidityRequiredMonths: 6,
      electronicArrivalCardRequired: false,
      advisoryLevel: 'Normal precautions',
      keyNotes: [
        'Singapore passport holders can enter the UK visa-free for tourism up to 6 months (180 days).',
        'Eligible to use the automated UK ePassport gates at Heathrow, Gatwick, and Manchester.',
        'Keep emergency medical and travel insurance handy.'
      ],
      emergencyContactMFA: '+44 20 7244 9758 (Singapore High Commission in London)',
      lastChecked: '2026-09-28T00:00:00Z',
      source: 'MFA Singapore & UK Home Office Visas and Immigration'
    },

    defaultItineraries: {}
  }
];

export function calculateTripBudget(
  dest: DestinationDatabaseItem,
  totalDays: number,
  travellers: number,
  hotelCategory: 'budget' | 'mid' | 'premium',
  carRentalRequired: boolean,
  chosenAirline?: AirlineOption
): TripBudgetBreakdown {
  const airline = chosenAirline || dest.flightOptions[0];
  const flightTotal = airline.totalFareSGD * travellers;

  const nights = Math.max(1, totalDays - 1);
  const rooms = Math.ceil(travellers / 2);
  const nightlyRate = dest.estimatedHotelCostPerNightSGD[hotelCategory];
  const hotelTotal = nightlyRate * rooms * nights;

  const airportTransfers = (dest.transitGuide.airportToCenter[0]?.costSGD || 15) * 2 * travellers;
  const localTransport = dest.estimatedLocalTransportDailySGD * totalDays * travellers;

  let carRentalTotal = 0;
  let fuelAndParking = 0;
  if (carRentalRequired) {
    const dailyRate = dest.estimatedCarRentalDailySGD;
    carRentalTotal = dailyRate * totalDays;
    fuelAndParking = Math.round(dailyRate * 0.35 * totalDays);
  }

  const attractionsTotal = dest.estimatedActivitiesDailySGD * totalDays * travellers;
  const foodDaily = dest.estimatedFoodDailySGD;
  const foodTotal = foodDaily * totalDays * travellers;
  const insurance = Math.round(18 + totalDays * 3.5) * travellers;

  const totalTrip = flightTotal + hotelTotal + airportTransfers + localTransport + carRentalTotal + fuelAndParking + attractionsTotal + foodTotal + insurance;
  const costPerTraveller = Math.round(totalTrip / Math.max(1, travellers));
  const costPerDay = Math.round(totalTrip / Math.max(1, totalDays));
  const costPerTravellerPerDay = Math.round(costPerTraveller / Math.max(1, totalDays));

  // Tier baselines for comparison
  const budgetTier = (dest.cheapestFareSGD * travellers) + (dest.estimatedHotelCostPerNightSGD.budget * rooms * nights) + localTransport + (dest.estimatedFoodDailySGD * 0.7 * totalDays * travellers) + attractionsTotal * 0.6 + airportTransfers;
  const comfortableTier = totalTrip;
  const premiumTier = (dest.singaporeAirlinesFareSGD || dest.flightOptions[0].totalFareSGD) * travellers * 1.5 + (dest.estimatedHotelCostPerNightSGD.premium * rooms * nights) + (dest.estimatedFoodDailySGD * 2.2 * totalDays * travellers) + attractionsTotal * 1.8 + 150 * travellers;

  return {
    destinationId: dest.id,
    totalDays,
    travellers,
    cabinClass: 'economy',
    hotelCategory,
    flightTotalSGD: {
      quoted: true,
      amount: flightTotal,
      airline: airline.airline,
      source: airline.dataSource
    },
    hotelTotalSGD: {
      nights,
      nightlyRate,
      amount: hotelTotal,
      source: 'Consolidated rates from verified local providers'
    },
    airportTransfersSGD: {
      amount: airportTransfers,
      source: dest.transitGuide.airportToCenter[0]?.title || 'Standard Airport Link'
    },
    localTransportTotalSGD: {
      amount: localTransport,
      source: 'Estimated standard metro/bus/walking allowance'
    },
    carRentalTotalSGD: carRentalRequired ? {
      days: totalDays,
      dailyRate: dest.estimatedCarRentalDailySGD,
      amount: carRentalTotal,
      source: 'Avis / Toyota / Local Partner rates'
    } : undefined,
    fuelAndParkingSGD: carRentalRequired ? { amount: fuelAndParking } : undefined,
    attractionsTotalSGD: {
      amount: attractionsTotal,
      editable: true
    },
    foodTotalSGD: {
      amount: foodTotal,
      dailyPerPerson: foodDaily,
      editable: true
    },
    travelInsuranceSGD: {
      amount: insurance
    },
    totalTripSGD: Math.round(totalTrip),
    costPerTravellerSGD: costPerTraveller,
    costPerDaySGD: costPerDay,
    costPerTravellerPerDaySGD: costPerTravellerPerDay,
    budgetTierTotalSGD: Math.round(budgetTier),
    comfortableTierTotalSGD: Math.round(comfortableTier),
    premiumTierTotalSGD: Math.round(premiumTier)
  };
}

export function generateFlexibleDates(
  departureDate: string,
  returnDate: string,
  baseFareSGD: number,
  airlineName: string,
  direct: boolean
): FlexibleDateOption[] {
  const dep = new Date(departureDate);
  const ret = new Date(returnDate);

  const deltas = [-3, -1, 1, 3];
  return deltas.map(delta => {
    const newDep = new Date(dep);
    newDep.setDate(dep.getDate() + delta);
    const newRet = new Date(ret);
    newRet.setDate(ret.getDate() + delta);

    // Realistic day-of-week yield calculation (Tues/Wed/Thurs cheaper than Fri/Sun)
    const dayOfWeek = newDep.getDay();
    const isMidweek = dayOfWeek >= 2 && dayOfWeek <= 4;
    const priceFactor = isMidweek ? 0.82 : (dayOfWeek === 5 || dayOfWeek === 0 ? 1.14 : 0.94);
    const fare = Math.round(baseFareSGD * priceFactor);
    const savings = baseFareSGD - fare;

    return {
      departureDate: newDep.toISOString().split('T')[0],
      returnDate: newRet.toISOString().split('T')[0],
      daysDiff: delta,
      fareSGD: fare,
      savingsSGD: savings,
      airline: airlineName,
      isDirect: direct
    };
  });
}
