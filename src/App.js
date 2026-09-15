import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import "./styles/feedback.css";
import Website from "./website/Website";
import Login from "./pages/Login";
import FloatingChatbot from "./components/FloatingChatbot";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { SOLO_ADMIN, ADMIN_VENDEDOR, ADMIN_BODEGA } from "./auth/roles";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

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

// Cotizaciones Manuales
import CotizacionesManuales from "./pages/cotizaciones-manuales/CotizacionesManuales";
import CotizacionManualForm from "./pages/cotizaciones-manuales/CotizacionManualForm";
import CotizacionManualPrint from "./pages/cotizaciones-manuales/CotizacionManualPrint";
// Cotizaciones Técnicas
import CotizacionesTecnicas from "./pages/cotizaciones-tecnicas/CotizacionesTecnicas";
import CotizacionTecnicaForm from "./pages/cotizaciones-tecnicas/CotizacionTecnicaForm";
import CotizacionTecnicaVer from "./pages/cotizaciones-tecnicas/CotizacionTecnicaVer";

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

// Bitácora
import Bitacora from "./pages/bitacora/Bitacora";

// Notificaciones
import Notificaciones from "./pages/notificaciones/Notificaciones";

// Leads
import Leads from "./pages/leads/Leads";
import VerLead from "./pages/leads/VerLead";

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
      <ToastProvider>
      <ConfirmProvider>
      <AuthProvider>
      <Routes>
        {/* Públicas: la raíz del dominio es el website de EnerLogic; el
            acceso al sistema de gestión queda en /login.
            El chatbot va como hermano del website y no adentro: es un
            componente del sistema (usa sus variables de theme.css) y dentro
            de `.enerlogic-site` el reset y las variables del website lo
            desarmarían. Al ser position: fixed se ve igual. */}
        <Route path="/"      element={<><Website /><FloatingChatbot /></>} />
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas. `roles` restringe por rol (ver src/auth/roles.js);
            sin `roles` basta con tener sesión. Inventario y proyectos quedan
            abiertos a todos los roles porque vendedor/bodega los consultan;
            los botones de escritura se esconden dentro de cada página. */}
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
        <Route path="/compras/notas"        element={<PrivateRoute roles={ADMIN_BODEGA}><NotasCompra /></PrivateRoute>} />
        <Route path="/compras/notas/crear"  element={<PrivateRoute roles={ADMIN_BODEGA}><CreateNotaCompra /></PrivateRoute>} />
        <Route path="/compras/notas/:id"      element={<PrivateRoute roles={ADMIN_BODEGA}><VerNotaCompra /></PrivateRoute>} />
        <Route path="/compras/notas/:id/pago"   element={<PrivateRoute roles={ADMIN_BODEGA}><PagoNotaCompra /></PrivateRoute>} />
        <Route path="/compras/notas/:id/recibo"      element={<PrivateRoute roles={ADMIN_BODEGA}><ReciboCompra /></PrivateRoute>} />
        <Route path="/compras/proveedores"            element={<PrivateRoute roles={ADMIN_BODEGA}><Proveedores /></PrivateRoute>} />
        <Route path="/compras/proveedores/:id"        element={<PrivateRoute roles={ADMIN_BODEGA}><VerProveedor /></PrivateRoute>} />

        {/* Finanzas */}
        <Route path="/finanzas/caja"                          element={<PrivateRoute roles={SOLO_ADMIN}><Caja /></PrivateRoute>} />
        <Route path="/finanzas/cuentas-por-cobrar"            element={<PrivateRoute roles={ADMIN_VENDEDOR}><CuentasCobrar /></PrivateRoute>} />
        <Route path="/finanzas/cuentas-por-cobrar/:id"        element={<PrivateRoute roles={ADMIN_VENDEDOR}><VerCuentaCobrar /></PrivateRoute>} />
        <Route path="/finanzas/cuentas-por-pagar"             element={<PrivateRoute roles={SOLO_ADMIN}><CuentasPagar /></PrivateRoute>} />
        <Route path="/finanzas/cuentas-por-pagar/:id"         element={<PrivateRoute roles={SOLO_ADMIN}><VerCuentaPagar /></PrivateRoute>} />

        {/* Proyectos */}
        <Route path="/proyectos"        element={<PrivateRoute><Proyectos /></PrivateRoute>} />
        <Route path="/proyectos/crear"  element={<PrivateRoute roles={ADMIN_VENDEDOR}><CreateProyecto /></PrivateRoute>} />
        <Route path="/proyectos/:id"            element={<PrivateRoute><VerProyecto /></PrivateRoute>} />
        <Route path="/proyectos/:id/cotizacion" element={<PrivateRoute><CotizacionProyecto /></PrivateRoute>} />

        {/* Cotizaciones Manuales */}
        <Route path="/cotizaciones-manuales"               element={<PrivateRoute roles={ADMIN_VENDEDOR}><CotizacionesManuales /></PrivateRoute>} />
        <Route path="/cotizaciones-manuales/crear"         element={<PrivateRoute roles={ADMIN_VENDEDOR}><CotizacionManualForm /></PrivateRoute>} />
        <Route path="/cotizaciones-manuales/:id/editar"    element={<PrivateRoute roles={ADMIN_VENDEDOR}><CotizacionManualForm /></PrivateRoute>} />
        <Route path="/cotizaciones-manuales/:id/imprimir"  element={<PrivateRoute roles={ADMIN_VENDEDOR}><CotizacionManualPrint /></PrivateRoute>} />

        {/* Cotizaciones Técnicas */}
        <Route path="/cotizaciones-tecnicas"               element={<PrivateRoute roles={ADMIN_VENDEDOR}><CotizacionesTecnicas /></PrivateRoute>} />
        <Route path="/cotizaciones-tecnicas/:id/editar"    element={<PrivateRoute roles={ADMIN_VENDEDOR}><CotizacionTecnicaForm /></PrivateRoute>} />
        <Route path="/cotizaciones-tecnicas/:id/ver"       element={<PrivateRoute roles={ADMIN_VENDEDOR}><CotizacionTecnicaVer /></PrivateRoute>} />

        {/* Ajustes */}
        <Route path="/ajustes"        element={<PrivateRoute roles={ADMIN_BODEGA}><Ajustes /></PrivateRoute>} />
        <Route path="/ajustes/crear"  element={<PrivateRoute roles={ADMIN_BODEGA}><CreateAjuste /></PrivateRoute>} />
        <Route path="/ajustes/:id"    element={<PrivateRoute roles={ADMIN_BODEGA}><VerAjuste /></PrivateRoute>} />

        {/* Ventas */}
        <Route path="/ventas/clientes"     element={<PrivateRoute roles={ADMIN_VENDEDOR}><Clientes /></PrivateRoute>} />
        <Route path="/ventas/clientes/:id" element={<PrivateRoute roles={ADMIN_VENDEDOR}><VerCliente /></PrivateRoute>} />
        <Route path="/ventas/notas"             element={<PrivateRoute roles={ADMIN_VENDEDOR}><NotasVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/crear"       element={<PrivateRoute roles={ADMIN_VENDEDOR}><CreateNotaVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/:id"         element={<PrivateRoute roles={ADMIN_VENDEDOR}><VerNotaVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/:id/cobro"    element={<PrivateRoute roles={ADMIN_VENDEDOR}><CobroNotaVenta /></PrivateRoute>} />
        <Route path="/ventas/notas/:id/recibo"  element={<PrivateRoute roles={ADMIN_VENDEDOR}><ReciboVenta /></PrivateRoute>} />

        {/* Usuarios */}
        <Route path="/usuarios"     element={<PrivateRoute roles={SOLO_ADMIN}><Usuarios /></PrivateRoute>} />
        <Route path="/usuarios/:id" element={<PrivateRoute roles={SOLO_ADMIN}><VerUsuario /></PrivateRoute>} />

        {/* Bitácora */}
        <Route path="/bitacora" element={<PrivateRoute roles={SOLO_ADMIN}><Bitacora /></PrivateRoute>} />

        {/* Notificaciones */}
        <Route path="/notificaciones" element={<PrivateRoute><Notificaciones /></PrivateRoute>} />

        {/* Leads */}
        <Route path="/leads"     element={<PrivateRoute roles={ADMIN_VENDEDOR}><Leads /></PrivateRoute>} />
        <Route path="/leads/:id" element={<PrivateRoute roles={ADMIN_VENDEDOR}><VerLead /></PrivateRoute>} />

        {/* Perfil */}
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />

        {/* 404 — cualquier ruta que no matchee arriba. Va al final y sin
            PrivateRoute: si la dirección no existe, da igual si hay sesión, y
            rebotar al login esconde el error real. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </AuthProvider>
      </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
