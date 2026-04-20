import { useState, useEffect } from 'react';
import { getClientesAction } from '../actions/get-clientes.action';

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClientesAction({ limit: 200 })
      .then((res) => setClientes(Array.isArray(res) ? res : (res.data ?? [])))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { clientes, loading, error };
};
