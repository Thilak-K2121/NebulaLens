import React from 'react';

// This is a single log entry
const LogItem = ({ entry }) => {
  const { model_agreement, input_features } = entry;
  
  // Create a short string of the 6 features
  const features = Object.entries(input_features)
    .map(([key, value]) => `${key}: ${value.toFixed(2)}`)
    .join(', ');

  return (
    <div className="p-4 bg-cosmic-card/50 border border-white/10 rounded-lg backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-white/70">Consensus Result</span>
          <p className="text-xl font-semibold text-cosmic-accent">
            {model_agreement.prediction}
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm text-white/70">Model Agreement</span>
          <p className="text-xl font-semibold text-white">
            {model_agreement.count} / {model_agreement.total}
          </p>
        </div>
      </div>
      <p className="text-xs text-white/50 mt-2 truncate" title={features}>
        {features}
      </p>
    </div>
  );
};


// This is the main component that holds the list
export default function PredictionLog({ log }) {
  if (log.length === 0) {
    return null; // Don't show anything if the log is empty
  }

  return (
    <div className="text-left">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Prediction History
      </h2>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {log.map((entry) => (
          <LogItem key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}