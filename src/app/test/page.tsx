"use client";
import { useState } from "react";
import { testMongoConnection } from "../actions";

export default function TestPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    const result = await testMongoConnection();
    setStatus(result.message);
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>MongoDB Connection Test</h1>
      <button
        onClick={handleTest}
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Testing..." : "Click to Test Connection"}
      </button>
      {status && (
        <p
          style={{
            marginTop: "20px",
            color: status.includes("success") ? "green" : "red",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}
