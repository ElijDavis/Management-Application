//lib/graph/graphs.tsx
//Each chart will have it's onw imports and functions under the commented out partitions

//Bar
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { getAquisitionsByYear } from '../../lib/sampleData/sample'

const BarChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {//only runs on mount, not when other renders occur
    let chart: any = null;

    const loadData = async () => {//getting real world data
      if (!canvasRef.current) return;

      /*const data = [//sample data
        { year: 2010, count: 10 },
        { year: 2011, count: 20 },
        { year: 2012, count: 15 },
        { year: 2013, count: 25 },
        { year: 2014, count: 22 },
        { year: 2015, count: 30 },
        { year: 2016, count: 28 },
      ];*/

      const data = await getAquisitionsByYear();


      //**** The below script is the original example, no options
      /*const chart = new Chart(canvasRef.current, {
        type: "bar",//specify the bar type
        data: {//to be given to the graph
          labels: data.map((row) => row.year), //labels to be displayed on x-axis
          datasets: [//can have multiple datasets for more than one bar per x-label
            {
              label: "Acquisitions by year",//graph label
              data: data.map((row) => row.count),//data to be mapped
            },
          ],
        },
      });*/

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
};

//Line/Area

const LineChart = () => {
  return (
    <div>
      Hello
    </div>
  )
}

//Pie/Doughnut

const PieChart = () => {
  return (
    <div>
      Hello
    </div>
  )
}


export {BarChart, LineChart, PieChart};