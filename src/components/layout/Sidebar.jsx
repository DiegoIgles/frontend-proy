import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SOLO_ADMIN, ADMIN_VENDEDOR, ADMIN_BODEGA, tieneRol } from "../../auth/roles";
import logoBlanco from "../../assets/brand/enerlogic_v2_transparent.png";

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
  FaFileContract,
  FaUserCog,
  FaHistory,
  FaBell,
  FaAddressBook,
  FaChevronDown,
} from "react-icons/fa";

let _navScroll = 0;

// `roles` en una sección o en un ítem lo esconde a quien no tenga alguno;
// sin `roles` lo ve cualquier usuario con sesión. Debe coincidir con las
// restricciones de las rutas en App.js.
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
    roles: SOLO_ADMIN,
    items: [
      { to: "/usuarios", label: "Gestión de Usuarios", icon: <FaUserCog /> },
    ],
  },
  {
    title: "PROYECTOS",
    items: [
      { to: "/proyectos", label: "Gestión de Proyectos", icon: <FaProjectDiagram /> },
      { to: "/cotizaciones-manuales", label: "Cotizaciones Manuales", icon: <FaFileContract />, roles: ADMIN_VENDEDOR },
    ],
  },
  {
    title: "FINANZAS",
    items: [
      { to: "/finanzas/caja",               label: "Caja",               icon: <FaReceipt />,            roles: SOLO_ADMIN },
      { to: "/finanzas/cuentas-por-cobrar", label: "Cuentas por Cobrar", icon: <FaFileInvoiceDollar />, roles: ADMIN_VENDEDOR },
      { to: "/finanzas/cuentas-por-pagar",  label: "Cuentas por Pagar",  icon: <FaMoneyBillWave />,     roles: SOLO_ADMIN },
    ],
  },
  {
    title: "INVENTARIO",
    items: [
      { to: "/inventario/categorias", label: "Categorías",       icon: <FaTags /> },
      { to: "/inventario/productos",  label: "Productos",        icon: <FaBoxOpen /> },
      { to: "/inventario/marcas",     label: "Marcas / Modelos", icon: <FaTrademark /> },
      { to: "/inventario/almacenes",  label: "Almacenes",        icon: <FaWarehouse /> },
      { to: "/ajustes",               label: "Ajustes de Stock", icon: <FaSlidersH />, roles: ADMIN_BODEGA },
    ],
  },
  {
    title: "COMPRAS & VENTAS",
    items: [
      { to: "/compras/notas",       label: "Notas de Compra",  icon: <FaShoppingCart />, roles: ADMIN_BODEGA },
      { to: "/compras/proveedores", label: "Proveedores",      icon: <FaTruck />,        roles: ADMIN_BODEGA },
      { to: "/ventas/notas",        label: "Notas de Venta",   icon: <FaShoppingBag />,  roles: ADMIN_VENDEDOR },
      { to: "/ventas/clientes",     label: "Clientes",         icon: <FaUsers />,        roles: ADMIN_VENDEDOR },
      { to: "/leads",               label: "Gestión de Leads", icon: <FaAddressBook />,  roles: ADMIN_VENDEDOR },
    ],
  },
  {
    title: "AUDITORÍA",
    roles: SOLO_ADMIN,
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

  // Filtra secciones e ítems por rol; una sección que queda vacía desaparece.
  const menu = MENU
    .filter((section) => tieneRol(user, section.roles))
    .map((section) => ({ ...section, items: section.items.filter((item) => tieneRol(user, item.roles)) }))
    .filter((section) => section.items.length > 0);

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
          {/* Wordmark blanco: es la única versión que lee sobre el navy. */}
          <img src={logoBlanco} alt="Enerlogic — Energía Inteligente" className="sidebar-logo-img" />
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
