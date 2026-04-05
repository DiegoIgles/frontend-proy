import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Categorias from "./pages/Categorias/Categorias";
import CreateCategoria from "./pages/Categorias/CreateCategoria";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Categorías 🔥 */}
        <Route
          path="/categorias"
          element={
            <PrivateRoute>
              <Categorias />
            </PrivateRoute>
          }
        />
        <Route
  path="/categorias/crear"
  element={
    <PrivateRoute>
      <CreateCategoria />
    </PrivateRoute>
  }
/>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;