//utils/graph/chartStorage.ts

'use client'

import { ChartData } from "@/lib/data/pipeline";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid"; // install with: npm install uuid

export type ChartDisplayOptions = {
  xAxisTitle?: string;
  yAxisTitle?: string;
  colors?: Record<string, string>;   // keyed by dataset label
  visibleRange?: { start: number; end: number };
  showLegend?: boolean;
  scale?: number; 
};

export type ChartMeta = {
  id: string;                        // ✅ unique identifier
  name: string;                      // ✅ display name (can have spaces)
  chartType: "bar" | "line" | "pie" | "doughnut";
  source: string | ChartData;
  xKey: string;
  yKeys: string[];
  options?: ChartDisplayOptions;
};

const STORAGE_KEY = "graphs";

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
/*export async function getCharts(): Promise<Record<string, ChartMeta>> {
  // 1. Try local first
  const local = getLocalCharts();
  if (Object.keys(local).length > 0) return local;

  // 2. Fallback to Supabase
  const { data, error } = await supabase.from("charts").select("*");
  if (error) throw error;

  const charts: Record<string, ChartMeta> = {};
  data.forEach((row: any) => {
    charts[row.id] = {
      id: row.id,
      name: row.name,
      // ✅ handle both camelCase and lowercase column names
      chartType: row.chartType ?? row.charttype,
      source: row.url ?? row.data,
      xKey: row.xKey ?? row.xkey,
      yKeys: Array.isArray(row.yKeys ?? row.ykeys)
        ? (row.yKeys ?? row.ykeys)
        : typeof row.yKey === "string"
        ? row.yKey.split(",").map((s: string) => s.trim())
        : [],
      options: row.options ?? {},
    };
  });

  // Cache locally
  setLocalCharts(charts);
  return charts;
}*/

export async function getCharts(): Promise<Record<string, ChartMeta>> {
  // 1. Try local first
  const local = getLocalCharts();
  if (Object.keys(local).length > 0) return local;

  // 2. If local is empty, fall back to Supabase
  return await refreshCharts();
}

// --- Always fetch fresh charts from Supabase ---
export async function refreshCharts(): Promise<Record<string, ChartMeta>> {
  const { data, error } = await supabase.from("charts").select("*");
  if (error) throw error;

  const charts: Record<string, ChartMeta> = {};
  data.forEach((row: any) => {
    charts[row.id] = {
      id: row.id,
      name: row.name,
      chartType: row.chartType ?? row.charttype,
      source: row.url ?? row.data,
      xKey: row.xKey ?? row.xkey,
      yKeys: Array.isArray(row.yKeys ?? row.ykeys)
        ? (row.yKeys ?? row.ykeys)
        : typeof row.yKey === "string"
        ? row.yKey.split(",").map((s: string) => s.trim())
        : [],
      options: row.options ?? {},
    };
  });

  // ✅ overwrite local cache with fresh data
  setLocalCharts(charts);
  return charts;
}

// --- Create / Update / Delete ---
export async function saveChart(
  name: string,
  chartType: ChartMeta["chartType"],
  sourceOrData: string | ChartData,
  xKey: string,
  yKeys: string[],
  options?: ChartDisplayOptions
): Promise<ChartMeta> {
  const charts = getLocalCharts();
  const id = uuidv4();

  const newChart: ChartMeta = { id, name, chartType, source: sourceOrData, xKey, yKeys, options };
  charts[id] = newChart;
  setLocalCharts(charts);

  // ✅ get current user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    throw new Error("No authenticated user found");
  }
  const user_id = userData.user.id;

  const payload = { id, name, chartType, xKey, yKeys, options, user_id };

  let insertResult;
  if (typeof sourceOrData === "string") {
    insertResult = await supabase.from("charts").insert({ ...payload, url: sourceOrData });
  } else {
    insertResult = await supabase.from("charts").insert({ ...payload, data: sourceOrData });
  }

  if (insertResult.error) {
    console.error("❌ Supabase insert error:", insertResult.error.message, insertResult.error.details);
    throw new Error(insertResult.error.message); // ✅ proper Error
  } else {
    console.log("✅ Supabase insert success:", insertResult.data);
  }

  return newChart;
}

export async function updateChart(id: string, partial: Partial<ChartMeta>) {
    if (!id) {
      throw new Error("updateChart called without a valid id");
    }

  const charts = getLocalCharts();
  if (!charts[id]) throw new Error("Chart not found");

  // ✅ include user_id for RLS
  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData?.user?.id;

  const { error } = await supabase
    .from("charts")
    .update({ ...partial, user_id })
    .eq("id", id)
    .eq("user_id", user_id); // enforce ownership

  //if (error) throw error;
  if (error) {
    console.error("❌ Supabase update error:", error.message, error.details);
    throw new Error(error.message);
  }

  charts[id] = { ...charts[id], ...partial };
  setLocalCharts(charts);
}


export async function deleteChart(id: string) {
  const charts = getLocalCharts();
  delete charts[id];
  setLocalCharts(charts);
  const { error } = await supabase.from("charts").delete().eq("id", id);
  if (error) throw error;
}
