import { useState, useEffect } from 'react';
import { getAjusteAction } from '../actions/get-ajuste.action';

export const useAjuste = (id) => {
  const [ajuste, setAjuste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    getAjusteAction(id)
      .then(setAjuste)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { ajuste, loading, error };
};
