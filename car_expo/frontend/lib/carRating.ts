import { Car } from '@/components/CarCard';

export interface CarRating {
  overallScore: number; // 0-100
  breakdown: {
    value: number; // Price vs market value
    reliability: number; // Brand reputation, year, mileage
    features: number; // Available features and options
    condition: number; // Accident history, service records
    performance: number; // Engine, transmission, drivetrain
    efficiency: number; // MPG, range (for EVs)
    style: number; // Year, make/model appeal
  };
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

// Brand reliability scores (based on industry data)
const BRAND_RELIABILITY_SCORES: Record<string, number> = {
  'Toyota': 95,
  'Honda': 92,
  'Lexus': 90,
  'Mazda': 88,
  'Subaru': 87,
  'BMW': 85,
  'Audi': 84,
  'Mercedes-Benz': 83,
  'Mercedes': 83,
  'Porsche': 82,
  'Volkswagen': 80,
  'Nissan': 78,
  'Hyundai': 77,
  'Kia': 76,
  'Ford': 75,
  'Chevrolet': 74,
  'Chevy': 74,
  'GMC': 73,
  'Dodge': 70,
  'Chrysler': 68,
  'Jeep': 67,
  'Tesla': 85, // High for EVs
  'Genesis': 88,
  'Infiniti': 79,
  'Acura': 86,
  'Volvo': 81,
  'Jaguar': 75,
  'Land Rover': 70,
  'Mitsubishi': 72,
  'Buick': 76,
  'Cadillac': 78,
  'Lincoln': 77,
  'Ram': 72,
  'Alfa Romeo': 65,
  'Fiat': 60,
  'Maserati': 70,
  'Bentley': 75,
  'Rolls-Royce': 80,
  'Ferrari': 75,
  'Lamborghini': 70,
  'McLaren': 75,
  'Aston Martin': 70,
  'Lotus': 65,
  'MINI': 75,
  'Smart': 60,
  'Suzuki': 70,
  'Isuzu': 65,
  'Saab': 60,
  'Saturn': 55,
  'Pontiac': 55,
  'Oldsmobile': 50,
  'Plymouth': 50,
  'Eagle': 50,
  'Geo': 45,
  'Daewoo': 40,
  'Yugo': 30,
  'default': 70
};

// Vehicle type multipliers for different criteria
const TYPE_MULTIPLIERS = {
  'sedan': { performance: 1.0, efficiency: 1.1, style: 1.0 },
  'suv': { performance: 0.9, efficiency: 0.8, style: 1.1 },
  'truck': { performance: 1.1, efficiency: 0.7, style: 1.0 },
  'ev': { performance: 1.2, efficiency: 1.3, style: 1.2 },
  'convertible': { performance: 1.1, efficiency: 0.9, style: 1.3 },
  'coupe': { performance: 1.1, efficiency: 0.9, style: 1.2 },
  'hatchback': { performance: 1.0, efficiency: 1.1, style: 0.9 },
  'wagon': { performance: 0.9, efficiency: 1.0, style: 0.8 },
  'default': { performance: 1.0, efficiency: 1.0, style: 1.0 }
};

// Feature scoring weights
const FEATURE_WEIGHTS = {
  'Leather Seats': 8,
  'Heated Seats': 6,
  'Cooled Seats': 7,
  'Sunroof': 5,
  'Navigation': 6,
  'Bluetooth': 4,
  'Backup Camera': 5,
  'Blind Spot Monitoring': 7,
  'Lane Departure Warning': 6,
  'Adaptive Cruise Control': 8,
  'Automatic Emergency Braking': 9,
  'Apple CarPlay': 5,
  'Android Auto': 5,
  'Premium Sound System': 6,
  'All-Wheel Drive': 7,
  'Four-Wheel Drive': 7,
  'Turbocharged': 6,
  'Hybrid': 8,
  'Electric': 9,
  'Manual Transmission': 4,
  'Automatic Transmission': 5,
  'CVT': 3,
  'Keyless Entry': 4,
  'Remote Start': 5,
  'Power Windows': 3,
  'Power Locks': 3,
  'Air Conditioning': 4,
  'Cruise Control': 3,
  'ABS': 5,
  'Traction Control': 5,
  'Stability Control': 6,
  'Side Airbags': 7,
  'Curtain Airbags': 7,
  'Knee Airbags': 6,
  'Parking Sensors': 5,
  '360 Camera': 7,
  'Heated Steering Wheel': 5,
  'Memory Seats': 4,
  'Power Seats': 4,
  'Lumbar Support': 3,
  'Third Row Seating': 6,
  'Towing Package': 5,
  'Off-Road Package': 6,
  'Sport Package': 6,
  'Luxury Package': 8,
  'Technology Package': 7,
  'Safety Package': 9,
  'Comfort Package': 6
};

export function calculateCarRating(car: Car): CarRating {
  const breakdown = {
    value: calculateValueScore(car),
    reliability: calculateReliabilityScore(car),
    features: calculateFeaturesScore(car),
    condition: calculateConditionScore(car),
    performance: calculatePerformanceScore(car),
    efficiency: calculateEfficiencyScore(car),
    style: calculateStyleScore(car)
  };

  const overallScore = Math.round(
    (breakdown.value * 0.25) +
    (breakdown.reliability * 0.20) +
    (breakdown.features * 0.15) +
    (breakdown.condition * 0.15) +
    (breakdown.performance * 0.10) +
    (breakdown.efficiency * 0.10) +
    (breakdown.style * 0.05)
  );

  const { recommendations, strengths, weaknesses } = generateAnalysis(car, breakdown);

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    breakdown,
    recommendations,
    strengths,
    weaknesses
  };
}

