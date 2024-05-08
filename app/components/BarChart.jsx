import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['President', 'Vice President', 'Secretary General', 'Assistant Secretary'],
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData({
      labels: ['President', 'Vice President', 'Secretary General', 'Assistant Secretary'],
      datasets: [
        {
          label: 'Votes',
          data: [25000, 18000, 15000, 12000],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });

    setChartOptions({
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Presidential Election Statistics',
        },
      },
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    });
  }, []);

  return (
    <div className='w-full md:col-span-3 relative lg:h-[71vh] h-[50vh] m-auto p-4 border bg-white dark:bg-gray-900 dark:border-gray-700 rounded-md mt-5'>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default BarChart;
