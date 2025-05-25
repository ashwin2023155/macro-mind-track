
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useApp } from '../contexts/AppContext';
import { UserProfile } from '../types';
import { Activity, Target, User, Ruler } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { setUserProfile } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    weight: 70,
    height: 170,
    waist: 80,
    hip: 95,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain'
  });

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const profile: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || 'User',
        age: formData.age || 25,
        weight: formData.weight || 70,
        height: formData.height || 170,
        waist: formData.waist || 80,
        hip: formData.hip || 95,
        gender: formData.gender || 'male',
        activityLevel: formData.activityLevel || 'moderate',
        goal: formData.goal || 'maintain',
        targetCalories: 0,
        targetProtein: 0,
        targetCarbs: 0,
        targetFats: 0
      };
      setUserProfile(profile);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 animate-scale-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Activity className="h-8 w-8 text-fittrack-400" />
            FitTrackAI
          </CardTitle>
          <p className="text-slate-400">Step {step} of 4</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-white mb-4">
                <User className="h-5 w-5 text-fittrack-400" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-white">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange('gender', value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="text-white">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="text-white">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-white mb-4">
                <Ruler className="h-5 w-5 text-fittrack-400" />
                <h3 className="text-lg font-semibold">Body Measurements</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-white">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-white">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waist" className="text-white">Waist (cm)</Label>
                  <Input
                    id="waist"
                    type="number"
                    value={formData.waist}
                    onChange={(e) => handleInputChange('waist', parseFloat(e.target.value))}
                    placeholder="Measure at narrowest point"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hip" className="text-white">Hip (cm)</Label>
                  <Input
                    id="hip"
                    type="number"
                    value={formData.hip}
                    onChange={(e) => handleInputChange('hip', parseFloat(e.target.value))}
                    placeholder="Measure at widest point"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-white mb-4">
                <Activity className="h-5 w-5 text-fittrack-400" />
                <h3 className="text-lg font-semibold">Activity Level</h3>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">How active are you?</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) => handleInputChange('activityLevel', value)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                    <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="very-active">Very Active (very hard exercise/physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-white mb-4">
                <Target className="h-5 w-5 text-fittrack-400" />
                <h3 className="text-lg font-semibold">Fitness Goal</h3>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">What's your primary goal?</Label>
                <RadioGroup
                  value={formData.goal}
                  onValueChange={(value) => handleInputChange('goal', value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-700">
                    <RadioGroupItem value="lose" id="lose" />
                    <Label htmlFor="lose" className="text-white cursor-pointer">
                      <div>
                        <div className="font-semibold">Weight Loss</div>
                        <div className="text-sm text-slate-400">Lose weight with a calorie deficit</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-700">
                    <RadioGroupItem value="maintain" id="maintain" />
                    <Label htmlFor="maintain" className="text-white cursor-pointer">
                      <div>
                        <div className="font-semibold">Maintain Weight</div>
                        <div className="text-sm text-slate-400">Maintain current weight</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-700">
                    <RadioGroupItem value="gain" id="gain" />
                    <Label htmlFor="gain" className="text-white cursor-pointer">
                      <div>
                        <div className="font-semibold">Weight Gain</div>
                        <div className="text-sm text-slate-400">Gain weight with a calorie surplus</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 bg-fittrack-600 hover:bg-fittrack-700 text-white"
            >
              {step === 4 ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
