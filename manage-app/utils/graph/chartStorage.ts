// lib/chartStorage.ts
'use client'

import { ChartData } from "@/lib/data/pipeline";
import { createClient } from "@supabase/supabase-js";

export type ChartDisplayOptions = {
  xAxisTitle?: string;
  yAxisTitle?: string;
  colors?: Record<string, string>;   // ✅ new          // one per yKey
  visibleRange?: { start: number; end: number }; // indices [start, end)
  showLegend?: boolean;
};

export type ChartMeta = {
  chartType: "bar" | "line" | "pie" | "doughnut" | "area";
  source: string | ChartData;
  xKey: string;
  yKeys: string[];
  options?: ChartDisplayOptions;
};

const STORAGE_KEY = "graphs";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Local Helpers ---
function getLocalCharts(): Record<string, ChartMeta> {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function setLocalCharts(charts: Record<string, ChartMeta>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
}

// --- Public API ---
export async function getCharts(): Promise<Record<string, ChartMeta>> {
  // 1. Try local first
  const local = getLocalCharts();
  if (Object.keys(local).length > 0) return local;

  // 2. Fallback to Supabase
  const { data, error } = await supabase.from("charts").select("*");
  if (error) throw error;

  const charts: Record<string, ChartMeta> = {};
  data.forEach((row: any) => {
    charts[row.name] = { chartType: row.chartType, source: row.url ?? row.data, xKey: row.xKey, yKeys: Array.isArray(row.yKeys) ? row.yKeys : typeof row.yKey === "string" ? row.yKey.split(",").map((s: string) => s.trim()) : [], options: row.options ?? {} };
  });

  // Cache locally
  setLocalCharts(charts);
  return charts;
}

export async function saveChart(name: string, chartType: ChartMeta["chartType"], sourceOrData:string | ChartData, xKey:string, yKeys:string[], options?: ChartDisplayOptions) {
  const charts = getLocalCharts();

  if (charts[name]) throw new Error("Chart name must be unique");

  charts[name] = { chartType, source: sourceOrData, xKey, yKeys, options };
  setLocalCharts(charts);

  // new Sync to Supabase
  const payload = { name, chartType, xKey, yKeys, options };
  if (typeof sourceOrData === "string") {
    // URL path
    await supabase.from("charts").insert({ ...payload, url: sourceOrData });
  } else {
    // ChartData path
    await supabase.from("charts").insert({ ...payload, data: sourceOrData });
  }

  // Sync to Supabase
  //await supabase.from("charts").insert({ name, chartType, data: sourceOrData, xKey, yKey });
}

export async function updateChart(name: string, partial: Partial<ChartMeta>) {
  const charts = getLocalCharts();
  if (!charts[name]) throw new Error("Chart not found");
  charts[name] = { ...charts[name], ...partial };
  setLocalCharts(charts);

  // Supabase mirror
  const { error } = await supabase.from("charts").update(partial).eq("name", name);
  if (error) throw error;
}


// --- Public API ---
export async function deleteChart(name: string) {
  // 1. Remove from localStorage
  const charts = getLocalCharts();
  delete charts[name];
  setLocalCharts(charts);

  // 2. Remove from Supabase
  const { error } = await supabase.from("charts").delete().eq("name", name);
  if (error) throw error;
}

