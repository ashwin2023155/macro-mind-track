
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '../contexts/AppContext';
import { CalorieProgress } from './CalorieProgress';
import { MacroBreakdown } from './MacroBreakdown';
import { MealTimeline } from './MealTimeline';
import { QuickAddMeal } from './QuickAddMeal';
import { Activity, Target, Clock, Utensils } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { userProfile, currentDayStats } = useApp();

  if (!userProfile || !currentDayStats) {
    return <div>Loading...</div>;
  }

  const caloriesRemaining = userProfile.targetCalories - currentDayStats.totalCalories;
  const proteinRemaining = userProfile.targetProtein - currentDayStats.totalProtein;
  const carbsRemaining = userProfile.targetCarbs - currentDayStats.totalCarbs;
  const fatsRemaining = userProfile.targetFats - currentDayStats.totalFats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Activity className="h-8 w-8 text-fittrack-400" />
              FitTrackAI
            </h1>
            <p className="text-slate-400">Welcome back, {userProfile.name}!</p>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">{new Date().toLocaleDateString()}</p>
            <p className="text-slate-400 text-sm">Today's Progress</p>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calorie Progress */}
          <div className="lg:col-span-2">
            <CalorieProgress
              consumed={currentDayStats.totalCalories}
              target={userProfile.targetCalories}
              remaining={caloriesRemaining}
            />
          </div>

          {/* Quick Stats */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-fittrack-400" />
                Daily Targets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Calories</span>
                  <span className="text-white">{currentDayStats.totalCalories}/{userProfile.targetCalories}</span>
                </div>
                <Progress 
                  value={(currentDayStats.totalCalories / userProfile.targetCalories) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Protein</span>
                  <span className="text-white">{Math.round(currentDayStats.totalProtein)}g/{userProfile.targetProtein}g</span>
                </div>
                <Progress 
                  value={(currentDayStats.totalProtein / userProfile.targetProtein) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Carbs</span>
                  <span className="text-white">{Math.round(currentDayStats.totalCarbs)}g/{userProfile.targetCarbs}g</span>
                </div>
                <Progress 
                  value={(currentDayStats.totalCarbs / userProfile.targetCarbs) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Fats</span>
                  <span className="text-white">{Math.round(currentDayStats.totalFats)}g/{userProfile.targetFats}g</span>
                </div>
                <Progress 
                  value={(currentDayStats.totalFats / userProfile.targetFats) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Macro Breakdown */}
          <MacroBreakdown
            consumed={{
              protein: currentDayStats.totalProtein,
              carbs: currentDayStats.totalCarbs,
              fats: currentDayStats.totalFats
            }}
            targets={{
              protein: userProfile.targetProtein,
              carbs: userProfile.targetCarbs,
              fats: userProfile.targetFats
            }}
          />

          {/* Quick Add Meal */}
          <QuickAddMeal />
        </div>

        {/* Meal Timeline */}
        <MealTimeline meals={currentDayStats.meals} />
      </div>
    </div>
  );
};
