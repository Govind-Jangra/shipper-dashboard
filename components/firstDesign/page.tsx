'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Sector } from 'recharts'

const COLORS = ['#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#A78BFA']

// const CustomTooltip = ({ active, payload }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-gray-800 p-2 shadow rounded border border-gray-700">
//         <p className="font-semibold text-gray-200">{payload[0].name}</p>
//         <p className="text-sm text-gray-300">${payload[0].value}</p>
//       </div>
//     )
//   }
//   return null
// }

const StackedAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-2 shadow rounded border border-gray-700">
        <p className="font-semibold text-gray-200">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#d1d5db" className="text-lg font-semibold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#d1d5db" className="text-sm">{`$${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#9ca3af" className="text-xs">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

const HeatMap = ({ data }: { data: any[] }) => {
  const years = ['2025', '2026', '2027', '2028']
  // const categories = data.map(item => item.category)
  const maxValue = Math.max(...data.flatMap(item => years.map(year => item[year])))

  const getColor = (value: number) => {
    const normalizedValue = value / maxValue
    const hue = 240 - normalizedValue * 60 // Range from 240 (blue) to 180 (cyan)
    const saturation = 70 + normalizedValue * 30 // Range from 70% to 100%
    const lightness = 60 - normalizedValue * 30 // Range from 60% to 30%
    return [`hsl(${hue}, ${saturation}%, ${lightness}%)`, normalizedValue > 0.5 ? '#ffffff' : '#1f2937']
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 grid grid-cols-5 gap-1">
        <div className="col-span-1"></div>
        {years.map(year => (
          <div key={year} className="text-center text-sm font-semibold text-gray-300">{year}</div>
        ))}
      </div>
      {data.map((item) => (
        <div key={item.category} className="flex-1 grid grid-cols-5 gap-1">
          <div className="col-span-1 flex items-center text-sm font-semibold text-gray-300">{item.category}</div>
          {years.map(year => {
            const [bgColor, textColor] = getColor(item[year])
            return (
              <div
                key={year}
                className="relative flex items-center justify-center rounded"
                style={{ backgroundColor: bgColor }}
              >
                <span className="text-xs font-semibold" style={{ color: textColor }}>
                  {item[year]}%
                </span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function ShipperDashboardComponent({data}) {
  const [activeChargeIndex, setActiveChargeIndex] = useState(0)
  const [activeDiscountIndex, setActiveDiscountIndex] = useState(0)

  interface ChargeDataType {
    name: string;
    value: number;
  }

  interface DiscountDataType {
    name: string;
    value: number;
  }

  interface StackedAreaDataType {
    year: string;
    'Base Rate': number;
    DAS: number;
    EDAS: number;
    'Delivery and Returns': number;
    'Fuel Surcharge': number;
  }

  interface RateIncreaseDataType {
    category: string;
    '2025': number;
    '2026': number;
    '2027': number;
    '2028': number;
  }

  const [chargeData, setChargeData] = useState<ChargeDataType[]>([]);
  const [discountData, setDiscountData] = useState<DiscountDataType[]>([]);
  const [stackedAreaData, setStackedAreaData] = useState<StackedAreaDataType[]>([]);
  const [rateIncreaseData, setRateIncreaseData] = useState<RateIncreaseDataType[]>([]);
  const [totalCharge, setTotalCharge] = useState<number>(0);

  useEffect(() => {
    // Fetch API data when the component mounts
    const fetchData = async () => {
      try {
        const correctData = data;

        // Update chargeData based on API response
        const updatedChargeData = [
          { name: 'Base Rate', value: correctData.totals["Base Rate"] },
          { name: 'DAS', value: correctData.totals["DAS"] },
          { name: 'EDAS', value: correctData.totals["EDAS"] },
          { name: 'Delivery and Returns', value: correctData.totals["Delivery and Returns"] },
          { name: 'Fuel Surcharge', value: correctData.totals["Fuel Surcharge"] },
        ];
        setChargeData(updatedChargeData);

        const totalCharges= updatedChargeData.reduce((sum,item)=>sum+item.value,0);
        setTotalCharge(totalCharges);
        // Update discountData based on API response
        const updatedDiscountData = [
          { name: 'Discount', value: correctData?.totals["Discount"] || 0 }, // Assuming discount is part of the API data
          { name: 'Charges After Discount', value: correctData.totals["Total Charge"] },
        ];
        setDiscountData(updatedDiscountData);

        // Update stackedAreaData for future years
        const updatedStackedAreaData = [
          {
            year: '2025',
            'Base Rate': correctData.futureTotals["Base Rate"]["2025"],
            'DAS': correctData.futureTotals["DAS"]["2025"],
            'EDAS': correctData.futureTotals["EDAS"]["2025"],
            'Delivery and Returns': correctData.futureTotals["Delivery and Returns"]["2025"],
            'Fuel Surcharge': correctData.futureTotals["Fuel Surcharge"]["2025"]
          },
          {
            year: '2026',
            'Base Rate': correctData.futureTotals["Base Rate"]["2026"],
            'DAS': correctData.futureTotals["DAS"]["2026"],
            'EDAS': correctData.futureTotals["EDAS"]["2026"],
            'Delivery and Returns': correctData.futureTotals["Delivery and Returns"]["2026"],
            'Fuel Surcharge': correctData.futureTotals["Fuel Surcharge"]["2026"]
          },
          {
            year: '2027',
            'Base Rate': correctData.futureTotals["Base Rate"]["2027"],
            'DAS': correctData.futureTotals["DAS"]["2027"],
            'EDAS': correctData.futureTotals["EDAS"]["2027"],
            'Delivery and Returns': correctData.futureTotals["Delivery and Returns"]["2027"],
            'Fuel Surcharge': correctData.futureTotals["Fuel Surcharge"]["2027"]
          },
          {
            year: '2028',
            'Base Rate': correctData.futureTotals["Base Rate"]["2028"],
            'DAS': correctData.futureTotals["DAS"]["2028"],
            'EDAS': correctData.futureTotals["EDAS"]["2028"],
            'Delivery and Returns': correctData.futureTotals["Delivery and Returns"]["2028"],
            'Fuel Surcharge': correctData.futureTotals["Fuel Surcharge"]["2028"]
          }
        ];
        setStackedAreaData(updatedStackedAreaData);

        // Update rateIncreaseData based on API response
        const updatedRateIncreaseData = [
          {
            category: 'Base Rate',
            '2025': correctData.carrierRateOfIncrease["2025"]["Base Rate"],
            '2026': correctData.carrierRateOfIncrease["2026"]["Base Rate"],
            '2027': correctData.carrierRateOfIncrease["2027"]["Base Rate"],
            '2028': correctData.carrierRateOfIncrease["2028"]["Base Rate"]
          },
          {
            category: 'DAS',
            '2025': correctData.carrierRateOfIncrease["2025"]["DAS"],
            '2026': correctData.carrierRateOfIncrease["2026"]["DAS"],
            '2027': correctData.carrierRateOfIncrease["2027"]["DAS"],
            '2028': correctData.carrierRateOfIncrease["2028"]["DAS"]
          },
          {
            category: 'EDAS',
            '2025': correctData.carrierRateOfIncrease["2025"]["EDAS"],
            '2026': correctData.carrierRateOfIncrease["2026"]["EDAS"],
            '2027': correctData.carrierRateOfIncrease["2027"]["EDAS"],
            '2028': correctData.carrierRateOfIncrease["2028"]["EDAS"]
          },
          {
            category: 'Fuel Surcharge',
            '2025': correctData.carrierRateOfIncrease["2025"]["Fuel Surcharge"],
            '2026': correctData.carrierRateOfIncrease["2026"]["Fuel Surcharge"],
            '2027': correctData.carrierRateOfIncrease["2027"]["Fuel Surcharge"],
            '2028': correctData.carrierRateOfIncrease["2028"]["Fuel Surcharge"]
          }
        ];
        setRateIncreaseData(updatedRateIncreaseData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

 
  return (
    <div className="p-8 bg-gray-900 min-h-screen text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Shipper Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Total Charge Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeChargeIndex}
                  activeShape={renderActiveShape}
                  data={chargeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveChargeIndex(index)}
                >
                  {chargeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="text-center mt-4">
            <span className="text-2xl font-bold text-gray-100">${totalCharge}</span>
            <span className="text-sm text-gray-400 ml-2">Total Charge</span>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Charges After Discount</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeDiscountIndex}
                  activeShape={renderActiveShape}
                  data={discountData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveDiscountIndex(index)}
                  startAngle={90}
                  endAngle={-270}
                >
                  {discountData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4B5563' : COLORS[0]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="text-center mt-4">
            <span className="text-2xl font-bold text-gray-100">$646</span>
            <span className="text-sm text-gray-400 ml-2">Charge After Discount</span>
          </div>
        </Card>
      </div>

      <Card className="mb-8 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Charge Breakdown Forecast (2025-2028)</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stackedAreaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="year" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<StackedAreaTooltip />} />
              <Area type="monotone" dataKey="Base Rate" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.8} />
              <Area type="monotone" dataKey="DAS" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.8} />
              <Area type="monotone" dataKey="EDAS" stackId="1" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.8} />
              <Area type="monotone" dataKey="Delivery and Returns" stackId="1" stroke={COLORS[3]} fill={COLORS[3]} fillOpacity={0.8} />
              <Area type="monotone" dataKey="Fuel Surcharge" stackId="1" stroke={COLORS[4]} fill={COLORS[4]} fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Rate Increase Forecast (2025-2028)</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <HeatMap data={rateIncreaseData} />
        </CardContent>
      </Card>
    </div>
  )
}