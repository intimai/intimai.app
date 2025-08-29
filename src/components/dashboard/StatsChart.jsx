import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import TooltipContent from '../ui/TooltipContent';

const ChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return <TooltipContent text={`${data.name}: ${data.value}`} />;
  }
  return null;
};

const StatsChart = ({ data }) => {
  const chartData = data.filter(item => item.name !== 'Total');
  const totalValue = chartData.reduce((sum, entry) => sum + entry.value, 0);

  if (totalValue === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[250px] text-center text-gray-500">
        <p>Bem vindo (a)!</p>
        <p>Crie sua primeira intimação e visualize aqui as suas estatísticas.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          labelLine={false}
          label={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#cccccc'} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'transparent' }} isAnimationActive={false} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StatsChart;