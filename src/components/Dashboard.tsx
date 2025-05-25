
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { CalorieProgress } from './CalorieProgress';
import { MacroBreakdown } from './MacroBreakdown';
import { MealTimeline } from './MealTimeline';
import { QuickAddMeal } from './QuickAddMeal';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { userProfile, getCurrentDayStats, setIsOnboarded } = useApp();
  const dayStats = getCurrentDayStats();

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('fittrack-profile');
    localStorage.removeItem('fittrack-onboarded');
    
    // Clear today's meals
    const today = new Date().toISOString().split('T')[0];
    localStorage.removeItem(`fittrack-meals-${today}`);
    
    // Reset onboarding state
    setIsOnboarded(false);
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header with logout */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {userProfile.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your nutrition and reach your fitness goals
            </p>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <CalorieProgress 
              consumed={dayStats.totalCalories}
              target={userProfile.targetCalories}
            />
          </div>
          <div>
            <MacroBreakdown 
              protein={{ consumed: dayStats.totalProtein, target: userProfile.targetProtein }}
              carbs={{ consumed: dayStats.totalCarbs, target: userProfile.targetCarbs }}
              fats={{ consumed: dayStats.totalFats, target: userProfile.targetFats }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <QuickAddMeal />
          </div>
          <div>
            <MealTimeline meals={dayStats.meals} />
          </div>
        </div>
      </div>
    </div>
  );
};
