import { useState, useEffect } from 'react';
import { getNotaVentaAction } from '../actions/get-nota-venta.action';

export const useNotaVenta = (id) => {
  const [nota, setNota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    getNotaVentaAction(id)
      .then(setNota)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { nota, loading, error };
};
