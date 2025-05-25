
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '../contexts/AppContext';
import { Bot, Send, User, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export const AIChat: React.FC = () => {
  const { userProfile, currentDayStats } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your FitTrack AI assistant. I can help you track calories, suggest meals, or answer nutrition questions. Try asking me 'How many calories do I have left today?' or 'Suggest a high-protein snack'.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (!userProfile || !currentDayStats) {
      return "Please complete your profile setup first to get personalized assistance.";
    }

    const caloriesRemaining = userProfile.targetCalories - currentDayStats.totalCalories;
    const proteinRemaining = userProfile.targetProtein - currentDayStats.totalProtein;

    // Calories remaining queries
    if (lowerMessage.includes('calories') && (lowerMessage.includes('left') || lowerMessage.includes('remaining'))) {
      if (caloriesRemaining > 0) {
        return `You have ${caloriesRemaining} calories remaining for today! You've consumed ${currentDayStats.totalCalories} out of your ${userProfile.targetCalories} calorie target.`;
      } else {
        return `You've exceeded your calorie target by ${Math.abs(caloriesRemaining)} calories today. You've consumed ${currentDayStats.totalCalories} calories.`;
      }
    }

    // Protein suggestions
    if (lowerMessage.includes('protein') && (lowerMessage.includes('suggest') || lowerMessage.includes('meal') || lowerMessage.includes('food'))) {
      const suggestions = [
        'Greek yogurt with berries (15-20g protein)',
        'Grilled chicken breast (25-30g protein)',
        'Hard-boiled eggs (6g protein each)',
        'Cottage cheese with nuts (14g protein)',
        'Protein smoothie with whey powder (20-25g protein)',
        'Lentil soup (18g protein per cup)',
        'Tuna salad (25g protein)'
      ];
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      return `Here's a high-protein option: ${randomSuggestion}. You need ${Math.round(proteinRemaining)}g more protein to reach your daily target of ${userProfile.targetProtein}g.`;
    }

    // General meal suggestions
    if (lowerMessage.includes('suggest') && lowerMessage.includes('meal')) {
      const mealSuggestions = [
        'Grilled salmon with quinoa and roasted vegetables',
        'Chicken stir-fry with brown rice and mixed vegetables',
        'Lentil curry with whole grain naan',
        'Greek salad with grilled chicken and olive oil dressing',
        'Turkey and avocado wrap with whole wheat tortilla',
        'Vegetable omelet with whole grain toast',
        'Quinoa bowl with black beans, vegetables, and tahini dressing'
      ];
      const randomMeal = mealSuggestions[Math.floor(Math.random() * mealSuggestions.length)];
      return `How about: ${randomMeal}? This would be a balanced option considering your remaining calories (${caloriesRemaining}).`;
    }

    // Progress check
    if (lowerMessage.includes('progress') || lowerMessage.includes('how am i doing')) {
      const caloriePercent = Math.round((currentDayStats.totalCalories / userProfile.targetCalories) * 100);
      const proteinPercent = Math.round((currentDayStats.totalProtein / userProfile.targetProtein) * 100);
      
      return `Here's your progress today:\n• Calories: ${caloriePercent}% of target (${currentDayStats.totalCalories}/${userProfile.targetCalories})\n• Protein: ${proteinPercent}% of target (${Math.round(currentDayStats.totalProtein)}g/${userProfile.targetProtein}g)\n• Meals logged: ${currentDayStats.meals.length}`;
    }

    // Macro breakdown
    if (lowerMessage.includes('macro') || lowerMessage.includes('breakdown')) {
      return `Your macro breakdown today:\n• Protein: ${Math.round(currentDayStats.totalProtein)}g / ${userProfile.targetProtein}g\n• Carbs: ${Math.round(currentDayStats.totalCarbs)}g / ${userProfile.targetCarbs}g\n• Fats: ${Math.round(currentDayStats.totalFats)}g / ${userProfile.targetFats}g`;
    }

    // Default responses
    const defaultResponses = [
      "I can help you track your nutrition! Try asking about your remaining calories, macro breakdown, or meal suggestions.",
      "Feel free to ask me about your daily progress, nutrition goals, or meal ideas!",
      "I'm here to help with your fitness journey. Ask me about calories, macros, or healthy meal suggestions.",
      "Try asking me specific questions like 'How many calories left?' or 'Suggest a healthy dinner'."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const botResponse: Message = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'bot',
      content: generateResponse(input.trim()),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInput('');
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-fittrack-600 hover:bg-fittrack-700 text-white rounded-full p-3 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96">
      <Card className="bg-slate-800 border-slate-700 h-full flex flex-col">
        <CardHeader className="py-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Bot className="h-4 w-4 text-fittrack-400" />
              FitTrack AI Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="text-slate-400 hover:text-white p-1 h-auto"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-3 gap-3">
          <ScrollArea className="flex-1 pr-3">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-6 h-6 bg-fittrack-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-fittrack-600 text-white'
                        : 'bg-slate-700 text-slate-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="bg-slate-700 border-slate-600 text-white text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="bg-fittrack-600 hover:bg-fittrack-700 px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
