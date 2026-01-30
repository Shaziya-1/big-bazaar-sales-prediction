import express from "express";
import XLSX from "xlsx";

const router = express.Router();
let lastReport = null;

router.post("/", (req, res) => {
  const { itemType, price, outletSize, locationType, outletType, year } = req.body;

  let factor = 1;
  if (outletSize === "High") factor += 0.25;
  if (locationType === "Urban") factor += 0.15;

  const predictedSales = Math.round(price * 850 * factor);

  lastReport = [
    { Parameter: "Item Type", Value: itemType },
    { Parameter: "Item Price (₹)", Value: price },
    { Parameter: "Outlet Size", Value: outletSize },
    { Parameter: "Outlet Location", Value: locationType },
    { Parameter: "Outlet Type", Value: outletType },
    { Parameter: "Prediction Year", Value: year },
    { Parameter: "Predicted Sales (₹)", Value: predictedSales }
  ];

  res.json({
    predictedSales,
    trend: {
      months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      historical: [120000,118000,117000,123000,121000,122000,119000,124000,123000,120000,121000,122000],
      predicted: Array(12).fill(predictedSales / 12)
    },
    insights: {
      demand: predictedSales > 150000 ? "High" : "Medium",
      category: "Stable growth expected",
      recommendation: "Maintain current inventory levels"
    }
  });
});

router.get("/report", (req, res) => {
  const ws = XLSX.utils.json_to_sheet(lastReport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sales Prediction Report");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  res.setHeader("Content-Disposition", "attachment; filename=Sales_Prediction_Report.xlsx");
  res.send(buffer);
});

export default router;
