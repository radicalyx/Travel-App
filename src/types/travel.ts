export type DistanceCategory = 'nearby' | 'mid' | 'far';

export type TravelStyle = 'relaxed' | 'balanced' | 'packed' | 'budget' | 'premium';

export type ActivityTag =
  | 'beach'
  | 'city'
  | 'nature'
  | 'family'
  | 'food'
  | 'shopping'
  | 'culture'
  | 'adventure'
  | 'relaxation'
  | 'luxury'
  | 'budget';

export interface UserSearchQuery {
  origin: string; // e.g. "SIN"
  originCity: string; // "Singapore"
  destinationId?: string; // Selected destination ID e.g. "bangkok", "tokyo", or "all" for any
  destinationName?: string; // Selected destination display name
  departureDate: string; // "YYYY-MM-DD"
  returnDate: string; // "YYYY-MM-DD"
  adults: number;
  children: number;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  budget?: number; // Total budget in SGD
  travelStyle: TravelStyle;
  preferredClimate?: 'tropical' | 'mild' | 'cold' | 'snow' | 'any';
  activities: ActivityTag[];
  hotelCategory: 'budget' | 'mid' | 'premium';
  carRentalRequired: boolean;
  directOnly: boolean;
  flexibleDays?: 0 | 1 | 3 | 7;
}

export interface AirlineOption {
  airline: string;
  airlineCode: string;
  isSingaporeAirlines: boolean;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  isDirect: boolean;
  stops: number;
  stopoverAirport?: string;
  cabinClass: string;
  baggageAllowance: string;
  baseFareSGD: number;
  taxesSGD: number;
  totalFareSGD: number;
  dataSource: string;
  lastUpdated: string;
  classification?: 'Best Value' | 'Lowest Fare' | 'Shortest Travel Time' | 'Singapore Airlines';
  dealTag?: 'Below Typical Range' | 'Within Typical Range' | 'Above Typical Range';
  dealDiffPercent?: number; // e.g. -18% means 18% below typical
}

export interface WeatherInfo {
  type: 'forecast' | 'historical_climate';
  tempMinC: number;
  tempMaxC: number;
  condition: string;
  precipitationChancePercent: number;
  recommendation: string;
  retrievedAt: string;
  source: string;
}

export interface DestinationCard {
  id: string;
  name: string;
  country: string;
  code: string; // Airport code e.g. BKK, HND, LHR
  category: DistanceCategory;
  flightDurationMinutes: number;
  directFlightAvailable: boolean;
  typicalSeason: string;
  bestMonths: string[];
  climate: 'tropical' | 'mild' | 'cold' | 'snow';
  tags: ActivityTag[];
  
  // Real / calculated airfares
  currentEstimatedFareSGD: number;
  singaporeAirlinesFareSGD?: number;
  cheapestAlternativeAirline: string;
  cheapestFareSGD: number;
  competingAirlines: string[];
  historicalFareRangeSGD: { min: number; max: number; avg: number };
  dealTag?: 'Below Typical Range' | 'Within Typical Range' | 'Above Typical Range';
  dealDiffPercent?: number;

  // Breakdown costs (per person / for trip)
  estimatedHotelCostPerNightSGD: { budget: number; mid: number; premium: number };
  estimatedLocalTransportDailySGD: number;
  estimatedCarRentalDailySGD: number;
  estimatedFoodDailySGD: number;
  estimatedActivitiesDailySGD: number;

  // Overview
  suitabilityReason: string;
  travelConsiderations: string[];
  publicTransportRating: 'Exceptional' | 'Good' | 'Moderate' | 'Car Recommended';
  carRentalUsefulness: 'Not Needed' | 'Optional' | 'Recommended' | 'Essential';
  suggestedDays: number;
  topAttractions: string[];

  // Image & Visual styling
  gradientTheme: string;
  accentColor: string;
  coordinates: { lat: number; lng: number };
  dataSource: string;
  lastUpdated: string;
}

export interface AccommodationOption {
  id: string;
  name: string;
  destinationId: string;
  tier: 'budget' | 'mid' | 'premium';
  type: 'Hotel' | 'Boutique Hotel' | 'Serviced Apartment' | 'Resort';
  neighborhood: string;
  nightlyPriceSGD: number;
  rating: number; // e.g. 4.7
  reviewsCount: number;
  distanceToTransit: string;
  distanceToAttractions: string;
  convenienceReason: string;
  amenities: string[];
  bookingUrl: string;
  dataSource: string;
  lastUpdated: string;
}

