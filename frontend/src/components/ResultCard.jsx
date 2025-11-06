import React from 'react';

// A simple helper component for the "pills"
const ModelPill = ({ model, prediction }) => (
  <div className="bg-black/40 border border-white/10 rounded-full px-3 py-1 text-xs flex justify-between items-center">
    <span className="text-white/70 uppercase">{model}</span>
    <span className="text-cosmic-accent font-medium ml-2">{prediction}</span>
  </div>
);

export default function ResultCard({ predictions, modelAgreement, isLoading }) {
  
  if (isLoading) {
    return (
      <div className="bg-cosmic-card/70 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-h-[220px]">
        <h2 className="font-semibold text-lg text-white/80">Analyzing...</h2>
      </div>
    );
  }

  // Before any prediction
  if (!predictions || !modelAgreement) {
    return (
      <div className="bg-cosmic-card/70 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-h-[220px]">
        <h2 className="font-semibold text-lg mb-4">Prediction Result</h2>
        <p className="text-white/50 text-sm">Enter parameters to see results.</p>
      </div>
    );
  }

  // After a prediction
  return (
    <div className="bg-cosmic-card/70 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex flex-col justify-start text-left">
      
      {/* --- Model Agreement Section --- */}
      <h2 className="font-semibold text-lg mb-2">Consensus Result</h2>
      <p className="text-sm text-white/70">
        <strong className="text-white">{modelAgreement.count} out of {modelAgreement.total}</strong> models agree.
      </p>
      <div className="text-4xl font-bold text-cosmic-accent my-3">
        {modelAgreement.prediction}
      </div>

      {/* --- Individual Model Breakdown --- */}
      <h3 className="font-semibold text-md mt-4 pt-4 border-t border-white/10">
        Model Breakdown
      </h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {Object.entries(predictions).map(([modelName, prediction]) => (
          <ModelPill 
            key={modelName} 
            model={modelName} 
            prediction={prediction} 
          />
        ))}
      </div>
    </div>
  );
}