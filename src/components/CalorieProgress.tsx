
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Target, TrendingUp } from 'lucide-react';

interface CalorieProgressProps {
  consumed: number;
  target: number;
  remaining: number;
}

export const CalorieProgress: React.FC<CalorieProgressProps> = ({
  consumed,
  target,
  remaining
}) => {
  const percentage = Math.min((consumed / target) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-400" />
          Calorie Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="relative w-32 h-32 mx-auto">
              <svg
                className="w-32 h-32 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#374151"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={consumed > target ? "#ef4444" : "#22c55e"}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {Math.round(percentage)}%
                  </div>
                  <div className="text-xs text-slate-400">
                    of target
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm font-medium">Consumed</span>
                </div>
                <div className="text-2xl font-bold text-white">{consumed}</div>
                <div className="text-xs text-slate-400">calories</div>
              </div>

              <div className="text-center p-4 bg-slate-700 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-fittrack-400 mb-2">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Target</span>
                </div>
                <div className="text-2xl font-bold text-white">{target}</div>
                <div className="text-xs text-slate-400">calories</div>
              </div>
            </div>

            <div className="text-center p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {remaining >= 0 ? 'Remaining' : 'Over Target'}
                </span>
              </div>
              <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                {Math.abs(remaining)}
              </div>
              <div className="text-xs text-slate-400">calories</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
