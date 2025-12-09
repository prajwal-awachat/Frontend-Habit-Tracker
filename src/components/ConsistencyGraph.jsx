import React from 'react';
import { format, subDays } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/ConsistencyGraph.css';

const ConsistencyGraph = ({ habits }) => {
  const generateGraphData = () => {
    const data = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      let totalCompletions = 0;
      habits.forEach(habit => {
        if (habit.completed && habit.completed[dateKey]) {
          totalCompletions++;
        }
      });
      
      const completionRate = habits.length > 0 
        ? Math.round((totalCompletions / habits.length) * 100) 
        : 0;
      
      data.push({
        date: format(date, 'MMM d'),
        dateKey,
        completionRate
      });
    }
    
    return data;
  };

  const data = generateGraphData();
  
  const averageCompletion = data.length > 0 
    ? Math.round(data.reduce((sum, day) => sum + day.completionRate, 0) / data.length) 
    : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          <p className="completion">
            <span className="tooltip-dot"></span>
            {payload[0].value}% completion
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="consistency-graph">
      <div className="graph-header">
        <div>
          <h3>30-Day Consistency</h3>
          <p className="graph-subtitle">Your daily habit completion rate</p>
        </div>
        <div className="average-badge">
          <span className="average-label">30-Day Avg</span>
          <span className="average-value">{averageCompletion}%</span>
        </div>
      </div>
      
      <div className="graph-container">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={11}
              tick={{ fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={11}
              tick={{ fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="completionRate"
              stroke="#10B981"
              strokeWidth={3}
              fill="url(#colorCompletion)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConsistencyGraph;