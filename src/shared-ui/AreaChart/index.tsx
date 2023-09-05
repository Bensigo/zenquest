import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeSeriesScale,
  type ChartOptions,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box } from "@chakra-ui/react";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TimeSeriesScale
);

type LineChart = {
  data: any[];
};

export

function getDataFromMetrics(
  data: { createdAt: Date; _avg: { mood: number } }[]
) {
  const labels: Date[] = data.map((metric) => {
    return new Date(metric.createdAt.toISOString())
  });
  const datasets = [];
  for (const metric of data) {
    const curr: Record<string, any> = {
      borderColor: 'rgba(0, 123, 255, 1)',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
    };
    curr["label"] = 'mood';
    curr["data"] = [metric._avg.mood];
    datasets.push(curr);
  }
  labels.push(new Date())
  return { labels, datasets };
}

type DataItem = {
  createdAt: Date;
  _avg: {
    mood: number;
  };
};

type AreaDataset = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  fill: boolean | string;

};

type PreparedData = [Date[], AreaDataset[]];

function prepareDataForAreaChart(data: DataItem[]): PreparedData {
  // Sort the data by the createdAt property in ascending order
  const sortedData = data.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // Extract the labels and dataset values from the sorted data
  const labels: Date[] = sortedData.map((item) => item.createdAt);
  const dataset: number[] = sortedData.map((item) => item._avg.mood);

  // Create the dataset object with the required properties for the area chart
  const areaDataset: AreaDataset = {
    label: 'Mood',
    data: dataset,
    backgroundColor: 'rgba(0, 123, 255, 0.5)', // Adjust the color as needed
    borderColor: 'rgba(0, 123, 255, 1)', // Adjust the color as needed
    fill: 'origin', // Fill the area under the curve
  };

  // Return the labels array and the prepared dataset as an array
  return [labels, [areaDataset]];
}

export type IntervalFormat = false | "millisecond" | "second" | "minute" | "hour" | "day" | "week" | "month" | "quarter" | "year" | undefined

const AreaChart = ({ data, intervalFormat }: { data: DataItem[], intervalFormat: IntervalFormat }) => {
  if (!data && !intervalFormat) return;

  const getFormat = (intervalFormat: IntervalFormat) => {
    if (intervalFormat === 'month') {
      return   { month: 'MM yy'}
    }
    if (intervalFormat === 'day'){
      return { week: 'ccc' }
    }
    return {  day: 'h mm'}
  }



  const options: ChartOptions = {
    responsive: true,
    layout: {
     
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Mood Chart",
      },
    },
    // normalized: true,
    scales: {
      x: {
        type: 'timeseries',
        time: {
          parser: 'date-fns',
          unit: intervalFormat,
          displayFormats: {
             ...getFormat(intervalFormat)
          }
        
        },
        ticks: {
          source: 'auto',
           padding: 10,
           maxTicksLimit: 5
        },
        grid: {
          offset:  true
        }
      
      },
      y: {
         beginAtZero: true,
        //  offset: true,
        ticks: {
          padding: 20
        }
      }
    },
  };
  

  const [labels, datasets ] = prepareDataForAreaChart(data);
  return (
    <Box width={'100%'}>
      <Line options={options} data={{ labels, datasets }} />
    </Box>
  );
};

export default AreaChart;
