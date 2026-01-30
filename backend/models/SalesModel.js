import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema({
  itemType: String,
  price: Number,
  outletSize: String,
  location: String,
  year: Number
});

export default mongoose.model("Sales", SalesSchema);
