import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTags,
  FaBoxOpen,
  FaTrademark,
  FaWarehouse,
  FaSlidersH,
  FaShoppingCart,
  FaTruck,
  FaShoppingBag,
  FaUsers,
  FaReceipt,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaProjectDiagram,
  FaUserCog,
} from "react-icons/fa";

const MENU = [
  {
    title: "GENERAL",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    ],
  },
  {
    title: "USUARIOS",
    items: [
      { to: "/usuarios", label: "Gestión de Usuarios", icon: <FaUserCog /> },
    ],
  },
  {
    title: "PROYECTOS",
    items: [
      { to: "/proyectos", label: "Gestión de Proyectos", icon: <FaProjectDiagram /> },
    ],
  },
  {
    title: "FINANZAS",
    items: [
      { to: "/finanzas/caja",               label: "Caja",               icon: <FaReceipt /> },
      { to: "/finanzas/cuentas-por-cobrar", label: "Cuentas por Cobrar", icon: <FaFileInvoiceDollar /> },
      { to: "/finanzas/cuentas-por-pagar",  label: "Cuentas por Pagar",  icon: <FaMoneyBillWave /> },
    ],
  },
  {
    title: "INVENTARIO",
    items: [
      { to: "/inventario/categorias", label: "Categorías",       icon: <FaTags /> },
      { to: "/inventario/productos",  label: "Productos",        icon: <FaBoxOpen /> },
      { to: "/inventario/marcas",     label: "Marcas / Modelos", icon: <FaTrademark /> },
      { to: "/inventario/almacenes",  label: "Almacenes",        icon: <FaWarehouse /> },
      { to: "/ajustes",               label: "Ajustes de Stock", icon: <FaSlidersH /> },
    ],
  },
  {
    title: "COMPRAS & VENTAS",
    items: [
      { to: "/compras/notas",       label: "Notas de Compra", icon: <FaShoppingCart /> },
      { to: "/compras/proveedores", label: "Proveedores",     icon: <FaTruck /> },
      { to: "/ventas/notas",        label: "Notas de Venta",  icon: <FaShoppingBag /> },
      { to: "/ventas/clientes",     label: "Clientes",        icon: <FaUsers /> },
    ],
  },
];

function Sidebar({ onNavigate }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleClick = () => {
    if (window.innerWidth < 768 && onNavigate) onNavigate();
  };

  return (
    <>
      {/* Cabecera fija */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img
            src="https://picsum.photos/seed/erp/42/42"
            alt="Logo empresa"
            className="sidebar-logo-img"
          />
          <div className="sidebar-logo-text">
            <h2>Mi ERP</h2>
            <span>Sistema de gestión</span>
          </div>
        </div>
      </div>

      {/* Nav scrolleable */}
      <nav className="menu sidebar-nav">
        {MENU.map((section) => (
          <div key={section.title}>
            <p className="menu-title">{section.title}</p>
            {section.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={isActive(item.to) ? "active" : ""}
                onClick={handleClick}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </>
  );
}

export default Sidebar;