export interface TransitOption {
  mode: 'Train/Metro' | 'Airport Express' | 'Bus' | 'Taxi/Grab' | 'Shuttle';
  title: string;
  durationMinutes: number;
  costSGD: number;
  transfers: number;
  operatingHours: string;
  frequency: string;
  notes: string;
}

export interface DestinationTransitGuide {
  destinationId: string;
  airportToCenter: TransitOption[];
  cityTransitModes: {
    name: string;
    description: string;
    efficiency: 'High' | 'Medium' | 'Low';
    fareGuideSGD: string;
  }[];
  recommendedPasses: {
    name: string;
    type: string;
    priceSGD: number;
    recommendedFor: string;
    whereToBuy: string;
  }[];
  walkingFriendliness: string;
  rideHailingApps: string[];
}

export interface CarRentalOption {
  provider: string;
  carModel: string;
  vehicleClass: 'Economy' | 'Compact' | 'SUV' | 'Luxury' | 'EV';
  dailyRateSGD: number;
  transmission: 'Automatic' | 'Manual';
  pickupLocation: string;
  airportPickup: boolean;
  fuelPolicy: string;
  mileage: string;
  insuranceIncluded: boolean;
  evAvailable: boolean;
  dataSource: string;
}

export interface ItineraryActivity {
  timeSlot: 'Morning' | 'Lunch' | 'Afternoon' | 'Dinner' | 'Evening';
  timeEstimate: string; // e.g. "09:00 - 11:30"
  title: string;
  location: string;
  description: string;
  costSGD: number;
  category: string;
  transitFromPrevious?: {
    mode: string;
    durationMinutes: number;
    instructions: string;
    fareSGD: number;
  };
}

export interface ItineraryDay {
  dayNumber: number;
  dateStr: string;
  theme: string;
  summary: string;
  activities: ItineraryActivity[];
}

export interface CompleteItinerary {
  destinationId: string;
  destinationName: string;
  travelStyle: TravelStyle;
  totalDays: number;
  overview: string;
  paceDescription: string;
  days: ItineraryDay[];
  generatedBy: 'Gemini AI' | 'Rule-based Precision Engine';
  generatedAt: string;
}

export interface TripBudgetBreakdown {
  destinationId: string;
  totalDays: number;
  travellers: number;
  cabinClass: string;
  hotelCategory: 'budget' | 'mid' | 'premium';
  
  // Costs (Total for all travellers in SGD)
  flightTotalSGD: { quoted: boolean; amount: number; airline: string; source: string };
  hotelTotalSGD: { nights: number; nightlyRate: number; amount: number; source: string };
  airportTransfersSGD: { amount: number; source: string };
  localTransportTotalSGD: { amount: number; source: string };
  carRentalTotalSGD?: { days: number; dailyRate: number; amount: number; source: string };
  fuelAndParkingSGD?: { amount: number };
  attractionsTotalSGD: { amount: number; editable: boolean };
  foodTotalSGD: { amount: number; dailyPerPerson: number; editable: boolean };
  travelInsuranceSGD: { amount: number };
  
  totalTripSGD: number;
  costPerTravellerSGD: number;
  costPerDaySGD: number;
  costPerTravellerPerDaySGD: number;
  
  // Tiers for comparison
  budgetTierTotalSGD: number;
  comfortableTierTotalSGD: number;
  premiumTierTotalSGD: number;
}

export interface TravelAdvisory {
  destinationId: string;
  country: string;
  singaporePassportVisaStatus: 'Visa-free' | 'Visa on Arrival' | 'eVisa / Electronic Travel Authority' | 'Visa Required';
  maxStayDays: number;
  passportValidityRequiredMonths: number;
  electronicArrivalCardRequired: boolean;
  arrivalCardName?: string;
  advisoryLevel: 'Normal precautions' | 'Exercise increased caution' | 'Reconsider travel' | 'Do not travel';
  keyNotes: string[];
  emergencyContactMFA: string;
  lastChecked: string;
  source: string;
}

export interface FlexibleDateOption {
  departureDate: string;
  returnDate: string;
  daysDiff: number;
  fareSGD: number;
  savingsSGD: number;
  airline: string;
  isDirect: boolean;
}
