
import React from "react";
import { TooltipProps } from "recharts";

// Chart container component that adds flexibility for future configurations
export const ChartContainer: React.FC<{
  className?: string;
  config?: any;
  children?: React.ReactNode; // Add children to the type definition
}> = ({
  children,
  className,
  config = {},
}) => {
  return (
    <div className={`${className} bg-gray-800 p-4 rounded-lg`} style={config}>
      {children}
    </div>
  );
};

// Custom Tooltip component for rendering additional information in charts
export const ChartTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow">
        <p className="font-bold text-white">{label}</p>
        {payload.map((entry, index) => (
          <p key={`tooltip-item-${index}`} className="text-white">{`${entry.name}: ${entry.value}`}</p>
        ))}
      </div>
    );
  }
  return null;
};
interface ChartTooltipContentProps {
  children?: React.ReactNode; // Add children as a prop type
}
// Custom tooltip content component to further customize the content of tooltips
export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ children }) => {
  return (
    <div className="bg-gray-900 p-2 rounded shadow-lg text-white">
      {children}
    </div>
  );
};
