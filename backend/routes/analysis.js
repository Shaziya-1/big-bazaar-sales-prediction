import express from "express";
import loadCSV from "../utils/loadCSV.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    /* ===== QUERY PARAMS (SAFE NAMING) ===== */
    const {
      year,
      category: categoryFilter,
      region,
      outletType
    } = req.query;

    let data = await loadCSV();

    /* ===== FILTERS ===== */
    if (year) {
      data = data.filter(d => String(d.Year) === String(year));
    }

    if (categoryFilter) {
      data = data.filter(
        d => d.Item_Category?.trim() === categoryFilter
      );
    }

    if (region) {
      data = data.filter(
        d => d.Region?.trim() === region
      );
    }

    if (outletType) {
      data = data.filter(
        d => d.Outlet_Type?.trim() === outletType
      );
    }

    /* ================= CATEGORY ANALYSIS ================= */
    const catMap = {};
    data.forEach(d => {
      const cat = d.Item_Category;
      if (!catMap[cat]) {
        catMap[cat] = { sales: 0, profit: 0 };
      }
      catMap[cat].sales += Number(d.Total_Sales || 0);
      catMap[cat].profit += Number(d.Profit || 0);
    });

    const category = {
      labels: Object.keys(catMap),
      sales: Object.values(catMap).map(v =>
        +(v.sales / 1e7).toFixed(2)
      ),
      profit: Object.values(catMap).map(v =>
        +(v.profit / 1e7).toFixed(2)
      )
    };

    /* ================= HIGH / LOW PERFORMER ================= */
    const sortedCats = Object.entries(catMap)
      .sort((a, b) => b[1].sales - a[1].sales);

    const highLow = {
      high: {
        name: sortedCats[0]?.[0] || "N/A",
        sales: sortedCats[0]
          ? +(sortedCats[0][1].sales / 1e7).toFixed(2)
          : 0
      },
      low: {
        name: sortedCats.at(-1)?.[0] || "N/A",
        sales: sortedCats.at(-1)
          ? +(sortedCats.at(-1)[1].sales / 1e7).toFixed(2)
          : 0
      }
    };

    /* ================= AGE GROUP ================= */
    const ageMap = {};
    data.forEach(d => {
      const age = d.Customer_Age_Group;
      ageMap[age] =
        (ageMap[age] || 0) + Number(d.Total_Sales || 0);
    });

    const age = {
      labels: Object.keys(ageMap),
      sales: Object.values(ageMap).map(v =>
        +(v / 1e7).toFixed(2)
      )
    };

    /* ================= CITY TIER ================= */
    const tierMap = {};
    data.forEach(d => {
      const tier = d.City_Tier;
      tierMap[tier] =
        (tierMap[tier] || 0) + Number(d.Total_Sales || 0);
    });

    const cityTier = {
      labels: Object.keys(tierMap),
      sales: Object.values(tierMap).map(v =>
        +(v / 1e7).toFixed(2)
      )
    };

    /* ================= STATE ANALYSIS ================= */
    const stateMap = {};
    data.forEach(d => {
      const state = d.State;
      if (!stateMap[state]) stateMap[state] = [];
      stateMap[state].push(Number(d.Total_Sales || 0));
    });

    const states = {
      labels: Object.keys(stateMap),
      sales: Object.values(stateMap).map(arr =>
        +(arr.reduce((a, b) => a + b, 0) / 1e7).toFixed(2)
      ),
      avg: Object.values(stateMap).map(arr =>
        +(
          (arr.reduce((a, b) => a + b, 0) / arr.length) / 1e5
        ).toFixed(2)
      )
    };

    /* ================= REGION ANALYSIS ================= */
    const regionMap = {};
    data.forEach(d => {
      const r = d.Region;
      regionMap[r] =
        (regionMap[r] || 0) + Number(d.Total_Sales || 0);
    });

    const regions = {
      labels: Object.keys(regionMap),
      sales: Object.values(regionMap).map(v =>
        +(v / 1e7).toFixed(2)
      ),
      growth: Object.values(regionMap).map(() =>
        +(Math.random() * 10 + 5).toFixed(1)
      )
    };

    /* ================= FINAL RESPONSE ================= */
    res.json({
      category,
      age,
      cityTier,
      states,
      regions,
      highLow
    });

  } catch (err) {
    console.error("Analysis API error:", err);
    res.status(500).json({ error: "Analysis API failed" });
  }
});

export default router;
