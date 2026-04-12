import { useState, useEffect } from 'react';
import { getNotaCompraAction } from '../actions/get-nota-compra.action';

export const useNotaCompra = (id) => {
  const [nota, setNota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    getNotaCompraAction(id)
      .then(setNota)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { nota, loading, error };
};
