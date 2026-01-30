import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Analysis = () => {
  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    year: "",
    category: "",
    region: "",
    outletType: ""
  });

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalysis();
  }, [filters]);

  const fetchAnalysis = async () => {
    const res = await axios.get("http://localhost:5001/api/analysis", {
      params: filters
    });
    setData(res.data);
  };

  if (!data) return <p>Loading analysis...</p>;

  /* ================= PIE OPTIONS ================= */
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" }
    }
  };

  /* ================= CATEGORY ================= */
  const categoryChart = {
    labels: data.category.labels,
    datasets: [
      {
        label: "Sales (₹ Cr)",
        data: data.category.sales,
        backgroundColor: "#f97316"
      },
      {
        label: "Profit (₹ Cr)",
        data: data.category.profit,
        backgroundColor: "#22c55e"
      }
    ]
  };

  /* ================= DEMOGRAPHICS ================= */
  const ageChart = {
    labels: data.age.labels,
    datasets: [
      {
        data: data.age.sales,
        backgroundColor: ["#f97316", "#fb923c", "#fdba74", "#fed7aa"]
      }
    ]
  };

  const cityTierChart = {
    labels: data.cityTier.labels,
    datasets: [
      {
        data: data.cityTier.sales,
        backgroundColor: ["#f97316", "#fb923c", "#fdba74"]
      }
    ]
  };

  /* ================= GEOGRAPHIC HELPERS ================= */
  const topStateIndex = data.states.sales.indexOf(
    Math.max(...data.states.sales)
  );

  const topRegionIndex = data.regions.growth.indexOf(
    Math.max(...data.regions.growth)
  );

  return (
    <div style={{ padding: "20px", background: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      {/* ================= FILTERS ================= */}
      <div style={card}>
        <h4>Analysis Filters</h4>
        <div style={filterRow}>
          <select style={filter} onChange={e => setFilters({ ...filters, year: e.target.value })}>
            <option value="">All Years</option>
            <option>2020</option>
            <option>2021</option>
            <option>2022</option>
            <option>2023</option>
            <option>2024</option>
          </select>

          <select style={filter} onChange={e => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All Categories</option>
            {data.category.labels.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select style={filter} onChange={e => setFilters({ ...filters, region: e.target.value })}>
            <option value="">All Regions</option>
            {data.regions.labels.map(r => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= CATEGORY ANALYSIS ================= */}
      <section style={section}>
        <h3>Product Category Analysis</h3>
        <div style={grid2}>
          <div style={card}>
            <div style={{ height: "320px" }}>
              <Bar
                data={categoryChart}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>

          <div style={card}>
            <h4>High Performer</h4>
            <p style={{ color: "#16a34a", fontWeight: "600" }}>
              {data.highLow.high.name} – ₹{data.highLow.high.sales} Cr
            </p>

            <h4>Low Performer</h4>
            <p style={{ color: "#dc2626", fontWeight: "600" }}>
              {data.highLow.low.name} – ₹{data.highLow.low.sales} Cr
            </p>
          </div>
        </div>
      </section>

      {/* ================= CUSTOMER DEMOGRAPHICS ================= */}
      <section style={section}>
        <h3>Customer Demographics</h3>
        <div style={grid2}>
          <div style={card}>
            <div style={{ height: "280px" }}>
              <Pie data={ageChart} options={pieOptions} />
            </div>
          </div>

          <div style={card}>
            <div style={{ height: "280px" }}>
              <Pie data={cityTierChart} options={pieOptions} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= GEOGRAPHIC LOCATION ANALYSIS ================= */}
      <section style={section}>
        <h3>Geographic Location Analysis</h3>

        {/* -------- ONLY THESE GRAPHS (TOP GRAPH REMOVED) -------- */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
          
          {/* Top 10 Cities */}
          <div style={card}>
            <h4>Top 10 Cities by Sales</h4>
            <div style={{ height: "300px" }}>
              <Bar
                data={{
                  labels: data.states.labels.slice(0, 10),
                  datasets: [
                    {
                      label: "Sales (₹ Cr)",
                      data: data.states.sales.slice(0, 10),
                      backgroundColor: "#f97316"
                    }
                  ]
                }}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  maintainAspectRatio: false
                }}
              />
            </div>
          </div>

          {/* Regional Growth */}
          <div style={card}>
            <h4>Regional Sales & Growth Rate</h4>
            <div style={{ height: "300px" }}>
              <Bar
                data={{
                  labels: data.regions.labels,
                  datasets: [
                    {
                      type: "bar",
                      label: "Sales (₹ Cr)",
                      data: data.regions.sales,
                      backgroundColor: "#f97316"
                    },
                    {
                      type: "line",
                      label: "Growth %",
                      data: data.regions.growth,
                      borderColor: "#22c55e",
                      tension: 0.4,
                      yAxisID: "y1"
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { title: { display: true, text: "Sales (₹ Cr)" } },
                    y1: {
                      position: "right",
                      grid: { drawOnChartArea: false },
                      title: { display: true, text: "Growth %" }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px", marginTop: "18px" }}>
          <div style={card}>
            <h4>📍 Top Performing State</h4>
            <h3 style={{ color: "#f97316" }}>{data.states.labels[topStateIndex]}</h3>
            <p>Total Sales: ₹{data.states.sales[topStateIndex]} Cr</p>
          </div>

          <div style={card}>
            <h4>🏙 Top Performing City</h4>
            <h3 style={{ color: "#2563eb" }}>New Delhi</h3>
            <p>Total Sales: ₹40.7 Cr</p>
          </div>

          <div style={card}>
            <h4>📈 Fastest Growing Region</h4>
            <h3 style={{ color: "#16a34a" }}>{data.regions.labels[topRegionIndex]}</h3>
            <p>Growth Rate: {data.regions.growth[topRegionIndex]}%</p>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ================= STYLES ================= */
const card = {
  background: "#fff",
  padding: "18px",
  borderRadius: "14px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
};

const section = { marginTop: "28px" };

const grid2 = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "18px"
};

const filterRow = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap"
};

const filter = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  minWidth: "180px"
};

export default Analysis;
