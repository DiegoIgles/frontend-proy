import { useState, useEffect } from 'react';
import { getSaldoVentaAction } from '../actions/get-saldo-venta.action';

export const useSaldoVenta = (id) => {
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    getSaldoVentaAction(id)
      .then(setSaldo)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { saldo, loading, error };
};
