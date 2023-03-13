import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components";
import { LoginPage } from "./pages";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navbar />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
