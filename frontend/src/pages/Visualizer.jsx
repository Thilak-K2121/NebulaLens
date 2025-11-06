import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Radar } from 'react-chartjs-2'; // <-- Import Radar
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale, // <-- Add this for Radar
  PointElement,      // <-- Add this for Radar
  LineElement,       // <-- Add this for Radar
  Filler,            // <-- Add this for Radar
} from 'chart.js';

// --- REGISTER ALL CHART COMPONENTS ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale, // <-- Register Radar
  PointElement,      // <-- Register Radar
  LineElement,       // <-- Register Radar
  Filler             // <-- Register Radar
);

// --- This is the same placeholder data from your backend ---
// We will use all 4 metrics for the Radar Chart
const performanceMetrics = {
  svm: { accuracy: 0.92, precision: 0.91, recall: 0.92, f1_score: 0.91 },
  mlp: { accuracy: 0.95, precision: 0.94, recall: 0.95, f1_score: 0.94 },
  knn: { accuracy: 0.89, precision: 0.88, recall: 0.89, f1_score: 0.88 },
  rf: { accuracy: 0.97, precision: 0.97, recall: 0.97, f1_score: 0.97 }
};

// --- NEW: Chart 1: Model Profile Radar Chart ---
const RadarChart = () => {
  const data = {
    // These are the "spokes" of the wheel
    labels: ['Accuracy', 'Precision', 'Recall', 'F1-Score'],
    datasets: [
      {
        label: 'Random Forest',
        data: [
          performanceMetrics.rf.accuracy,
          performanceMetrics.rf.precision,
          performanceMetrics.rf.recall,
          performanceMetrics.rf.f1_score
        ],
        backgroundColor: 'rgba(234, 179, 8, 0.2)', // Cosmic Accent (transparent)
        borderColor: 'rgba(234, 179, 8, 1)',
        borderWidth: 2,
      },
      {
        label: 'MLP',
        data: [
          performanceMetrics.mlp.accuracy,
          performanceMetrics.mlp.precision,
          performanceMetrics.mlp.recall,
          performanceMetrics.mlp.f1_score
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // Blue (transparent)
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'SVM',
        data: [
          performanceMetrics.svm.accuracy,
          performanceMetrics.svm.precision,
          performanceMetrics.svm.recall,
          performanceMetrics.svm.f1_score
        ],
        backgroundColor: 'rgba(236, 72, 153, 0.2)', // Pink (transparent)
        borderColor: 'rgba(236, 72, 153, 1)',
        borderWidth: 2,
      },
      {
        label: 'KNN',
        data: [
          performanceMetrics.knn.accuracy,
          performanceMetrics.knn.precision,
          performanceMetrics.knn.recall,
          performanceMetrics.knn.f1_score
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.2)', // Green (transparent)
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'rgba(255, 255, 255, 0.8)' }
      },
      title: {
        display: true,
        text: 'Model Profile Comparison',
        color: 'rgba(255, 255, 255, 0.9)',
        font: { size: 18 }
      },
    },
    scales: {
      r: { // This is the radial scale (the "web")
        angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 12 }
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          backdropColor: 'rgba(0, 0, 0, 0.5)',
          backdropPadding: 2,
          stepSize: 0.1, // Show ticks for 0.1, 0.2...
        },
        min: 0.8, // Start at 0.8 to "zoom in" on the differences
        max: 1.0,
      }
    }
  };

  return <Radar data={data} options={options} />;
};


// --- Chart 2: Feature Importance (No changes) ---
const FeatureImportanceChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/feature_importance');
        if (response.data.error) {
          setError(response.data.error);
          return;
        }
        
        const data = response.data;
        setChartData({
          labels: Object.keys(data),
          datasets: [{
            label: 'Feature Importance (from Random Forest)',
            data: Object.values(data),
            backgroundColor: 'rgba(234, 179, 8, 0.7)',
            borderColor: 'rgba(234, 179, 8, 1)',
            borderWidth: 1,
          }]
        });
      } catch (err) {
        setError("Failed to fetch feature importance.");
      }
    };
    fetchData();
  }, []);

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Which Features Matter Most?',
        color: 'rgba(255, 255, 255, 0.9)',
        font: { size: 18 }
      },
    },
    scales: {
      y: { ticks: { color: 'rgba(255, 255, 255, 0.7)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      x: { ticks: { color: 'rgba(255, 255, 255, 0.7)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
    }
  };

  if (error) return <p className="text-red-400 text-center">{error}</p>;
  if (!chartData) return <p className="text-white/70 text-center">Loading feature importance...</p>;

  return <Bar options={options} data={chartData} />;
};


// --- Chart 3: Model Performance Bar Chart (No changes) ---
const labels = Object.keys(performanceMetrics);
const performanceChartData = {
  labels,
  datasets: [
    {
      label: 'Accuracy',
      data: labels.map(model => performanceMetrics[model].accuracy),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
    },
    {
      label: 'F1-Score',
      data: labels.map(model => performanceMetrics[model].f1_score),
      backgroundColor: 'rgba(234, 179, 8, 0.7)',
    },
  ],
};
const performanceChartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top', labels: { color: 'rgba(255, 255, 255, 0.8)' } },
    title: {
      display: true,
      text: 'Model Performance Comparison (Test Set)',
      color: 'rgba(255, 255, 255, 0.9)',
      font: { size: 18 }
    },
  },
  scales: {
    y: { beginAtZero: true, max: 1.0, ticks: { color: 'rgba(255, 255, 255, 0.7)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
    x: { ticks: { color: 'rgba(255, 255, 255, 0.7)' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
  }
};

// --- Main Page Component ---
export default function Visualizer() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
      <h1 className="text-4xl font-bold text-center text-cosmic-accent mb-8">
        Data Visualizer
      </h1>
      
      {/* --- NEW CHART GOES HERE AT THE TOP --- */}
      <div className="bg-cosmic-card/70 backdrop-blur-md p-6 rounded-2xl border border-white/10">
        <RadarChart />
      </div>

      {/* --- Chart 2 --- */}
      <div className="bg-cosmic-card/70 backdrop-blur-md p-6 rounded-2xl border border-white/10">
        <FeatureImportanceChart />
      </div>

      {/* --- Chart 3 --- */}
      <div className="bg-cosmic-card/70 backdrop-blur-md p-6 rounded-2xl border border-white/10">
        <Bar options={performanceChartOptions} data={performanceChartData} />
      </div>
    </div>
  );
}