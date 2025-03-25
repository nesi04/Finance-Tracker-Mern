import React from 'react';
import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend} from 'recharts';

const CustomPieChart = ({
    data, label, totalAmount, colors, showTextAnchor
}) => {
  // Transform data to use absolute values for the chart
  const transformedData = data.map(item => ({
    name: item.name,
    amount: Math.abs(item.amount), // Convert to absolute value
    // Store original value for tooltip display
    originalAmount: item.amount,
    // Add indicator if value is negative
    isNegative: item.amount < 0
  })).filter(item => item.amount > 0); // Only keep non-zero values
  
  // Custom tooltip to show the original values
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const sign = data.isNegative ? '-' : '';
      return (
        <div className='bg-white shadow-md rounded-lg p-2 border border-gray-300'>
        <p className="text-xl font-semibold text-purple-800 mb-1">{data.name}</p>
        <p className='text-sm text-gray-600'>Amount: <span className='text-sm font font-medium text-gray-900'>{`${sign} $${data.amount}`}</span></p>
      </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie 
          data={transformedData} 
          dataKey="amount" 
          nameKey="name" 
          cx="50%" 
          cy="50%" 
          outerRadius={130} 
          innerRadius={100} 
          labelLine={false}
        >
          {transformedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {showTextAnchor && (
          <>
            <text x="50%" y="50%" dy={-25} textAnchor="middle" fill="#666" fontSize="14px">
              {label}
            </text>
            <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#333" fontSize="24px" fontWeight="semi-bold">
              {totalAmount}
            </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;  