//lib/graph/graphs.tsx
import { useEffect, useRef } from "react";
//import Chart from "chart.js/auto";
import { getAquisitionsByYear } from '../../lib/sampleData/sample'
//starting tree-shaking
// ✅ Import only what you need (tree-shaking)
import { Chart, Colors, BarController, LineController, PieController, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Legend, PointElement, } from "chart.js";
// ✅ Register chart types and components once
Chart.register(Colors, BarController, LineController, PieController, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Legend);

//Bar
/*const BarChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {//only runs on mount, not when other renders occur
    let chart: any = null;

    const loadData = async () => {//getting real world data
      if (!canvasRef.current) return;

      //const data = [//sample data
        //{ year: 2010, count: 10 },
        //{ year: 2011, count: 20 },
        //{ year: 2012, count: 15 },
        //{ year: 2013, count: 25 },
        //{ year: 2014, count: 22 },
        //{ year: 2015, count: 30 },
        //{ year: 2016, count: 28 },
      //];

      const data = await getAquisitionsByYear();


      //**** The below script is the original example, no options
      //const chart = new Chart(canvasRef.current, {
        //type: "bar",//specify the bar type
        //data: {//to be given to the graph
          //labels: data.map((row) => row.year), //labels to be displayed on x-axis
          //datasets: [//can have multiple datasets for more than one bar per x-label
            //{
              //label: "Acquisitions by year",//graph label
              //data: data.map((row) => row.count),//data to be mapped
            //},
          //],
        //},
      //});

      chart = new Chart(canvasRef.current, {
        type: 'bar',//specify the bar type
        options: {//new options for graph manipulation
          maintainAspectRatio: false, // allow canvas to fill parent
          animation: false,// the animation where it disapeared, set to false
          plugins: {
            legend: {//disables the legend at the top of the graph (in this instance "Aquisition by year")
              display: false
            },
            tooltip: {//still don't know what it does
              enabled: false
            }
          }
        },
        data: {//to be given to the graph
          labels: data.map(row => row.year),//labels to be displayed on x-axis
          datasets: [//can have multiple datasets for more than one bar per x-label
            {
              label: 'Acquisitions by year',//graph label
              data: data.map(row => row.count)//data to be mapped
            }
          ]
        }
      }
    );
    };

    loadData();

    // cleanup to avoid duplicate chart instances
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full p-10">
      <canvas className="w-full" ref={canvasRef}></canvas>
    </div>
  );
};*/

const BarChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!canvasRef.current) return;

      const data = await getAquisitionsByYear();

      if (chartRef.current) {
        // ✅ update existing chart instead of creating a new one
        chartRef.current.data.labels = data.map((row) => row.year);
        chartRef.current.data.datasets[0].data = data.map((row) => row.count);
        chartRef.current.update();
      } else {
        // ✅ only create chart if none exists
        chartRef.current = new Chart(canvasRef.current, {
          type: "bar",
          options: {
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
          },
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
      }
    };

    loadData();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full p-10">
      <canvas className="w-full h-64" ref={canvasRef}></canvas>
    </div>
  );
};


//
// -------------------- LINE CHART --------------------
//
const LineChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!canvasRef.current) return;

      const data = await getAquisitionsByYear();

      if (chartRef.current) {
        // ✅ Update existing chart
        chartRef.current.data.labels = data.map((row) => row.year);
        chartRef.current.data.datasets[0].data = data.map((row) => row.count);
        chartRef.current.update();
      } else {
        chartRef.current = new Chart(canvasRef.current, {
          type: "line", // ✅ Line chart type
          options: {
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: { display: true }, // show legend for line chart
            },
          },
          data: {
            labels: data.map((row) => row.year),
            datasets: [
              {
                label: "Acquisitions trend",
                data: data.map((row) => row.count),
                fill: true, // ✅ makes it an area chart if desired
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                tension: 0.3, // ✅ smooth curves
              },
            ],
          },
        });
      }
    };

    loadData();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full p-10">
      <canvas className="w-full h-64" ref={canvasRef}></canvas>
    </div>
  );
};

//
// -------------------- PIE CHART --------------------
//
const PieChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!canvasRef.current) return;

      const data = await getAquisitionsByYear();

      if (chartRef.current) {
        // ✅ Update existing chart
        chartRef.current.data.labels = data.map((row) => row.year);
        chartRef.current.data.datasets[0].data = data.map((row) => row.count);
        chartRef.current.update();
      } else {
        chartRef.current = new Chart(canvasRef.current, {
          type: "pie", // ✅ Pie chart type
          options: {
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: { display: true }, // ✅ legend is useful for pie
            },
          },
          data: {
            labels: data.map((row) => row.year),
            datasets: [
              {
                label: "Acquisitions distribution",
                data: data.map((row) => row.count),
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                ], // ✅ distinct colors for slices
              },
            ],
          },
        });
      }
    };

    loadData();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full p-10">
      <canvas className="w-full h-64" ref={canvasRef}></canvas>
    </div>
  );
};


export {BarChart, LineChart, PieChart};