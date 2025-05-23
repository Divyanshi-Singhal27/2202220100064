import React, { useState } from "react";
import { createRoot } from "react-dom/client";

// API endpoints mapping
const API_MAP = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

const TYPE_LABELS = {
  p: "Prime",
  f: "Fibonacci",
  e: "Even",
  r: "Random",
};

function App() {
  const [numberType, setNumberType] = useState("p");
  const [windowSize, setWindowSize] = useState(10);
  const [window, setWindow] = useState([]); // current window
  const [prevWindow, setPrevWindow] = useState([]); // previous window
  const [numbersFetched, setNumbersFetched] = useState([]); // numbers fetched from API
  const [avg, setAvg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Helper: Calculate average
  const calcAvg = (arr) => {
    if (!arr.length) return null;
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
  };

  const MOCK_DATA = {
  p: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
  f: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55],
  e: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
  r: [7, 14, 2, 9, 21, 3, 11, 6, 19, 8],
};

const fetchNumbers = async () => {
  setLoading(true);
  setStatus("");
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Get mock numbers based on type
    let nums = MOCK_DATA[numberType].slice(0, Math.max(1, Math.floor(Math.random() * 10)));
    nums = [...new Set(nums)];
    // Merge with current window, keep unique, limit to window size
    let merged = [...window, ...nums];
    merged = [...new Set(merged)];
    if (merged.length > windowSize) {
      merged = merged.slice(merged.length - windowSize);
    }
    setPrevWindow([...window]);
    setWindow(merged);
    setNumbersFetched(nums);
    setAvg(calcAvg(merged));
  } catch (err) {
    setStatus("Error fetching numbers or request timed out.");
  } finally {
    setLoading(false);
  }
};

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const fetchNumbers = async () => {
  setLoading(true);
  setStatus("");
  let apiUrl = API_MAP[numberType];
  let controller = new AbortController();
  let timeout = setTimeout(() => controller.abort(), 500);

  try {
    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error("API error");
    const data = await res.json();

    // Clean and deduplicate numbers
    let nums = Array.isArray(data.numbers)
      ? data.numbers.filter((n) => typeof n === "number")
      : [];
    nums = [...new Set(nums)];

    // Merge with current window, keep unique, limit to window size
    let merged = [...window, ...nums];
    merged = [...new Set(merged)];
    if (merged.length > windowSize) {
      merged = merged.slice(merged.length - windowSize);
    }

    setPrevWindow([...window]);
    setWindow(merged);
    setNumbersFetched(nums);
    setAvg(calcAvg(merged));
  } catch (err) {
    setStatus("Error fetching numbers or request timed out.");
  } finally {
    setLoading(false);
  }
};
  };

  // Format response as required
  const formatResponse = () => ({
    windowPrevState: prevWindow,
    windowCurrState: window,
    numbers: numbersFetched,
    avg: avg ? Number(avg) : null,
  });

  return (
    <div className="container">
      <h2>Average Calculator Microservice</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Number Type:
          <select
            value={numberType}
            onChange={(e) => setNumberType(e.target.value)}
            disabled={loading}
          >
            <option value="p">Prime</option>
            <option value="f">Fibonacci</option>
            <option value="e">Even</option>
            <option value="r">Random</option>
          </select>
        </label>
        <label>
          Window Size:
          <input
            type="number"
            min="1"
            max="100"
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
            disabled={loading}
            style={{ width: "60px" }}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Fetching..." : "Fetch Numbers"}
        </button>
      </form>
      {status && <div className="status">{status}</div>}
      <h3>Response</h3>
      <pre>{JSON.stringify(formatResponse(), null, 2)}</pre>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);