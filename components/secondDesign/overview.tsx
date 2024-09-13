
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatCurrency, COLORS } from "./utils";

export const Overview = ({ data }) => {
  // Calculate discount using your provided formula
  const discount = Math.abs(data.totals["Base Rate"] - data.totals["Total Charge"]) / 
                   Math.max(data.totals["Base Rate"], data.totals["Total Charge"]);

  // Prepare pie chart data excluding "Discount" and "Total Cost"
  const pieChartData = Object.entries(data.totals)
    .filter(([key]) => key !== "Discount" && key !== "Total Charge" && key !== "Base Rate")
    .map(([key, value]) => ({
      name: key.replace(/_/g, " ").toUpperCase(),
      value: Math.abs(value as number),
    }));

  // Add "Base Rate" manually
  pieChartData.push({
    name: "BASE RATE",
    value: Math.abs(data.totals["Base Rate"]),
  });

  // Prepare data for discount visualization
  const costBeforeDiscount = Object.entries(data.totals)
    .filter(([key]) => key !== "Discount" && key !== "Total Charge")
    .reduce((sum, [_, value]) => sum + (value as number), 0);

  const discountData = [
    { name: "Cost Before Discount", value: costBeforeDiscount },
    { name: "Discount", value: discount * costBeforeDiscount }, // Calculate discount value
    { name: "Total Cost", value: costBeforeDiscount - discount * costBeforeDiscount },
  ];

  return (
    <>
      <div className="mb-8">
        <Card className="bg-blue-500 bg-opacity-15">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TOTAL COST</CardTitle>
            <Badge variant="secondary" className="bg-blue-500 text-white">Current</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(data.totals["Total Charge"])}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-green-500 bg-opacity-15">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DISCOUNT</CardTitle>
            <Badge variant="secondary" className="bg-green-500 text-white">Current</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(discount * costBeforeDiscount)}</div>
          </CardContent>
        </Card>

        {Object.entries(data.totals)
          .filter(([key]) => key !== "Discount" && key !== "Total Charge")
          .map(([key, value]) => (
            <Card key={key} className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{key.replace(/_/g, " ").toUpperCase()}</CardTitle>
                <Badge variant="secondary" className="bg-red-500 text-white">Current</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(value)}</div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Current Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Discount Visualization</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={discountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
                <Bar dataKey="value" fill="#8884d8">
                  {discountData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Discount"
                          ? COLORS[1]
                          : entry.name === "Total Cost"
                          ? COLORS[2]
                          : "#6B7280"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
