import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

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
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Seguro que deseas eliminar esta categoría?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/inventario/categorias/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                // 🔥 actualizar lista sin recargar
                setCategorias((prev) =>
                    prev.filter((cat) => cat.categoriaId !== id)
                );
            } else {
                alert("Error al eliminar");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };
    return (
        <Layout>
            <div className="page-header">
                <h1>Categorías</h1>

                <Link to="/categorias/crear" className="btn-primary">
                    Nueva Categoría
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
                                <th>Acciones</th> {/* 🔥 */}
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
                                        >
                                            Eliminar
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