// lib/chartMap.tsx
//import dynamic from "next/dynamic";
import { JSX } from "react";

// Lazy imports
/*const BarChart = dynamic(() => import("@/lib/graph/graphs").then(m => m.BarChart), { loading: () => <p>Loading chart...</p> });
const LineChart = dynamic(() => import("@/lib/graph/graphs").then(m => m.LineChart), { loading: () => <p>Loading chart...</p> });
const PieChart = dynamic(() => import("@/lib/graph/graphs").then(m => m.PieChart), { loading: () => <p>Loading chart...</p> });

export const chartMap: Record<string, JSX.Element> = {
  bar: <BarChart />,
  line: <LineChart />,
  pie: <PieChart />,
};*/

// lib/chartMap.tsx
import dynamic from "next/dynamic";

// Lazy imports return components
const BarChart = dynamic(() => import("@/lib/graph/graphs").then(m => m.BarChart), { loading: () => <p className="fit">Loading chart...</p> });
const LineChart = dynamic(() => import("@/lib/graph/graphs").then(m => m.LineChart), { loading: () => <p className="fit">Loading chart...</p> });
const PieChart = dynamic(() => import("@/lib/graph/graphs").then(m => m.PieChart), { loading: () => <p className="fit">Loading chart...</p> });

// ✅ Store components, not JSX elements
export const chartMap: Record<string, React.ComponentType<any>> = {
  bar: BarChart,
  line: LineChart,
  pie: PieChart,
};

