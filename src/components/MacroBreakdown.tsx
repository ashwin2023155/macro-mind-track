
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';

interface MacroBreakdownProps {
  consumed: {
    protein: number;
    carbs: number;
    fats: number;
  };
  targets: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export const MacroBreakdown: React.FC<MacroBreakdownProps> = ({
  consumed,
  targets
}) => {
  const data = [
    {
      name: 'Protein',
      consumed: Math.round(consumed.protein),
      target: targets.protein,
      color: '#22c55e'
    },
    {
      name: 'Carbs',
      consumed: Math.round(consumed.carbs),
      target: targets.carbs,
      color: '#3b82f6'
    },
    {
      name: 'Fats',
      consumed: Math.round(consumed.fats),
      target: targets.fats,
      color: '#f59e0b'
    }
  ];

  const chartData = data.map(item => ({
    name: item.name,
    value: item.consumed,
    fill: item.color
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-700 p-3 rounded-lg border border-slate-600">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-slate-300">{data.value}g consumed</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-fittrack-400" />
          Macro Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {data.map((macro) => (
              <div key={macro.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: macro.color }}
                    />
                    <span className="text-white font-medium">{macro.name}</span>
                  </div>
                  <span className="text-slate-400 text-sm">
                    {macro.consumed}g / {macro.target}g
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: macro.color,
                      width: `${Math.min((macro.consumed / macro.target) * 100, 100)}%`
                    }}
                  />
                </div>
                <div className="text-xs text-slate-400">
                  {Math.round(((macro.consumed / macro.target) * 100))}% of target
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
