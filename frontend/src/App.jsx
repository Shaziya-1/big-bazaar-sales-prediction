import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Analysis from "./components/Analysis";
import SalesPrediction from "./components/SalesPrediction";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/predict" element={<SalesPrediction />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
