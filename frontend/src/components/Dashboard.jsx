import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const Dashboard = () => {

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    year: "",
    category: "",
    region: ""
  });

  const [dashboardData, setDashboardData] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/dashboard", {
        params: filters
      });
      setDashboardData(res.data);
    } catch (err) {
      console.error("Dashboard API error", err);
    }
  };

  if (!dashboardData) return <p>Loading dashboard...</p>;

  /* ================= KPI DATA ================= */
  const kpiData = [
    {
      title: "Total Sales",
      value: `₹${(dashboardData.kpis.totalSales / 1e7).toFixed(2)} Cr`,
      icon: "💰"
    },
    {
      title: "Total Products Sold",
      value: dashboardData.kpis.totalUnits,
      icon: "📦"
    },
    {
      title: "Total Stores Analyzed",
      value: dashboardData.kpis.totalStores,
      icon: "🏬"
    }
  ];

  /* ================= CHART DATA ================= */
  const salesTrendData = {
    labels: Object.keys(dashboardData.charts.yearWiseSales),
    datasets: [
      {
        label: "Total Sales",
        data: Object.values(dashboardData.charts.yearWiseSales),
        borderColor: "#f97316",
        backgroundColor: "#f97316",
        tension: 0.4
      }
    ]
  };

  const regionData = {
    labels: Object.keys(dashboardData.charts.regionSales),
    datasets: [
      {
        data: Object.values(dashboardData.charts.regionSales),
        backgroundColor: "#f97316"
      }
    ]
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "20px" }}>
      {/* ✅ COMMON NAVBAR */}
      <Navbar />

      {/* ================= FILTERS (UI SAME) ================= */}
      <div style={card}>
        <h4 style={{ marginBottom: "12px" }}>Filters</h4>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <select
            style={filter}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="">All Years</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>

          <select
            style={filter}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Grocery">Grocery</option>
            <option value="Clothing">Clothing</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Personal Care">Personal Care</option>
          </select>

          <select
            style={filter}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          >
            <option value="">All Regions</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="East">East</option>
            <option value="West">West</option>
          </select>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div style={grid}>
        {kpiData.map((k, i) => (
          <div key={i} style={card}>
            <div style={{ fontSize: "22px" }}>{k.icon}</div>
            <p style={{ color: "#64748b" }}>{k.title}</p>
            <h2>{k.value}</h2>
          </div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginTop: "20px" }}>
        <div style={card}>
          <h4>Year-wise Sales Trend</h4>
          <Line data={salesTrendData} />
        </div>

        <div style={card}>
          <h4>Regional Analysis</h4>
          <Bar data={regionData} options={{ indexAxis: "y" }} />
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES (UNCHANGED) ================= */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "16px"
};

const card = {
  background: "#fff",
  padding: "18px",
  borderRadius: "14px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
};

const filter = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  minWidth: "180px",
  cursor: "pointer"
};

export default Dashboard;