function calculateValueScore(car: Car): number {
  let score = 70; // Higher base score

  // Price analysis - more generous
  const price = car.price;
  const year = car.year;
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  // Market value estimation (simplified)
  const estimatedMarketValue = estimateMarketValue(car);
  const priceRatio = price / estimatedMarketValue;

  if (priceRatio < 0.8) score += 25; // Great deal
  else if (priceRatio < 0.9) score += 20; // Good deal
  else if (priceRatio < 1.0) score += 15; // Fair price
  else if (priceRatio < 1.1) score += 10; // Slightly overpriced
  else if (priceRatio < 1.2) score += 5; // Overpriced but acceptable
  else score -= 5; // Significantly overpriced

  // Age factor - more generous
  if (age <= 1) score += 15;
  else if (age <= 3) score += 10;
  else if (age <= 5) score += 5;
  else if (age <= 8) score += 0;
  else score -= 5;

  return Math.min(100, Math.max(0, score));
}

function calculateReliabilityScore(car: Car): number {
  let score = 70; // Higher base score

  // Brand reliability
  const brandScore = BRAND_RELIABILITY_SCORES[car.make] || BRAND_RELIABILITY_SCORES.default;
  score = (score + brandScore) / 2;

  // Year factor - more generous
  const currentYear = new Date().getFullYear();
  const age = currentYear - car.year;
  
  if (age <= 2) score += 15; // Very new
  else if (age <= 5) score += 10; // Recent
  else if (age <= 10) score += 5; // Moderate age
  else if (age <= 15) score += 0; // Older but still good
  else score -= 5; // Very old

  // Mileage factor - more generous
  if (car.mileage) {
    const mileage = parseInt(car.mileage.replace(/[^\d]/g, ''));
    const avgMilesPerYear = mileage / Math.max(1, age);
    
    if (avgMilesPerYear < 10000) score += 15; // Low mileage
    else if (avgMilesPerYear < 15000) score += 10; // Average mileage
    else if (avgMilesPerYear < 20000) score += 5; // High mileage
    else score -= 5; // Very high mileage
  }

  return Math.min(100, Math.max(0, score));
}

function calculateFeaturesScore(car: Car): number {
  let score = 60; // Much higher base score

  // Count features from top_options or other feature indicators
  const features = car.top_options || [];
  let featureScore = 0;

  features.forEach(feature => {
    const weight = FEATURE_WEIGHTS[feature] || 2;
    featureScore += weight;
  });

  // Normalize feature score (max possible is around 200)
  score += Math.min(30, (featureScore / 6)); // More generous feature scoring

  // Transmission bonus
  if (car.transmission === 'Manual') score += 8;
  else if (car.transmission === 'Automatic') score += 5;

  // Drivetrain bonus
  if (car.drivetrain === 'AWD' || car.drivetrain === '4WD') score += 10;

  // Engine type bonus
  if (car.engine?.includes('Turbo') || car.engine?.includes('Supercharged')) score += 8;
  if (car.type === 'ev') score += 15; // EVs get bigger bonus

  return Math.min(100, Math.max(0, score));
}

function calculateConditionScore(car: Car): number {
  let score = 75; // Much higher base score

  // Accident history - more generous
  if (car.no_accidents === true) score += 20;
  else if (car.no_accidents === false) score -= 5; // Less harsh penalty

  // Service records - more generous
  if (car.service_records === true) score += 15;
  else if (car.service_records === false) score -= 5; // Less harsh penalty

  // Vehicle condition - more generous
  if (car.vehicle_condition === 'New') score += 20;
  else if (car.vehicle_condition === 'Used') score += 5; // Used cars get some points
  else if (car.vehicle_condition === 'Certified') score += 15;

  // Dealer rating (if available) - more generous
  if (car.dealer_rating && car.dealer_rating >= 4.5) score += 10;
  else if (car.dealer_rating && car.dealer_rating >= 4.0) score += 8;
  else if (car.dealer_rating && car.dealer_rating >= 3.5) score += 5;
  else if (car.dealer_rating && car.dealer_rating < 3.0) score -= 5; // Less harsh penalty

  return Math.min(100, Math.max(0, score));
}

