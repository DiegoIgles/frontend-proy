import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import "../../styles/layout.css";

function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? "" : "hidden"}`}
        onClick={closeSidebar}
      ></div>

      <div className="layout">
        <div className={`sidebar ${isOpen ? "active" : ""}`}>
          <Sidebar />
        </div>

        <div className="main">
          <Header toggleSidebar={toggleSidebar} />

          <div className="content" onClick={closeSidebar}>
            {children}
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default Layout;