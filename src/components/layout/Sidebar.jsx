import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTags,
  FaBoxOpen,
  FaTrademark,
  FaWarehouse,
  FaShoppingCart,
  FaTruck,
  FaMoneyBillWave,
  FaShoppingBag,
  FaUsers,
  FaFileInvoiceDollar,
  FaProjectDiagram,
  FaSlidersH,
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
    title: "INVENTARIO",
    items: [
      { to: "/inventario/categorias",  label: "Categorías",     icon: <FaTags /> },
      { to: "/inventario/productos",   label: "Productos",      icon: <FaBoxOpen /> },
      { to: "/inventario/marcas",      label: "Marcas / Modelos", icon: <FaTrademark /> },
      { to: "/inventario/almacenes",   label: "Almacenes",      icon: <FaWarehouse /> },
    ],
  },
  {
    title: "COMPRAS",
    items: [
      { to: "/compras/notas",        label: "Notas de Compra",    icon: <FaShoppingCart /> },
      { to: "/compras/proveedores",  label: "Proveedores",        icon: <FaTruck /> },
      { to: "/compras/cuentas-pagar", label: "Cuentas por Pagar", icon: <FaMoneyBillWave /> },
    ],
  },
  {
    title: "VENTAS",
    items: [
      { to: "/ventas/notas",           label: "Notas de Venta",     icon: <FaShoppingBag /> },
      { to: "/ventas/clientes",        label: "Clientes",           icon: <FaUsers /> },
      { to: "/ventas/cuentas-cobrar",  label: "Cuentas por Cobrar", icon: <FaFileInvoiceDollar /> },
    ],
  },
  {
    title: "PROYECTOS",
    items: [
      { to: "/proyectos", label: "Gestión de Proyectos", icon: <FaProjectDiagram /> },
    ],
  },
  {
    title: "AJUSTES DE STOCK",
    items: [
      { to: "/ajustes", label: "Ajustes de Stock", icon: <FaSlidersH /> },
    ],
  },
  {
    title: "USUARIOS",
    items: [
      { to: "/usuarios", label: "Gestión de Usuarios", icon: <FaUserCog /> },
    ],
  },
];

function Sidebar({ onNavigate }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleClick = () => {
    if (window.innerWidth < 768 && onNavigate) onNavigate();
  };

  return (
    <div className="sidebar-content">
      <h2 className="logo">Mi ERP</h2>

      <nav className="menu">
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
    </div>
  );
}

export default Sidebar;
