// lib/chartMap.tsx
import dynamic from "next/dynamic";
import { JSX } from "react";

// Lazy imports
const BarChart = dynamic(() => import("@/lib/graph/graphs").then(m => m.BarChart), { loading: () => <p>Loading chart...</p> });
const LineChart = dynamic(() => import("@/lib/graph/graphs").then(m => m.LineChart), { loading: () => <p>Loading chart...</p> });
const PieChart = dynamic(() => import("@/lib/graph/graphs").then(m => m.PieChart), { loading: () => <p>Loading chart...</p> });

export const chartMap: Record<string, JSX.Element> = {
  bar: <BarChart />,
  line: <LineChart />,
  pie: <PieChart />,
};
