import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { getCategoriasAction } from "./actions/get-categorias.action";
import { deleteCategoriaAction } from "./actions/delete-categoria.action";
import { FaPlus, FaTrash } from "react-icons/fa";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoriasAction()
      .then(setCategorias)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar esta categoría?");
    if (!confirmDelete) return;

    try {
      await deleteCategoriaAction(id);
      setCategorias((prev) => prev.filter((cat) => cat.categoriaId !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Error al eliminar");
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Categorías</h1>
        <Link to="/categorias/crear" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus /> Nueva Categoría
        </Link>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Subcategorías</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((cat) => (
                <tr key={cat.categoriaId}>
                  <td>{cat.nombre}</td>
                  <td>
                    {cat.subcategorias.length > 0 ? (
                      <ul>
                        {cat.subcategorias.map((sub) => (
                          <li key={sub.categoriaId}>{sub.nombre}</li>
                        ))}
                      </ul>
                    ) : (
                      "Sin subcategorías"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(cat.categoriaId)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export default Categorias;
