import { useState, useEffect } from 'react';
import { getProveedoresAction } from '../actions/get-proveedores.action';

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProveedoresAction({ limit: 200 })
      .then((res) => setProveedores(Array.isArray(res) ? res : (res.data ?? [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { proveedores, loading };
};
