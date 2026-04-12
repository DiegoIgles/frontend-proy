import { useState, useEffect } from 'react';
import { getSaldoCompraAction } from '../actions/get-saldo-compra.action';

export const useSaldoCompra = (id) => {
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    getSaldoCompraAction(id)
      .then(setSaldo)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { saldo, loading, error };
};
