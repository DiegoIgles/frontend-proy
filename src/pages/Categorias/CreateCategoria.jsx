import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router-dom";

function CreateCategoria() {
  const [nombre, setNombre] = useState("");
  const [categoriaPadreId, setCategoriaPadreId] = useState("");
  const [categorias, setCategorias] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/inventario/categorias",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/inventario/categorias",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre,
            categoriaPadreId: categoriaPadreId || null,
          }),
        }
      );

      if (response.ok) {
        alert("Categoría creada correctamente");
        navigate("/categorias");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error al crear");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
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

          <button type="submit" className="btn-primary">
            Guardar
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default CreateCategoria;