function calculatePerformanceScore(car: Car): number {
  let score = 70; // Higher base score

  const typeMultiplier = TYPE_MULTIPLIERS[car.type] || TYPE_MULTIPLIERS.default;

  // Engine analysis - more generous
  if (car.engine) {
    if (car.engine.includes('V8')) score += 20;
    else if (car.engine.includes('V6')) score += 15;
    else if (car.engine.includes('6 Cyl')) score += 12;
    else if (car.engine.includes('4 Cyl')) score += 8;
    else if (car.engine.includes('Electric')) score += 18; // EVs get bigger bonus
  }

  // Transmission - more generous
  if (car.transmission === 'Manual') score += 10;
  else if (car.transmission === 'Automatic') score += 8;
  else if (car.transmission === 'CVT') score += 5;

  // Drivetrain - more generous
  if (car.drivetrain === 'AWD') score += 12;
  else if (car.drivetrain === '4WD') score += 10;
  else if (car.drivetrain === 'RWD') score += 8;
  else if (car.drivetrain === 'FWD') score += 5;

  // Apply type multiplier
  score *= typeMultiplier.performance;

  return Math.min(100, Math.max(0, score));
}

function calculateEfficiencyScore(car: Car): number {
  let score = 70; // Higher base score

  const typeMultiplier = TYPE_MULTIPLIERS[car.type] || TYPE_MULTIPLIERS.default;

  // EV range bonus - more generous
  if (car.type === 'ev' && car.range) {
    if (car.range >= 300) score += 25;
    else if (car.range >= 250) score += 20;
    else if (car.range >= 200) score += 15;
    else if (car.range >= 150) score += 10;
    else score += 5; // Even lower range EVs get some points
  }

  // MPG analysis (if available) - more generous
  if (car.mpg_city && car.mpg_highway) {
    const avgMPG = (parseInt(car.mpg_city) + parseInt(car.mpg_highway)) / 2;
    if (avgMPG >= 35) score += 20;
    else if (avgMPG >= 30) score += 15;
    else if (avgMPG >= 25) score += 10;
    else if (avgMPG >= 20) score += 5;
    else score += 0; // No penalty for lower MPG
  }

  // Fuel type bonus - more generous
  if (car.fuel_type === 'Electric') score += 20;
  else if (car.fuel_type === 'Hybrid') score += 15;
  else if (car.fuel_type === 'Gasoline') score += 5; // Gas cars get some points too

  // Apply type multiplier
  score *= typeMultiplier.efficiency;

  return Math.min(100, Math.max(0, score));
}

function calculateStyleScore(car: Car): number {
  let score = 75; // Much higher base score

  const typeMultiplier = TYPE_MULTIPLIERS[car.type] || TYPE_MULTIPLIERS.default;

  // Year factor - more generous
  const currentYear = new Date().getFullYear();
  const age = currentYear - car.year;
  
  if (age <= 2) score += 20;
  else if (age <= 5) score += 15;
  else if (age <= 8) score += 10;
  else if (age <= 12) score += 5;
  else if (age <= 20) score += 0;
  else score += 0; // No penalty for older cars

  // Make/model appeal (simplified) - more generous
  const luxuryBrands = ['BMW', 'Mercedes', 'Audi', 'Lexus', 'Porsche', 'Tesla', 'Genesis'];
  const sportyBrands = ['Porsche', 'BMW', 'Audi', 'Mercedes', 'Nissan', 'Subaru', 'Mazda'];
  const reliableBrands = ['Toyota', 'Honda', 'Mazda', 'Subaru'];
  
  if (luxuryBrands.includes(car.make)) score += 10;
  else if (sportyBrands.includes(car.make)) score += 8;
  else if (reliableBrands.includes(car.make)) score += 5;

  // Body style bonus - more generous
  if (car.body_style === 'Convertible') score += 15;
  else if (car.body_style === 'Coupe') score += 10;
  else if (car.body_style === 'Hatchback') score += 5;
  else score += 0; // No penalty for other body styles

  // Apply type multiplier
  score *= typeMultiplier.style;

  return Math.min(100, Math.max(0, score));
}

