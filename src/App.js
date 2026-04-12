import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

// Inventario
import Categorias from "./pages/Categorias/Categorias";
import CreateCategoria from "./pages/Categorias/CreateCategoria";

// Compras
import NotasCompra from "./pages/compras/NotasCompra";
import VerNotaCompra from "./pages/compras/VerNotaCompra";
import CreateNotaCompra from "./pages/compras/CreateNotaCompra";
import PagoNotaCompra from "./pages/compras/PagoNotaCompra";
import ReciboCompra from "./pages/compras/ReciboCompra";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        {/* Inventario */}
        <Route path="/inventario/categorias"        element={<PrivateRoute><Categorias /></PrivateRoute>} />
        <Route path="/inventario/categorias/crear"  element={<PrivateRoute><CreateCategoria /></PrivateRoute>} />

        {/* Compras */}
        <Route path="/compras/notas"        element={<PrivateRoute><NotasCompra /></PrivateRoute>} />
        <Route path="/compras/notas/crear"  element={<PrivateRoute><CreateNotaCompra /></PrivateRoute>} />
        <Route path="/compras/notas/:id"      element={<PrivateRoute><VerNotaCompra /></PrivateRoute>} />
        <Route path="/compras/notas/:id/pago"   element={<PrivateRoute><PagoNotaCompra /></PrivateRoute>} />
        <Route path="/compras/notas/:id/recibo" element={<PrivateRoute><ReciboCompra /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
