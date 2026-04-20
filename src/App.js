import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Perfil from "./pages/Perfil";

// Inventario
import Categorias from "./pages/Categorias/Categorias";
import VerCategoria from "./pages/Categorias/VerCategoria";

// Compras
import NotasCompra from "./pages/compras/NotasCompra";
import VerNotaCompra from "./pages/compras/VerNotaCompra";
import CreateNotaCompra from "./pages/compras/CreateNotaCompra";
import PagoNotaCompra from "./pages/compras/PagoNotaCompra";
import ReciboCompra from "./pages/compras/ReciboCompra";
import Proveedores from "./pages/compras/Proveedores";
import VerProveedor from "./pages/compras/VerProveedor";

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

// Inventario - Productos
import Productos from "./pages/inventario/Productos";
import Almacenes from "./pages/inventario/Almacenes";
import VerAlmacen from "./pages/inventario/VerAlmacen";
import MarcasModelos from "./pages/marca-modelo/MarcasModelos";
import VerProducto from "./pages/inventario/VerProducto";

// Usuarios
import Usuarios from "./pages/usuarios/Usuarios";
import VerUsuario from "./pages/usuarios/VerUsuario";

// Ventas
import Clientes from "./pages/ventas/Clientes";
import VerCliente from "./pages/ventas/VerCliente";
import NotasVenta from "./pages/ventas/NotasVenta";
import VerNotaVenta from "./pages/ventas/VerNotaVenta";
import CreateNotaVenta from "./pages/ventas/CreateNotaVenta";
import CobroNotaVenta from "./pages/ventas/CobroNotaVenta";
import ReciboVenta from "./pages/ventas/ReciboVenta";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        {/* Pública */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        {/* Inventario */}
        <Route path="/inventario/categorias"     element={<PrivateRoute><Categorias /></PrivateRoute>} />
        <Route path="/inventario/categorias/:id" element={<PrivateRoute><VerCategoria /></PrivateRoute>} />
        <Route path="/inventario/productos"         element={<PrivateRoute><Productos /></PrivateRoute>} />
        <Route path="/inventario/productos/:id"     element={<PrivateRoute><VerProducto /></PrivateRoute>} />
        <Route path="/inventario/almacenes"            element={<PrivateRoute><Almacenes /></PrivateRoute>} />
        <Route path="/inventario/almacenes/:id"      element={<PrivateRoute><VerAlmacen /></PrivateRoute>} />
        <Route path="/inventario/marcas"             element={<PrivateRoute><MarcasModelos /></PrivateRoute>} />

        {/* Compras */}
        <Route path="/compras/notas"        element={<PrivateRoute><NotasCompra /></PrivateRoute>} />
        <Route path="/compras/notas/crear"  element={<PrivateRoute><CreateNotaCompra /></PrivateRoute>} />
        <Route path="/compras/notas/:id"      element={<PrivateRoute><VerNotaCompra /></PrivateRoute>} />
        <Route path="/compras/notas/:id/pago"   element={<PrivateRoute><PagoNotaCompra /></PrivateRoute>} />
        <Route path="/compras/notas/:id/recibo"      element={<PrivateRoute><ReciboCompra /></PrivateRoute>} />
        <Route path="/compras/proveedores"            element={<PrivateRoute><Proveedores /></PrivateRoute>} />
        <Route path="/compras/proveedores/:id"        element={<PrivateRoute><VerProveedor /></PrivateRoute>} />

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
        <Route path="/ventas/clientes"     element={<PrivateRoute><Clientes /></PrivateRoute>} />
        <Route path="/ventas/clientes/:id" element={<PrivateRoute><VerCliente /></PrivateRoute>} />
        <Route path="/ventas/notas"             element={<PrivateRoute><NotasVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/crear"       element={<PrivateRoute><CreateNotaVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/:id"         element={<PrivateRoute><VerNotaVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/:id/cobro"    element={<PrivateRoute><CobroNotaVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/:id/recibo"  element={<PrivateRoute><ReciboVenta /></PrivateRoute>} />

        {/* Usuarios */}
        <Route path="/usuarios"     element={<PrivateRoute><Usuarios /></PrivateRoute>} />
        <Route path="/usuarios/:id" element={<PrivateRoute><VerUsuario /></PrivateRoute>} />

        {/* Perfil */}
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
