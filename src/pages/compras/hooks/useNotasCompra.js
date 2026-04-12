import { useState, useEffect } from 'react';
import { getNotasCompraAction } from '../actions/get-notas-compra.action';

export const useNotasCompra = () => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getNotasCompraAction()
      .then(setNotas)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { notas, setNotas, loading, error };
};
