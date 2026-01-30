import fs from "fs";
import path from "path";
import csv from "csv-parser";

const loadCSV = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(
      process.cwd(),
      "..",
      "data",
      "bigbazaar_sales_10k_india.csv"
    );

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

export default loadCSV;
