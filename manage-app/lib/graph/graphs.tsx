import { useEffect, useRef } from "react";
import { loadChartData, ChartData } from "../data/pipeline";
import {
  Chart,
  Colors,
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  PieController,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Legend
} from "chart.js";
import { ChartDisplayOptions } from "@/utils/graph/chartStorage";

// Register Chart.js components once
Chart.register(
  Colors,
  CategoryScale,
  LinearScale,
  BarController,
  LineController,
  PieController,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Legend
);

interface ChartRendererProps {
  chartType: "bar" | "line" | "pie";
  source: string | ChartData;
  xKey: string;
  yKeys: string[];
  datasetLabels: string[];
  options?: ChartDisplayOptions;
}

// Apply options including colors keyed by dataset label
const applyOptions = (data: ChartData, options?: ChartDisplayOptions): ChartData => {
  if (!options) return data;
  const total = data.labels.length;
  let start = Math.max(0, options.visibleRange?.start ?? 0);
  let end = options.visibleRange?.end ?? Number.MAX_SAFE_INTEGER;
  if (end < 0) {
    const fraction = Math.max(0.0, Math.min(1.0, Math.abs(end)));
    end = Math.floor(start + fraction * (total - start));
  } else {
    end = Math.min(end, total);
  }
  const slice = (arr: any[]) => arr.slice(start, end);
  const sliced: ChartData = {
    labels: slice(data.labels),
    datasets: data.datasets.map((ds) => {
      const color = options.colors?.[ds.label] || "#3b82f6";
      return {
        ...ds,
        data: slice(ds.data),
        backgroundColor: color,
        borderColor: color,
      };
    }),
  };
  return sliced;
};

const makeChartJsOptions = (type: "bar" | "line" | "pie", options?: ChartDisplayOptions) => {
  const base = {
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: options?.showLegend ?? type !== "bar" },
      tooltip: { enabled: true },
    },
  } as any;

  if (type === "pie") return base;

  base.scales = {
    x: {
      title: {
        display: !!options?.xAxisTitle,
        text: options?.xAxisTitle,
      },
    },
    y: {
      title: {
        display: !!options?.yAxisTitle,
        text: options?.yAxisTitle,
      },
    },
  };
  return base;
};

export const ChartRenderer = ({ chartType, source, xKey, yKeys, datasetLabels, options }: ChartRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!canvasRef.current) return;
      const rawData = typeof source === "string"
        ? await loadChartData(source, xKey, yKeys, datasetLabels)
        : source;

      const prepared = applyOptions(rawData, options);
      const chartOptions = makeChartJsOptions(chartType, options);

      if (chartRef.current) {
        chartRef.current.data = prepared;
        chartRef.current.options = chartOptions;
        chartRef.current.update();
      } else {
        chartRef.current = new Chart(canvasRef.current, {
          type: chartType,
          data: prepared,
          options: chartOptions,
        });
      }
    };

    loadData();
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [chartType, source, xKey, yKeys, datasetLabels, options]);

  return (
    <div className="w-full p-10">
      <canvas className="w-full h-64" ref={canvasRef}></canvas>
    </div>
  );
};
