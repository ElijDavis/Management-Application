// lib/chartStorage.ts
'use client'

import { createClient } from "@supabase/supabase-js";

export type ChartMeta = {
  chartType: "bar" | "line" | "pie" | "doughnut" | "area";
  url: string;
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
    charts[row.name] = { chartType: row.chartType, url: row.url };
  });

  // Cache locally
  setLocalCharts(charts);
  return charts;
}

export async function saveChart(name: string, chartType: ChartMeta["chartType"], url:string) {
  const charts = getLocalCharts();

  if (charts[name]) throw new Error("Chart name must be unique");

  charts[name] = { chartType, url };
  setLocalCharts(charts);

  // Sync to Supabase
  await supabase.from("charts").insert({ name, chartType });
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

