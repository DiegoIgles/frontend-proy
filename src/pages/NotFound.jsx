import React from "react";
import PaginaEstado from "../components/PaginaEstado";

// El chiste es de la casa: Enerlogic vende sistemas On Grid y Off Grid, así
// que una página desconectada de la red es "Off Grid". Cae bien sin explicar.
function NotFound() {
  return (
    <PaginaEstado
      codigo="404"
      titulo="Esta página quedó Off Grid"
      mensaje="No hay nada conectado a esta dirección. Puede que el enlace esté viejo, que la página se haya movido o que se haya colado una letra de más al escribirla."
      mostrarRuta
    />
  );
}

export default NotFound;
