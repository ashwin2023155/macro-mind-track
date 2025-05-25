
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../contexts/AppContext';
import { Meal } from '../types';
import { Clock, Utensils, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MealTimelineProps {
  meals: Meal[];
}

export const MealTimeline: React.FC<MealTimelineProps> = ({ meals }) => {
  const { deleteMeal } = useApp();
  const { toast } = useToast();

  const handleDeleteMeal = (mealId: string) => {
    deleteMeal(mealId);
    toast({
      title: "Meal deleted",
      description: "The meal has been removed from your log",
    });
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-yellow-500';
      case 'lunch':
        return 'bg-blue-500';
      case 'dinner':
        return 'bg-purple-500';
      case 'snack':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const sortedMeals = [...meals].sort((a, b) => {
    const timeA = new Date(`${a.date} ${a.time}`).getTime();
    const timeB = new Date(`${b.date} ${b.time}`).getTime();
    return timeA - timeB;
  });

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-fittrack-400" />
          Today's Meals
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedMeals.length === 0 ? (
          <div className="text-center py-8">
            <Utensils className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No meals logged yet today</p>
            <p className="text-slate-500 text-sm">Start by adding your first meal above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMeals.map((meal, index) => (
              <div key={meal.id} className="relative animate-fade-in">
                {/* Timeline line */}
                {index !== sortedMeals.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-slate-600"></div>
                )}
                
                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className={`w-3 h-3 rounded-full mt-2 ${getMealTypeColor(meal.type)}`}></div>
                  
                  {/* Meal content */}
                  <div className="flex-1 bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {meal.type}
                          </Badge>
                          <span className="text-slate-400 text-sm">{meal.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white p-1 h-auto"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="text-red-400 hover:text-red-300 p-1 h-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Food items */}
                    <div className="space-y-2 mb-3">
                      {meal.foods.map((food) => (
                        <div key={food.id} className="flex justify-between items-center text-sm">
                          <span className="text-white">
                            {food.quantity}{food.unit} {food.name}
                          </span>
                          <span className="text-slate-400">
                            {food.calories} cal
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Meal totals */}
                    <div className="border-t border-slate-600 pt-3">
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-orange-400 font-semibold">{meal.totalCalories}</div>
                          <div className="text-slate-400">cal</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-semibold">{Math.round(meal.totalProtein)}g</div>
                          <div className="text-slate-400">protein</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-semibold">{Math.round(meal.totalCarbs)}g</div>
                          <div className="text-slate-400">carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-semibold">{Math.round(meal.totalFats)}g</div>
                          <div className="text-slate-400">fat</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
