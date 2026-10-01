import { useEffect, useState } from 'react';
import { pedidosService } from '../services/pedidosService.js';

const usePedidos = () => {
  const [tab, setTab] = useState('SIN_ASIGNAR');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    pedidosService.list(tab, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setPedidos(data.pedidos);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message);
          setPedidos([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [tab, revision]);

  const reload = () => setRevision((value) => value + 1);
  const clearNotice = () => setNotice('');

  const refresh = (message) => {
    setNotice(message);
    reload();
  };

  const selectTab = (id) => {
    if (id === tab) return;
    setTab(id);
    setNotice('');
    setError('');
    setPedidos([]);
    setLoading(true);
  };

  return { tab, pedidos, loading, error, notice, selectTab, reload, refresh, clearNotice };
};

export default usePedidos;
