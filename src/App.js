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

// Finanzas
import Caja from "./pages/finanzas/Caja";
import CuentasCobrar from "./pages/finanzas/CuentasCobrar";
import VerCuentaCobrar from "./pages/finanzas/VerCuentaCobrar";
import CuentasPagar from "./pages/finanzas/CuentasPagar";
import VerCuentaPagar from "./pages/finanzas/VerCuentaPagar";

// Proyectos
import Proyectos from "./pages/proyectos/Proyectos";
import VerProyecto from "./pages/proyectos/VerProyecto";
import CreateProyecto from "./pages/proyectos/CreateProyecto";
import CotizacionProyecto from "./pages/proyectos/CotizacionProyecto";

// Ajustes
import Ajustes from "./pages/ajustes/Ajustes";
import CreateAjuste from "./pages/ajustes/CreateAjuste";
import VerAjuste from "./pages/ajustes/VerAjuste";

// Ventas
import NotasVenta from "./pages/ventas/NotasVenta";
import VerNotaVenta from "./pages/ventas/VerNotaVenta";
import CreateNotaVenta from "./pages/ventas/CreateNotaVenta";
import CobroNotaVenta from "./pages/ventas/CobroNotaVenta";
import ReciboVenta from "./pages/ventas/ReciboVenta";

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

        {/* Finanzas */}
        <Route path="/finanzas/caja"                          element={<PrivateRoute><Caja /></PrivateRoute>} />
        <Route path="/finanzas/cuentas-por-cobrar"            element={<PrivateRoute><CuentasCobrar /></PrivateRoute>} />
        <Route path="/finanzas/cuentas-por-cobrar/:id"        element={<PrivateRoute><VerCuentaCobrar /></PrivateRoute>} />
        <Route path="/finanzas/cuentas-por-pagar"             element={<PrivateRoute><CuentasPagar /></PrivateRoute>} />
        <Route path="/finanzas/cuentas-por-pagar/:id"         element={<PrivateRoute><VerCuentaPagar /></PrivateRoute>} />

        {/* Proyectos */}
        <Route path="/proyectos"        element={<PrivateRoute><Proyectos /></PrivateRoute>} />
        <Route path="/proyectos/crear"  element={<PrivateRoute><CreateProyecto /></PrivateRoute>} />
        <Route path="/proyectos/:id"            element={<PrivateRoute><VerProyecto /></PrivateRoute>} />
        <Route path="/proyectos/:id/cotizacion" element={<PrivateRoute><CotizacionProyecto /></PrivateRoute>} />

        {/* Ajustes */}
        <Route path="/ajustes"        element={<PrivateRoute><Ajustes /></PrivateRoute>} />
        <Route path="/ajustes/crear"  element={<PrivateRoute><CreateAjuste /></PrivateRoute>} />
        <Route path="/ajustes/:id"    element={<PrivateRoute><VerAjuste /></PrivateRoute>} />

        {/* Ventas */}
        <Route path="/ventas/notas"             element={<PrivateRoute><NotasVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/crear"       element={<PrivateRoute><CreateNotaVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/:id"         element={<PrivateRoute><VerNotaVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/:id/cobro"    element={<PrivateRoute><CobroNotaVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/:id/recibo"  element={<PrivateRoute><ReciboVenta /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
