import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { Line } from "react-chartjs-2";

const SalesPrediction = () => {
  const [form, setForm] = useState({
    itemType: "Grocery",
    price: 150,
    outletSize: "Medium",
    locationType: "Urban",
    outletType: "Supermarket",
    year: 2025
  });

  const [result, setResult] = useState(null);

  const predictSales = async () => {
    const res = await axios.post("http://localhost:5001/api/predict", form);
    setResult(res.data);
  };

  const downloadReport = () => {
    window.open("http://localhost:5001/api/predict/report", "_blank");
  };

  return (
    <div style={page}>
      <Navbar />

      <h2>Sales Prediction & Reports</h2>
      <p style={{ color: "#64748b" }}>
        Predict future sales based on product and outlet parameters
      </p>

      <div style={mainGrid}>
        {/* INPUT PARAMETERS */}
        <div style={inputCard}>
          <h4>🧮 Input Parameters</h4>

          <label>Item Type *</label>
          <select style={input} onChange={e => setForm({ ...form, itemType: e.target.value })}>
            <option>Grocery</option>
            <option>Dairy</option>
            <option>Electronics</option>
            <option>Clothing</option>
          </select>

          <label>Item Price (₹) *</label>
          <input
            type="number"
            style={input}
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />

          <label>Outlet Size *</label>
          <select style={input} onChange={e => setForm({ ...form, outletSize: e.target.value })}>
            <option>Small</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <label>Outlet Location Type *</label>
          <select style={input} onChange={e => setForm({ ...form, locationType: e.target.value })}>
            <option>Urban</option>
            <option>Rural</option>
          </select>

          <label>Outlet Type *</label>
          <select style={input} onChange={e => setForm({ ...form, outletType: e.target.value })}>
            <option>Supermarket</option>
            <option>Hypermarket</option>
            <option>Convenience Store</option>
          </select>

          <label>Prediction Year *</label>
          <input
            type="number"
            style={input}
            value={form.year}
            onChange={e => setForm({ ...form, year: e.target.value })}
          />

          <button style={predictBtn} onClick={predictSales}>
            🔮 Predict Sales
          </button>
        </div>

        {/* RESULTS */}
        <div>
          {result && (
            <>
              {/* PREDICTED SALES */}
              <div style={predictionCard}>
                <h4>📊 Predicted Sales</h4>
                <h1>₹{result.predictedSales.toLocaleString()}</h1>
                <p>Expected sales for selected configuration</p>
                <button style={downloadBtn} onClick={downloadReport}>
                  ⬇ Download Report
                </button>
              </div>

              {/* TREND */}
              <div style={card}>
                <h4>Sales Trend Comparison</h4>
                <div style={{ height: "260px" }}>
                  <Line
                    data={{
                      labels: result.trend.months,
                      datasets: [
                        {
                          label: "Historical Sales",
                          data: result.trend.historical,
                          borderColor: "#94a3b8"
                        },
                        {
                          label: "Predicted Sales",
                          data: result.trend.predicted,
                          borderColor: "#f97316"
                        }
                      ]
                    }}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>

              {/* INSIGHTS */}
              <div style={card}>
                <h4>💡 Business Insights</h4>
                <ul>
                  <li><b>Demand Level:</b> {result.insights.demand}</li>
                  <li><b>Category:</b> {result.insights.category}</li>
                  <li><b>Recommendation:</b> {result.insights.recommendation}</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const page = {
  padding: "20px",
  background: "#f8fafc",
  minHeight: "100vh"
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  gap: "20px",
  alignItems: "stretch"
};

const inputCard = {
  background: "#fff",
  padding: "18px",
  borderRadius: "14px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const card = {
  background: "#fff",
  padding: "18px",
  borderRadius: "14px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  marginBottom: "18px"
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb"
};

const predictBtn = {
  marginTop: "10px",
  padding: "12px",
  background: "linear-gradient(135deg,#f97316,#fb923c)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer"
};

const predictionCard = {
  background: "linear-gradient(135deg,#f97316,#fb923c)",
  color: "#fff",
  padding: "20px",
  borderRadius: "14px",
  marginBottom: "18px"
};

const downloadBtn = {
  marginTop: "10px",
  background: "#fff",
  color: "#f97316",
  padding: "8px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer"
};

export default SalesPrediction;
