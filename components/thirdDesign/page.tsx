"use client"

import React from "react";
import { TooltipProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Pie,
  PieChart,
  Cell,
  Label,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

interface DataType {
  totals: Record<string, number>;
  futureTotals: Record<string, Record<string, number>>;
  carrierRateOfIncrease: Record<string, Record<string, number>>;
}

const formatNumber = (value: number) => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  } else {
    return value.toFixed(2);
  }
};


export default function Dashboard({ data }: { data: DataType }) {
    const chargeData = [
        { name: "Base Rate", value: data.totals["Base Rate"] },
        { name: "DAS", value: data.totals["DAS"] },
        { name: "EDAS", value: data.totals["EDAS"] },
        { name: "Delivery and Returns", value: data.totals["Delivery and Returns"] },
        { name: "Fuel Surcharge", value: data.totals["Fuel Surcharge"] },
      ];
    
      const totalCharge = chargeData.reduce((sum, item) => sum + item.value, 0);
      const discountPercentage = 15;
      const discountAmount = totalCharge * (discountPercentage / 100);
      const finalAmount = totalCharge - discountAmount;
    
      const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA"];
    
      const generateStackedAreaData = () => {
        return Object.keys(data.futureTotals["Total Charge"]).map((year) => ({
          year: year,
          "Base Rate": data.futureTotals["Base Rate"][year],
          DAS: data.futureTotals["DAS"][year],
          EDAS: data.futureTotals["EDAS"][year],
          "Delivery and Returns": data.futureTotals["Delivery and Returns"][year],
          "Fuel Surcharge": data.futureTotals["Fuel Surcharge"][year],
        }));
      };
    
      const stackedAreaData = generateStackedAreaData();
    
      const generateRateIncreaseData = () => {
        const years = Object.keys(data.carrierRateOfIncrease);
        const categories = [
          "Base Rate",
          "DAS",
          "EDAS",
          "Delivery and Returns",
          "Fuel Surcharge",
        ];
    
        return years.map((year) => ({
          year: year,
          data: categories.map((category, index) => ({
            name: category,
            value: data.carrierRateOfIncrease[year][category],
            fill: COLORS[index % COLORS.length],
          })),
        }));
      };
    
      const rateIncreaseData = generateRateIncreaseData();
    
      const CustomTooltip = ({ active, payload }:TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow">
              <p className="font-bold text-white">{payload[0].payload.name}</p>
              <p className="text-white">{`Increase: ${formatNumber((payload[0].value as number))}%`}</p>
            </div>
          );
        }
        return null;
      };

  return (
    <div
      className="p-8 space-y-6 bg-gray-900 text-white min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-6">
        Shipper Dashboard
      </h1>
      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              Total Charge Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent
            className="w-full h-[400px] flex items-center justify-center"
          >
            <ChartContainer config={{}} className="w-full h-full">
              <PieChart width={400} height={400}>
                <Pie
                  data={chargeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={150}
                  fill="#8884d8"
                  paddingAngle={5}
                  label
                >
                  {chargeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <Label
                    value={`$${formatNumber(totalCharge)}`}
                    position="center"
                    fill="#FFFFFF"
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      fontFamily: "Arial",
                    }}
                  />
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              Discount Visualization
            </CardTitle>
          </CardHeader>
          <CardContent
            className="w-full h-[500px] flex flex-col items-center justify-center"
          >
            <ChartContainer
              config={{}}
              className="w-full h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  barSize={60}
                  data={[
                    {
                      name: "Discount",
                      value: discountPercentage,
                      fill: "#60A5FA",
                    },
                  ]}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />

                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={30}
                    fill="#60A5FA"
                  />

                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-6xl font-bold fill-white"
                  >
                    {discountPercentage}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div
              className="flex justify-between w-full mt-0 text-white"
            >
              <div className="text-left">
                <p className="text-2xl font-bold text-blue-400">
                ${formatNumber(discountAmount)}
                </p>
                <p className="text-base">
                  Total Discount
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">
                ${formatNumber(finalAmount)}
                </p>
                <p className="text-base">
                  After Discount Amount
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Charge Breakdown Over Years
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="w-full h-[400px]">
            <AreaChart
              width={1200}
              height={400}
              data={stackedAreaData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
              />
              <XAxis dataKey="year" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
              />

              <Legend />
              <Area
                type="monotone"
                dataKey="Base Rate"
                stackId="1"
                stroke={COLORS[0]}
                fill={COLORS[0]}
              />

              <Area
                type="monotone"
                dataKey="DAS"
                stackId="1"
                stroke={COLORS[1]}
                fill={COLORS[1]}
              />

              <Area
                type="monotone"
                dataKey="EDAS"
                stackId="1"
                stroke={COLORS[2]}
                fill={COLORS[2]}
              />

              <Area
                type="monotone"
                dataKey="Delivery and Returns"
                stackId="1"
                stroke={COLORS[3]}
                fill={COLORS[3]}
              />

              <Area
                type="monotone"
                dataKey="Fuel Surcharge"
                stackId="1"
                stroke={COLORS[4]}
                fill={COLORS[4]}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            Rate Increase by Year
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {rateIncreaseData.map((yearData, index) => (
              <Card
                key={index}
                className="bg-gray-700 border-gray-600"
              >
                <CardHeader>
                  <CardTitle className="text-white">
                    {yearData.year} Rate Increase
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="10%"
                      outerRadius="80%"
                      barSize={20}
                      data={yearData.data}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 30]}
                        angleAxisId={0}
                        tick={false}
                      />

                      <RadialBar
                        background={{ fill: "#4B5563" }}
                        dataKey="value"
                        cornerRadius={5}
                      />

                      <Tooltip
                        content={<CustomTooltip />}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Legend
              payload={COLORS.map((color, index) => ({
                value: chargeData[index].name,
                type: "circle",
                color: color,
              }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
