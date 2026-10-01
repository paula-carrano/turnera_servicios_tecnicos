import { useState } from 'react';
import { pedidosService } from '../services/pedidosService.js';
import { blankFields } from '../utils/pedidos.js';

const useCreatePedido = (onCreated) => {
  const [values, setValues] = useState(blankFields);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const changeField = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const create = async () => {
    setBusy(true);
    setError('');
    try {
      await pedidosService.create(values);
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return { values, busy, error, changeField, create };
};

export default useCreatePedido;
