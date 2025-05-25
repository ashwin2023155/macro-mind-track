
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../contexts/AppContext';
import { parseNaturalLanguageFood } from '../utils/calculations';
import { FoodItem, Meal } from '../types';
import { Plus, Sparkles, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const QuickAddMeal: React.FC = () => {
  const { addMeal } = useApp();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [parsedFoods, setParsedFoods] = useState<FoodItem[]>([]);
  const [showParsed, setShowParsed] = useState(false);

  const handleParseInput = () => {
    if (!input.trim()) return;

    const foods = parseNaturalLanguageFood(input);
    if (foods.length > 0) {
      setParsedFoods(foods);
      setShowParsed(true);
    } else {
      toast({
        title: "Couldn't parse your input",
        description: "Try describing your meal like '200g rice, 100g chicken, 1 apple'",
        variant: "destructive"
      });
    }
  };

  const removeFoodItem = (id: string) => {
    setParsedFoods(prev => prev.filter(food => food.id !== id));
  };

  const handleAddMeal = () => {
    if (parsedFoods.length === 0) {
      toast({
        title: "No foods to add",
        description: "Please parse some foods first",
        variant: "destructive"
      });
      return;
    }

    const totalCalories = parsedFoods.reduce((sum, food) => sum + food.calories, 0);
    const totalProtein = parsedFoods.reduce((sum, food) => sum + food.protein, 0);
    const totalCarbs = parsedFoods.reduce((sum, food) => sum + food.carbs, 0);
    const totalFats = parsedFoods.reduce((sum, food) => sum + food.fats, 0);

    const meal: Meal = {
      id: Math.random().toString(36).substr(2, 9),
      type: mealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      foods: parsedFoods,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFats
    };

    addMeal(meal);
    
    // Reset form
    setInput('');
    setParsedFoods([]);
    setShowParsed(false);

    toast({
      title: "Meal added successfully!",
      description: `Added ${parsedFoods.length} food items to your ${mealType}`,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Plus className="h-5 w-5 text-fittrack-400" />
          Quick Add Meal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mealType" className="text-white">Meal Type</Label>
          <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="foodInput" className="text-white">Describe your meal</Label>
          <div className="flex gap-2">
            <Input
              id="foodInput"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 200g rice, 100g chicken, 1 apple"
              className="bg-slate-700 border-slate-600 text-white flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleParseInput()}
            />
            <Button
              onClick={handleParseInput}
              size="icon"
              className="bg-fittrack-600 hover:bg-fittrack-700"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-400">
            Use natural language like "2 eggs", "100g rice", "1 banana"
          </p>
        </div>

        {showParsed && parsedFoods.length > 0 && (
          <div className="space-y-3 p-4 bg-slate-700 rounded-lg animate-fade-in">
            <div className="flex justify-between items-center">
              <h4 className="text-white font-medium">Detected Foods:</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowParsed(false);
                  setParsedFoods([]);
                }}
                className="text-slate-400 hover:text-white"
              >
                Clear
              </Button>
            </div>
            
            <div className="space-y-2">
              {parsedFoods.map((food) => (
                <div key={food.id} className="flex items-center justify-between p-2 bg-slate-600 rounded">
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {food.quantity}{food.unit} {food.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fats}g fat
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFoodItem(food.id)}
                    className="text-red-400 hover:text-red-300 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-600">
              <div className="text-sm text-white">
                Total: {parsedFoods.reduce((sum, food) => sum + food.calories, 0)} calories
              </div>
            </div>

            <Button
              onClick={handleAddMeal}
              className="w-full bg-fittrack-600 hover:bg-fittrack-700 text-white"
            >
              Add to {mealType}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
