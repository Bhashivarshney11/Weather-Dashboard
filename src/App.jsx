import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Current from "./pages/Current";
import HistoryRange from "./pages/HistoryRange";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/current" replace />} />
        <Route path="/current" element={<Current />} />
        <Route path="/history-range" element={<HistoryRange />} />
      </Routes>
    </BrowserRouter>
  );
}