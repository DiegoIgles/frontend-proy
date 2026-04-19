import { useState, useEffect } from 'react';
import { getAjustesAction } from '../actions/get-ajustes.action';

export const useAjustes = () => {
  const [ajustes, setAjustes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAjustesAction()
      .then(setAjustes)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { ajustes, setAjustes, loading, error };
};
