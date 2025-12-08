//dashboard/page.tsx
'use client'

import { useEffect, useState } from "react";
import { getCharts, deleteChart, ChartMeta } from "@/utils/graph/chartStorage";
import Tile from "../components/Tile";
import { ChartRenderer } from "@/lib/graph/graphs";
import CreateChart from "../components/modals/newGraph";
import EditGraph from "../components/modals/editGraph";
import Image from "next/image";

const Dashboard = () => {
  const [charts, setCharts] = useState<Record<string, ChartMeta>>({});
  const [showCreateChart, setShowCreateChart] = useState(false);
  const [showEditChart, setShowEditChart] = useState(false);
  const [selectedChartId, setSelectedChartId] = useState<string>("");
  const [selectedChartMeta, setSelectedChartMeta] = useState<ChartMeta | null>(null);

  // Load charts once on mount
  useEffect(() => {
    getCharts().then(setCharts).catch(console.error);
  }, []);

  const handleClick = () => {
    setShowCreateChart(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteChart(id);
      setCharts((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete chart:", err);
    }
  };

  const handleEdit = (id: string, chartMeta: ChartMeta) => {
    setSelectedChartId(id);
    setSelectedChartMeta(chartMeta);
    setShowEditChart(true);
  };

  return (
    <div className="w-full">
      {/* Add New Chart Button */}
      <div className="flex justify-end mr-36 mt-15 gap-2">
        <button className="bg-foreground/50 aspect-square pl-2 pr-2 text-2xl hover:bg-foreground/10 active:bg-foreground rounded-xl" onClick={handleClick}>
          <Image src="/images/Plus.svg" alt="Add New Chart" width={24} height={24} />
        </button>
      </div>

      {/* Chart Tiles */}
      <div className="m-4 grid grid-cols-4 gap-4 grid-flow-dense">
        {Object.entries(charts).map(([id, chartMeta]) => {
          const { name, chartType, source, xKey, yKeys, options } = chartMeta;
          return (
            <Tile key={id} chartType={chartType} href={`/dashboard/${id}`} name={name.toUpperCase()} onDelete={() => handleDelete(id)} onEdit={() => handleEdit(id, chartMeta)} >
              <ChartRenderer chartType={chartType} source={source} xKey={xKey} yKeys={Array.isArray(yKeys) ? yKeys : [yKeys]} datasetLabels={Array.isArray(yKeys) ? yKeys : [yKeys]} options={options} />
            </Tile>
          );
        })}
      </div>

      {/* Create Chart Modal */}
      {showCreateChart && (
        <CreateChart onChartSaved={(newChart) => { setCharts(prev => ({ ...prev, [newChart.id]: newChart })); }} onClose={() => setShowCreateChart(false)}/>
)}

      {/* Edit Chart Modal */}
      {showEditChart && selectedChartMeta && (
        <EditGraph id={selectedChartId} chartMeta={selectedChartMeta} onClose={() => setShowEditChart(false)} onSave={(updatedMeta) => { setCharts(prev => ({ ...prev, [selectedChartId]: updatedMeta })); }} />
      )}
    </div>
  );
};

export default Dashboard;
