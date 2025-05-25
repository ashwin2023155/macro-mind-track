import { UserProfile, FoodItem } from '../types';

export const calculateMaintenance = (profile: UserProfile): number => {
  // Using U.S. Navy Method for body fat percentage calculation
  const bodyFatPercentage = calculateBodyFatPercentageNavyMethod(profile);
  const leanBodyMass = profile.weight * (1 - bodyFatPercentage / 100);
  
  // BMR = 370 + (21.6 × LBM)
  const bmr = 370 + (21.6 * leanBodyMass);

  // Activity multipliers
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

const calculateBodyFatPercentageNavyMethod = (profile: UserProfile): number => {
  const { weight, height, waist, hip, neck, gender } = profile;
  
  if (gender === 'male') {
    // For men: Body Fat % = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76
    const bodyFatPercentage = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
    return Math.max(3, Math.min(50, bodyFatPercentage)); // Clamp between reasonable values
  } else {
    // For women: Body Fat % = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387
    const bodyFatPercentage = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
    return Math.max(10, Math.min(60, bodyFatPercentage)); // Clamp between reasonable values
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
