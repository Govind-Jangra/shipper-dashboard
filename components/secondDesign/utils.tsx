export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const data = {
  totals: {
    base_rate: 822464,
    total_cost: 1431505,
    das: 100771,
    edas: 94806,
    delivery_and_returns: 0,
    fuel_surcharge: 298766,
    discount: -357876,
  },
  rateOfIncrease: {
    base_rate: { "2025": 3.4, "2026": 3.3, "2027": 3.2, "2028": 1.6 },
    total_cost: { "2025": 3.3, "2026": 3.2, "2027": 1.6, "2028": 3.1 },
    das: { "2025": 3.2, "2026": 3.2, "2027": 3.2, "2028": 1.5 },
    edas: { "2025": 3.3, "2026": 3.3, "2027": 1.6, "2028": 1.6 },
    delivery_and_returns: {
      "2025": 3.4,
      "2026": 3.3,
      "2027": 1.6,
      "2028": 1.6,
    },
    fuel_surcharge: { "2025": 3.3, "2026": 3.2, "2027": 1.5, "2028": 3.1 },
    discount: { "2025": 3.5, "2026": 3.4, "2027": 1.7, "2028": 1.7 },
  },
  futureTotals: {
    base_rate: {
      "2025": 850428,
      "2026": 892949,
      "2027": 935596,
      "2028": 986654,
    },
    total_cost: {
      "2025": 1478745,
      "2026": 1556682,
      "2027": 1619949,
      "2028": 1701946,
    },
    das: {
      "2025": 103995,
      "2026": 109195,
      "2027": 115746,
      "2028": 121533,
    },
    edas: {
      "2025": 97934,
      "2026": 103320,
      "2027": 107453,
      "2028": 112826,
    },
    delivery_and_returns: { "2025": 0, "2026": 0, "2027": 0, "2028": 0 },
    fuel_surcharge: {
      "2025": 308625,
      "2026": 324056,
      "2027": 335398,
      "2028": 352168,
    },
    discount: {
      "2025": -370686,
      "2026": -389220,
      "2027": -406735,
      "2028": -427072,
    },
  },
};

export const COLORS = [
  "#60A5FA", // Bright Blue
  "#34D399", // Bright Green (for discount)
  "#FBBF24", // Bright Yellow (for total cost)
  "#F87171", // Bright Red (for base rate and other costs)
  "#A78BFA", // Bright Purple
  "#F472B6", // Bright Pink
  "#38BDF8", // Sky Blue
];
