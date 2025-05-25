import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, DayStats, Meal, FoodItem } from '../types';
import { calculateMaintenance, calculateMacros } from '../utils/calculations';

interface AppContextType {
  userProfile: UserProfile | null;
  currentDayStats: DayStats | null;
  setUserProfile: (profile: UserProfile) => void;
  addMeal: (meal: Meal) => void;
  updateMeal: (mealId: string, updatedMeal: Meal) => void;
  deleteMeal: (mealId: string) => void;
  getCurrentDayStats: () => DayStats;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [currentDayStats, setCurrentDayStats] = useState<DayStats | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Load from localStorage
    const savedProfile = localStorage.getItem('fittrack-profile');
    const savedOnboarded = localStorage.getItem('fittrack-onboarded');
    const savedMeals = localStorage.getItem(`fittrack-meals-${today}`);

    if (savedProfile) {
      setUserProfileState(JSON.parse(savedProfile));
    }

    if (savedOnboarded === 'true') {
      setIsOnboarded(true);
    }

    if (savedMeals) {
      setCurrentDayStats(JSON.parse(savedMeals));
    } else {
      setCurrentDayStats({
        date: today,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0,
        meals: []
      });
    }
  }, [today]);

  const setUserProfile = (profile: UserProfile) => {
    console.log('Setting user profile with measurements:', {
      height: profile.height,
      weight: profile.weight,
      waist: profile.waist,
      hip: profile.hip,
      neck: profile.neck,
      gender: profile.gender
    });
    
    const targetCalories = calculateMaintenance(profile);
    const macros = calculateMacros(targetCalories);
    
    console.log('Calculated maintenance calories:', targetCalories);
    console.log('Calculated macros:', macros);
    
    const completeProfile = {
      ...profile,
      targetCalories,
      targetProtein: macros.protein,
      targetCarbs: macros.carbs,
      targetFats: macros.fats
    };

    setUserProfileState(completeProfile);
    localStorage.setItem('fittrack-profile', JSON.stringify(completeProfile));
    setIsOnboarded(true);
    localStorage.setItem('fittrack-onboarded', 'true');
  };

  const calculateTotals = (meals: Meal[]) => {
    return meals.reduce(
      (totals, meal) => ({
        totalCalories: totals.totalCalories + meal.totalCalories,
        totalProtein: totals.totalProtein + meal.totalProtein,
        totalCarbs: totals.totalCarbs + meal.totalCarbs,
        totalFats: totals.totalFats + meal.totalFats
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 }
    );
  };

  const addMeal = (meal: Meal) => {
    const updatedMeals = [...(currentDayStats?.meals || []), meal];
    const totals = calculateTotals(updatedMeals);
    
    const newDayStats: DayStats = {
      date: today,
      ...totals,
      meals: updatedMeals
    };

    setCurrentDayStats(newDayStats);
    localStorage.setItem(`fittrack-meals-${today}`, JSON.stringify(newDayStats));
  };

  const updateMeal = (mealId: string, updatedMeal: Meal) => {
    const updatedMeals = currentDayStats?.meals.map(meal => 
      meal.id === mealId ? updatedMeal : meal
    ) || [];
    
    const totals = calculateTotals(updatedMeals);
    
    const newDayStats: DayStats = {
      date: today,
      ...totals,
      meals: updatedMeals
    };

    setCurrentDayStats(newDayStats);
    localStorage.setItem(`fittrack-meals-${today}`, JSON.stringify(newDayStats));
  };

  const deleteMeal = (mealId: string) => {
    const updatedMeals = currentDayStats?.meals.filter(meal => meal.id !== mealId) || [];
    const totals = calculateTotals(updatedMeals);
    
    const newDayStats: DayStats = {
      date: today,
      ...totals,
      meals: updatedMeals
    };

    setCurrentDayStats(newDayStats);
    localStorage.setItem(`fittrack-meals-${today}`, JSON.stringify(newDayStats));
  };

  const getCurrentDayStats = (): DayStats => {
    return currentDayStats || {
      date: today,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      meals: []
    };
  };

  return (
    <AppContext.Provider value={{
      userProfile,
      currentDayStats,
      setUserProfile,
      addMeal,
      updateMeal,
      deleteMeal,
      getCurrentDayStats,
      isOnboarded,
      setIsOnboarded
    }}>
      {children}
    </AppContext.Provider>
  );
};
