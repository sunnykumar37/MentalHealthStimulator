import React, { useState, useEffect } from "react";
import { exercisesAPI } from "../../services/api";

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    action: string;
    duration: number;
    instruction: string;
  }>;
  cycles: number;
}

const BreathingExercise: React.FC = () => {
  const [patterns, setPatterns] = useState<BreathingPattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBreathingPatterns();
  }, []);

  const fetchBreathingPatterns = async () => {
    setLoading(true);
    try {
      const data = await exercisesAPI.getBreathingPatterns();
      setPatterns(data.patterns);
    } catch (error) {
      console.error("Failed to fetch breathing patterns:", error);
    } finally {
      setLoading(false);
    }
  };

  const startExercise = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern);
    setIsActive(true);
    setCurrentStep(0);
    setTimeLeft(pattern.steps[0].duration);
  };

  const stopExercise = () => {
    setIsActive(false);
    setSelectedPattern(null);
    setCurrentStep(0);
    setTimeLeft(0);
  };

  useEffect(() => {
    if (!isActive || !selectedPattern) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentStep < selectedPattern.steps.length - 1) {
            setCurrentStep(currentStep + 1);
            return selectedPattern.steps[currentStep + 1].duration;
          } else {
            stopExercise();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, selectedPattern, currentStep]);

  if (loading) {
    return (
      <div className="p-6 border rounded-lg shadow-md bg-white">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading breathing exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      {isActive && selectedPattern ? (
        <div className="text-center">
          <h4 className="text-lg font-medium mb-4">{selectedPattern.name}</h4>
          <div className="mb-4">
            <div className="text-4xl font-bold text-teal-600 mb-2">{timeLeft}</div>
            <p className="text-gray-600">
              {selectedPattern.steps[currentStep].instruction}
            </p>
          </div>
          <button
            onClick={stopExercise}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Stop Exercise
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-6 text-center">Choose a breathing pattern to start:</p>
          <div className="space-y-4">
            {patterns.map((pattern) => (
              <div key={pattern.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-all duration-200">
                <h4 className="font-medium text-gray-800 mb-3 text-lg">{pattern.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{pattern.description}</p>
                <button
                  onClick={() => startExercise(pattern)}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
                >
                  Start {pattern.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingExercise; 