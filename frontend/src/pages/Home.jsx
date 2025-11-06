import { useState } from "react";
import ParameterForm from "../components/ParameterForm";
import MetricsCard from "../components/MetricsCard";
import ResultCard from "../components/ResultCard";
import PredictionLog from "../components/PredictionLog"; // <-- NEW COMPONENT IMPORT

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [predictionLog, setPredictionLog] = useState([]); // <-- NEW STATE FOR LOG

  return (
    <>
      <section className="flex flex-col items-center text-center px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-white">
          NebulaLens: Decoding the Universe with Machine Learning
        </h1>
        <p className="text-white/70 mb-12 max-w-2xl">
          Enter the 6 object parameters to predict its class, or use the sliders
          to experiment with "what-if" scenarios.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          <ParameterForm 
            setIsLoading={setIsLoading} 
            setApiResult={setApiResult} 
            setPredictionLog={setPredictionLog} // <-- Pass setter to form
          />
          <div className="flex flex-col gap-6">
            <MetricsCard 
              performance={apiResult?.performance} 
              isLoading={isLoading} 
            />
            <ResultCard 
              predictions={apiResult?.predictions} 
              modelAgreement={apiResult?.model_agreement}
              isLoading={isLoading} 
            />
          </div>
        </div>
      </section>

      {/* --- NEW: Prediction Log Section --- */}
      <section className="max-w-5xl w-full mx-auto px-6 mt-8">
        <PredictionLog log={predictionLog} />
      </section>
    </>
  );
}