function estimateMarketValue(car: Car): number {
  // Simplified market value estimation
  // In a real application, this would use actual market data APIs
  
  const baseValues: Record<string, number> = {
    'Toyota': 25000,
    'Honda': 24000,
    'BMW': 45000,
    'Mercedes': 50000,
    'Audi': 42000,
    'Porsche': 80000,
    'Tesla': 55000,
    'Ford': 28000,
    'Chevrolet': 26000,
    'Nissan': 22000,
    'Hyundai': 20000,
    'Kia': 19000,
    'Subaru': 27000,
    'Mazda': 23000,
    'Lexus': 40000,
    'Infiniti': 35000,
    'Acura': 32000,
    'Volvo': 38000,
    'Jaguar': 45000,
    'Land Rover': 55000,
    'Genesis': 45000,
    'default': 25000
  };

  const baseValue = baseValues[car.make] || baseValues.default;
  const currentYear = new Date().getFullYear();
  const age = currentYear - car.year;
  
  // Depreciation (simplified)
  let depreciation = 0;
  for (let i = 0; i < age; i++) {
    if (i === 0) depreciation += 0.20; // 20% first year
    else if (i < 3) depreciation += 0.15; // 15% next 2 years
    else if (i < 5) depreciation += 0.10; // 10% next 2 years
    else depreciation += 0.08; // 8% thereafter
  }

  return baseValue * (1 - Math.min(0.8, depreciation));
}

function generateAnalysis(car: Car, breakdown: CarRating['breakdown']): {
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
} {
  const recommendations: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Value analysis
  if (breakdown.value >= 80) strengths.push('Excellent value for money');
  else if (breakdown.value <= 40) weaknesses.push('May be overpriced for the market');

  // Reliability analysis
  if (breakdown.reliability >= 85) strengths.push('Highly reliable brand and model');
  else if (breakdown.reliability <= 50) weaknesses.push('Reliability concerns due to age or brand');

  // Features analysis
  if (breakdown.features >= 80) strengths.push('Well-equipped with modern features');
  else if (breakdown.features <= 40) weaknesses.push('Limited features and options');

  // Condition analysis
  if (breakdown.condition >= 85) strengths.push('Excellent condition with clean history');
  else if (breakdown.condition <= 50) weaknesses.push('Condition concerns or accident history');

  // Performance analysis
  if (breakdown.performance >= 80) strengths.push('Strong performance characteristics');
  else if (breakdown.performance <= 40) weaknesses.push('Limited performance capabilities');

  // Efficiency analysis
  if (breakdown.efficiency >= 80) strengths.push('Excellent fuel efficiency or range');
  else if (breakdown.efficiency <= 40) weaknesses.push('Poor fuel efficiency');

  // Generate recommendations
  if (breakdown.value < 60) recommendations.push('Consider negotiating the price or looking for similar models');
  if (breakdown.reliability < 60) recommendations.push('Research common issues for this make/model/year');
  if (breakdown.features < 50) recommendations.push('Consider aftermarket upgrades for missing features');
  if (breakdown.condition < 60) recommendations.push('Get a professional inspection before purchase');
  if (breakdown.performance < 50) recommendations.push('Test drive to ensure performance meets your needs');
  if (breakdown.efficiency < 50) recommendations.push('Consider fuel costs in your budget calculations');

  // Overall recommendations
  if (breakdown.overallScore >= 85) recommendations.push('This is an excellent choice with strong scores across all categories');
  else if (breakdown.overallScore >= 70) recommendations.push('This is a good choice with solid performance in most areas');
  else if (breakdown.overallScore >= 55) recommendations.push('This car has some trade-offs - consider your priorities carefully');
  else recommendations.push('Consider other options or negotiate significant improvements');

  return { recommendations, strengths, weaknesses };
}

// Utility function to get rating grade
export function getRatingGrade(score: number): { grade: string; color: string; description: string } {
  if (score >= 90) return { grade: 'A+', color: '#10B981', description: 'Exceptional' };
  if (score >= 85) return { grade: 'A', color: '#10B981', description: 'Excellent' };
  if (score >= 80) return { grade: 'A-', color: '#34D399', description: 'Very Good' };
  if (score >= 75) return { grade: 'B+', color: '#34D399', description: 'Good' };
  if (score >= 70) return { grade: 'B', color: '#FBBF24', description: 'Above Average' };
  if (score >= 65) return { grade: 'B-', color: '#FBBF24', description: 'Average' };
  if (score >= 60) return { grade: 'C+', color: '#F59E0B', description: 'Below Average' };
  if (score >= 55) return { grade: 'C', color: '#F59E0B', description: 'Fair' };
  if (score >= 50) return { grade: 'C-', color: '#EF4444', description: 'Poor' };
  if (score >= 40) return { grade: 'D', color: '#EF4444', description: 'Very Poor' };
  return { grade: 'F', color: '#DC2626', description: 'Avoid' };
}