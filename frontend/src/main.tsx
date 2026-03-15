import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from "react-dom/client";

import "./index.css";

import ProtectedRoute from "./components/ProtectedRoute";

import ThemeProvider from "./theme/ThemeProvider";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Home from "./pages/Home";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>,
);
