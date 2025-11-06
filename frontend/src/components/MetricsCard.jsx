import React from 'react';

// This is a small helper component for the bar chart
const MetricBar = ({ label, value, accentColor = "bg-cosmic-accent" }) => {
  const percentage = (value * 100).toFixed(1);
  return (
    <div className="text-xs">
      <div className="flex justify-between mb-1">
        <span className="text-white/80">{label}</span>
        <span className="text-white/90 font-medium">{percentage}%</span>
      </div>
      <div className="w-full bg-black/40 rounded-full h-2 border border-white/10">
        <div 
          className={`${accentColor} h-full rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function MetricsCard({ performance, isLoading }) {
  
  // Use placeholder data if no performance prop is given
  const defaultMetrics = {
    rf: { accuracy: 0.0, f1_score: 0.0 },
    mlp: { accuracy: 0.0, f1_score: 0.0 },
    svm: { accuracy: 0.0, f1_score: 0.0 },
    knn: { accuracy: 0.0, f1_score: 0.0 }
  };
  
  const data = performance || defaultMetrics;

  return (
    <div className="bg-cosmic-card/70 backdrop-blur-md p-6 rounded-2xl border border-white/10">
      <h2 className="font-semibold text-lg mb-4 text-left">Model Performance (on Test Set)</h2>
      {isLoading ? (
        <p className="text-white/70 text-sm text-center">Loading...</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(data).map(([modelName, metrics]) => (
            <div key={modelName} className="p-3 bg-black/30 rounded-lg border border-white/10">
              <h3 className="text-sm font-semibold uppercase text-white/90 mb-2">
                {modelName}
              </h3>
              <div className="space-y-2">
                <MetricBar label="Accuracy" value={metrics.accuracy} />
                <MetricBar 
                  label="F1-Score" 
                  value={metrics.f1_score}
                  accentColor="bg-blue-400" // Use a different color for F1
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}