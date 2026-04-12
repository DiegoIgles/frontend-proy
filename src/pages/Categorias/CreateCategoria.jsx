import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { useNavigate, Link } from "react-router-dom";
import { getCategoriasAction } from "./actions/get-categorias.action";
import { createCategoriaAction } from "./actions/create-categoria.action";
import { FaSave, FaTimes } from "react-icons/fa";

function CreateCategoria() {
  const [nombre, setNombre] = useState("");
  const [categoriaPadreId, setCategoriaPadreId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategoriasAction().then(setCategorias).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategoriaAction({
        nombre,
        categoriaPadreId: categoriaPadreId || null,
      });
      alert("Categoría creada correctamente");
      navigate("/categorias");
    } catch (error) {
      alert(error.response?.data?.message || "Error al crear");
    }
  };

  return (
    <Layout>
      <h1>Crear Categoría</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría Padre</label>
            <select
              value={categoriaPadreId}
              onChange={(e) => setCategoriaPadreId(e.target.value)}
            >
              <option value="">Sin categoría padre</option>
              {categorias.map((cat) => (
                <option key={cat.categoriaId} value={cat.categoriaId}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Link to="/inventario/categorias" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaTimes /> Cancelar
            </Link>
            <button type="submit" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaSave /> Guardar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default CreateCategoria;
