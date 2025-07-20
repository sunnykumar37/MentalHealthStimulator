import React, { useState, useEffect } from "react";
import { moodAPI } from "../../services/api";

interface MoodEntry {
  mood: string;
  timestamp: string;
}

const MoodTracker: React.FC = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string>("");

  const moodOptions = [
    { value: "happy", label: "😊 Happy", color: "bg-green-500" },
    { value: "sad", label: "😢 Sad", color: "bg-blue-500" },
    { value: "angry", label: "😠 Angry", color: "bg-red-500" },
    { value: "anxious", label: "😰 Anxious", color: "bg-yellow-500" },
    { value: "calm", label: "😌 Calm", color: "bg-teal-500" },
    { value: "excited", label: "🤩 Excited", color: "bg-pink-500" },
    { value: "tired", label: "😴 Tired", color: "bg-gray-500" },
    { value: "stressed", label: "😤 Stressed", color: "bg-orange-500" },
  ];

  const logMood = async (mood: string) => {
    setLoading(true);
    setError("");
    try {
      // For now, we'll use a mock token. In a real app, this would come from auth context
      const token = localStorage.getItem("authToken") || "mock-token";
      await moodAPI.logMood(mood, token);
      setSelectedMood("");
      fetchMoodHistory();
    } catch (err) {
      setError("Failed to log mood");
      console.error("Mood logging error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoodHistory = async () => {
    try {
      const token = localStorage.getItem("authToken") || "mock-token";
      const data = await moodAPI.getHistory(token, 5);
      setMoods(data.moods);
    } catch (err) {
      console.error("Failed to fetch mood history:", err);
    }
  };

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Mood Tracker</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3 text-gray-700">How are you feeling?</h4>
        <div className="grid grid-cols-2 gap-3">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => logMood(mood.value)}
              disabled={loading}
              className={`${mood.color} hover:opacity-80 text-white px-4 py-3 rounded-lg transition-all disabled:opacity-50`}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Logging mood...</p>
        </div>
      )}

      {moods.length > 0 && (
        <div>
          <h4 className="text-lg font-medium mb-3 text-gray-700">Recent Moods</h4>
          <div className="space-y-2">
            {moods.map((entry, index) => {
              const moodEmoji = {
                happy: '😊',
                sad: '😢',
                angry: '😠',
                anxious: '😰',
                calm: '😌',
                excited: '🤩',
                tired: '😴',
                stressed: '😤'
              }[entry.mood.toLowerCase()] || '😐';
              
              return (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{moodEmoji}</span>
                    <span className="capitalize font-semibold text-gray-800 text-lg">{entry.mood}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker; 