import { useState, useEffect } from 'react';
import { getNotasVentaAction } from '../actions/get-notas-venta.action';

export const useNotasVenta = () => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getNotasVentaAction()
      .then(setNotas)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { notas, setNotas, loading, error };
};
