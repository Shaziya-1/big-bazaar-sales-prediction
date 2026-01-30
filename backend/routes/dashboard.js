import express from "express";
import loadCSV from "../utils/loadCSV.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { year, category, region } = req.query;

    let data = await loadCSV();

    if (year) {
      data = data.filter(d => d.Year === year);
    }

    if (category) {
      data = data.filter(d => d.Item_Category === category);
    }

    if (region) {
      data = data.filter(d => d.Region === region);
    }

    const totalSales = data.reduce(
      (sum, d) => sum + Number(d.Total_Sales),
      0
    );

    const totalUnits = data.reduce(
      (sum, d) => sum + Number(d.Units_Sold),
      0
    );

    const yearWiseSales = {};
    data.forEach(d => {
      yearWiseSales[d.Year] =
        (yearWiseSales[d.Year] || 0) + Number(d.Total_Sales);
    });

    const regionSales = {};
    data.forEach(d => {
      regionSales[d.Region] =
        (regionSales[d.Region] || 0) + Number(d.Total_Sales);
    });

    res.json({
      kpis: {
        totalSales,
        totalUnits,
        totalStores: new Set(data.map(d => d.City)).size
      },
      charts: {
        yearWiseSales,
        regionSales
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard API failed" });
  }
});

export default router;
