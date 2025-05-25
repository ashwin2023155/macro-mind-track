
import { UserProfile, FoodItem } from '../types';

export const calculateMaintenance = (profile: UserProfile): number => {
  // Using Katch-McArdle formula which is more accurate when body composition is known
  // First calculate body fat percentage using waist-to-hip ratio and other measurements
  const bodyFatPercentage = calculateBodyFatPercentage(profile);
  const leanBodyMass = profile.weight * (1 - bodyFatPercentage / 100);
  
  // Katch-McArdle formula: BMR = 370 + (21.6 × lean body mass in kg)
  const bmr = 370 + (21.6 * leanBodyMass);

  // Activity multipliers (more precise)
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9
  };

  const maintenance = bmr * activityMultipliers[profile.activityLevel];

  // Goal adjustment
  switch (profile.goal) {
    case 'lose':
      return Math.round(maintenance - 500); // 500 calorie deficit
    case 'gain':
      return Math.round(maintenance + 300); // 300 calorie surplus
    default:
      return Math.round(maintenance);
  }
};

const calculateBodyFatPercentage = (profile: UserProfile): number => {
  const { weight, height, waist, hip, gender, age } = profile;
  
  if (gender === 'male') {
    // Navy method for men: uses waist and neck (we'll use hip as approximation)
    // BF% = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    const waistToHeightRatio = waist / height;
    const bmi = weight / ((height / 100) ** 2);
    
    // Simplified formula incorporating waist measurement
    return Math.max(8, Math.min(35, 1.2 * bmi + 0.23 * age - 16.2 + (waistToHeightRatio * 100 - 50) * 0.5));
  } else {
    // For women, using waist-to-hip ratio
    const waistToHipRatio = waist / hip;
    const bmi = weight / ((height / 100) ** 2);
    
    // Enhanced formula for women
    return Math.max(12, Math.min(45, 1.2 * bmi + 0.23 * age - 5.4 + (waistToHipRatio - 0.7) * 100 * 0.3));
  }
};

export const calculateMacros = (targetCalories: number) => {
  // Standard macro distribution: 30% protein, 40% carbs, 30% fats
  const protein = Math.round((targetCalories * 0.30) / 4); // 4 calories per gram
  const carbs = Math.round((targetCalories * 0.40) / 4);   // 4 calories per gram
  const fats = Math.round((targetCalories * 0.30) / 9);    // 9 calories per gram
  
  return { protein, carbs, fats };
};

export const parseNaturalLanguageFood = (input: string): FoodItem[] => {
  // Simple parsing logic - in a real app, this would use AI
  const foods: FoodItem[] = [];
  const commonFoods: Record<string, { calories: number; protein: number; carbs: number; fats: number }> = {
    'rice': { calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
    'dal': { calories: 116, protein: 9, carbs: 20, fats: 0.4 },
    'egg': { calories: 70, protein: 6, carbs: 0.6, fats: 5 },
    'chicken': { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    'toast': { calories: 79, protein: 2.3, carbs: 13, fats: 1.2 },
    'banana': { calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
    'apple': { calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
    'salad': { calories: 20, protein: 1, carbs: 4, fats: 0.1 }
  };

  // Simple regex to extract quantity and food items
  const regex = /(\d+)\s*(?:g|grams?|pieces?|cups?|slices?)?\s+([a-zA-Z]+)/gi;
  let match;

  while ((match = regex.exec(input)) !== null) {
    const quantity = parseInt(match[1]);
    const foodName = match[2].toLowerCase();
    
    if (commonFoods[foodName]) {
      const baseNutrition = commonFoods[foodName];
      const factor = quantity / 100; // assuming base values are per 100g
      
      foods.push({
        id: Math.random().toString(36).substr(2, 9),
        name: foodName,
        quantity,
        unit: 'g',
        calories: Math.round(baseNutrition.calories * factor),
        protein: Math.round(baseNutrition.protein * factor * 10) / 10,
        carbs: Math.round(baseNutrition.carbs * factor * 10) / 10,
        fats: Math.round(baseNutrition.fats * factor * 10) / 10
      });
    }
  }

  return foods;
};
