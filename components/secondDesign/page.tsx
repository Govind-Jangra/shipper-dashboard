"use client"
/* eslint-disable */
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./overview.tsx";
import { FutureProjections } from "./future-projections.tsx";
import { RateAnalysis } from "./rate-analysis.tsx";
import { data } from "./utils.tsx";

interface DataType {
  totals: Record<string, number>;
  futureTotals: Record<string, Record<string, number>>;
  carrierRateOfIncrease: Record<string, Record<string, number>>;
}

const PldDataAnalyzer = ({data}:{ data: DataType }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          PLD Data Analyzer
        </h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="future-projections"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Future Projections
          </TabsTrigger>
          <TabsTrigger
            value="rate-analysis"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Rate Analysis
          </TabsTrigger>
        </TabsList>

        {activeTab === "overview" && <Overview data={data} />}
        {activeTab === "future-projections" && (
          <FutureProjections data={data} />
        )}

        {activeTab === "rate-analysis" && (
          <RateAnalysis data={data} />
        )}
      </Tabs>
    </div>
  );
};

export default PldDataAnalyzer;
