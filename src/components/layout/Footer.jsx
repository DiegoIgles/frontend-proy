import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <small>
        © {new Date().getFullYear()} <strong>Enerlogic S.R.L.</strong> · Sistema de gestión
      </small>
    </footer>
  );
}

export default Footer;
