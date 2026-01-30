import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import predictRoute from "./routes/predict.js";
import dashboardRoute from "./routes/dashboard.js";
import analysisRoutes from "./routes/analysis.js";

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(bodyParser.json());

/* ===== ROUTES ===== */
app.use("/api/predict", predictRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/analysis", analysisRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working");
});

/* ===== SERVER ===== */
app.listen(5001, () => {
  console.log("Backend running on port 5001");
});
