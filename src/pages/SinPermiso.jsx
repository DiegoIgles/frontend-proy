import React from "react";
import PaginaEstado from "../components/PaginaEstado";

// Sesión válida pero rol insuficiente. Se distingue del 404 para que el
// usuario sepa que la dirección existe y que lo que falta es permiso.
function SinPermiso() {
  return (
    <PaginaEstado
      codigo="403"
      titulo="Este circuito no es de tu área"
      mensaje="Tu usuario no tiene permiso para entrar a esta sección. Si crees que deberías tenerlo, pídele a un administrador que revise tu rol."
      mostrarRuta
    />
  );
}

export default SinPermiso;
