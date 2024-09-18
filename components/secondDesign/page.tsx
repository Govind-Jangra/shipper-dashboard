"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./overview";
import { FutureProjections } from "./future-projections";
import { RateAnalysis } from "./rate-analysis";
import { data } from "./utils";

interface DataType {
  totals: Record<string, number>;
  futureTotals: Record<string, Record<string, number>>;
  carrierRateOfIncrease: Record<string, Record<string, number>>;
}

const PldDataAnalyzer = ({ data }: { data: DataType }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">PLD Data Analyzer</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        className="mb-8"
      >
        <TabsList className="bg-gray-800 border-gray-700">
        <TabsTrigger
        value="overview"
        className={`text-white ${activeTab === "overview" ? "bg-blue-500" : "bg-gray-800 text-gray-400"}`}
      >
        Overview
      </TabsTrigger>
      <TabsTrigger
        value="future-projections"
        className={`text-white ${activeTab === "future-projections" ? "bg-blue-500" : "bg-gray-800 text-gray-400"}`}
      >
        Future Projections
      </TabsTrigger>
      <TabsTrigger
        value="rate-analysis"
        className={`text-white ${activeTab === "rate-analysis" ? "bg-blue-500" : "bg-gray-800 text-gray-400"}`}
      >
        Rate Analysis
      </TabsTrigger>

        </TabsList>

        {activeTab === "overview" && <Overview data={data} />}
        {activeTab === "future-projections" && (
          <FutureProjections data={data} />
        )}
        {activeTab === "rate-analysis" && <RateAnalysis data={data} />}
      </Tabs>
    </div>
  );
};

export default PldDataAnalyzer;
