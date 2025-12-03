//Sample data for charts
import cubejs, { Query } from '@cubejs-client/core';

const apiUrl = 'https://heavy-lansford.gcp-us-central1.cubecloudapp.dev/cubejs-api/v1';
const cubeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjEwMDAwMDAwMDAsImV4cCI6NTAwMDAwMDAwMH0.OHZOpOBVKr-sCwn8sbZ5UFsqI3uCs6e4omT7P6WVMFw';

const cubeApi = cubejs(cubeToken, { apiUrl });


/*export async function getAquisitionsByYear() {
  const acquisitionsByYearQuery: Query = {
    dimensions: ['Artworks.yearAcquired'],
    measures: ['Artworks.count'],
    filters: [
        {
        member: 'Artworks.yearAcquired',
        operator: 'set'
        }
    ],
    order: {
        'Artworks.yearAcquired': 'asc'
    }
    };

  const resultSet = await cubeApi.load(acquisitionsByYearQuery);

  return resultSet.tablePivot().map(row => ({
    year: parseInt(String(row['Artworks.yearAcquired'])),
    count: parseInt(String(row['Artworks.count']))
  }));
}

export async function getDimensions() {
  const dimensionsQuery: Query = {
    dimensions: [
      'Artworks.widthCm',
      'Artworks.heightCm'
    ],
    measures: [
      'Artworks.count'
    ],
    filters: [
      {
        member: 'Artworks.classification',
        operator: 'equals',
        values: [ 'Painting' ]
      },
      {
        member: 'Artworks.widthCm',
        operator: 'set'
      },
      {
        member: 'Artworks.widthCm',
        operator: 'lt',
        values: [ '500' ]
      },
      {
        member: 'Artworks.heightCm',
        operator: 'set'
      },
      {
        member: 'Artworks.heightCm',
        operator: 'lt',
        values: [ '500' ]
      }
    ]
  };

  const resultSet = await cubeApi.load(dimensionsQuery);

  return resultSet.tablePivot().map(row => ({
    width: parseInt(String(row['Artworks.widthCm'])),
    height: parseInt(String(row['Artworks.heightCm'])),
    count: parseInt(String(row['Artworks.count']))
  }));
}*/








import { readExcel, validateData, transformForChart, ChartData } from "../data/pipeline";

// Define the shape of your rows
interface AcquisitionRow {
  year: number;
  count: number;
}

// Example function: reads Excel and returns chart‑ready data
export async function getAquisitionsByYear(): Promise<ChartData> {
  // Local or remote Excel file
  const source = "./data/demo.xlsx"; // or "https://example.com/demo.xlsx"

  const rawData = await readExcel(source);

  const validated = validateData<AcquisitionRow>(rawData, ["year", "count"]);

  return transformForChart(validated, "year", "count", "Acquisitions by year");
}
