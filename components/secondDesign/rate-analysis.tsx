
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Percent } from "lucide-react";
import { COLORS } from "./utils.tsx";

export const RateAnalysis = ({ data }) => {
  // Create rateIncreaseData without discount calculation
  const rateIncreaseData = Object.keys(data.carrierRateOfIncrease).map(
    (year) => {
      const baseRate = data.carrierRateOfIncrease[year]?.["Base Rate"];
      const das = data.carrierRateOfIncrease[year]?.["DAS"];
      const edas = data.carrierRateOfIncrease[year]?.["EDAS"];
      const fuelSurcharge = data.carrierRateOfIncrease[year]?.["Fuel Surcharge"];

      return {
        year,
        "Base Rate": baseRate || 0,
        DAS: das || 0,
        EDAS: edas || 0,
        "Fuel Surcharge": fuelSurcharge || 0,
      };
    }
  );

  return (
    <>
      <Card className="bg-gray-800 border-gray-700 mb-8">
        <CardHeader>
          <CardTitle>Rate of Increase (%) Comparison</CardTitle>
        </CardHeader>
        <CardContent className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rateIncreaseData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis dataKey="year" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar dataKey="Base Rate" fill={COLORS[0]} />
              <Bar dataKey="DAS" fill={COLORS[1]} />
              <Bar dataKey="EDAS" fill={COLORS[2]} />
              <Bar dataKey="Fuel Surcharge" fill={COLORS[3]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Object.entries(data.carrierRateOfIncrease["2028"])
  .filter(
    ([key]) =>
      key === "Base Rate" ||
      key === "DAS" ||
      key === "EDAS" ||
      key === "Fuel Surcharge"
  )
  .map(([key, value], index) => (
    <Card key={key} className="bg-gray-800 border-gray-700">
      <CardHeader
        className="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle className="text-sm font-medium">
          {key.replace(/_/g, " ").toUpperCase()}
        </CardTitle>
        <Badge
          variant="secondary"
          className="text-white"
          style={{
            backgroundColor: COLORS[index % COLORS.length],
          }}
        >
          Rate Increase
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-center">
          <Percent className="mr-1 h-6 w-6" />
          {value.toFixed(1)}%
        </div>
        <p className="text-xs text-muted-foreground">
          Projected increase for 2028
        </p>
      </CardContent>
    </Card>
  ))}


      </div>
    </>
  );
};
