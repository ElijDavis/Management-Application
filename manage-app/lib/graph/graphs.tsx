//lib/graph/graphs.tsx
//Each chart will have it's onw imports and functions under the commented out partitions

//Bar
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BarChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const data = [//sample data
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];

    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map((row) => row.year),
        datasets: [
          {
            label: "Acquisitions by year",
            data: data.map((row) => row.count),
          },
        ],
      },
    });

    // cleanup to avoid duplicate chart instances
    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

//Line/Area

//Pie/Doughnut


export {BarChart};