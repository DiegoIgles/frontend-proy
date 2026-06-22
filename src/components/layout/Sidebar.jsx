import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  FaHistory,
  FaBell,
  FaAddressBook,
  FaChevronDown,
} from "react-icons/fa";

let _navScroll = 0;

const MENU = [
  {
    title: "GENERAL",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
      { to: "/notificaciones", label: "Notificaciones", icon: <FaBell /> },
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
      { to: "/leads",               label: "Gestión de Leads", icon: <FaAddressBook /> },
    ],
  },
  {
    title: "AUDITORÍA",
    roles: ["admin", "super-user"],
    items: [
      { to: "/bitacora", label: "Bitácora", icon: <FaHistory /> },
    ],
  },
];

function Sidebar({ onNavigate }) {
  const location = useLocation();
  const navRef   = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (navRef.current) navRef.current.scrollTop = _navScroll;
  }, []);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleClick = () => {
    if (window.innerWidth < 768 && onNavigate) onNavigate();
  };

  const menu = MENU.filter(
    (section) => !section.roles || section.roles.some((r) => user?.roles?.includes(r))
  );

  // Por defecto, abre únicamente el grupo que contiene la ruta activa.
  const [openSections, setOpenSections] = useState(() => {
    const initial = {};
    menu.forEach((section) => {
      if (section.items.length > 1 && section.items.some((item) => isActive(item.to))) {
        initial[section.title] = true;
      }
    });
    return initial;
  });

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
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
            <h2>Enerlogic</h2>
            <span>Sistema de gestión</span>
          </div>
        </div>
      </div>

      {/* Nav scrolleable */}
      <nav ref={navRef} className="menu sidebar-nav" onScroll={(e) => { _navScroll = e.currentTarget.scrollTop; }}>
        {menu.map((section) => {
          // Grupos de un solo ítem se muestran como enlace directo, sin desplegable.
          if (section.items.length === 1) {
            const item = section.items[0];
            return (
              <Link
                key={item.to}
                to={item.to}
                className={isActive(item.to) ? "active" : ""}
                onClick={handleClick}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          }

          const isOpen = !!openSections[section.title];
          return (
            <div key={section.title} className="menu-group">
              <button
                type="button"
                className="menu-group-header"
                aria-expanded={isOpen}
                onClick={() => toggleSection(section.title)}
              >
                <span>{section.title}</span>
                <FaChevronDown className={`menu-chevron ${isOpen ? "open" : ""}`} />
              </button>
              <div className={`menu-group-items ${isOpen ? "open" : ""}`}>
                <div>
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
              </div>
            </div>
          );
        })}
      </nav>
    </>
  );
}

export default Sidebar;
