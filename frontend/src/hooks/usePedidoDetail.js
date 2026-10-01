import { useCallback, useEffect, useState } from 'react';
import { pedidosService } from '../services/pedidosService.js';
import { emptySlot, slotFields } from '../utils/dateTime.js';
import { blankFields, pedidoFields, pedidoChanges } from '../utils/pedidos.js';

const usePedidoDetail = (id, onSaved) => {
  const [pedido, setPedido] = useState(null);
  const [values, setValues] = useState(blankFields);
  const [slot, setSlot] = useState(emptySlot);
  const [estado, setEstado] = useState('PENDIENTE');
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({ autor: '', texto: '' });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [revision, setRevision] = useState(0);

  const populate = useCallback((data) => {
    setPedido(data);
    setValues(pedidoFields(data));
    setSlot(slotFields(data));
    setEstado(data.estado);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError('');

    pedidosService.detail(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          populate(data.pedido);
          setComments(data.comentarios);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) setLoadError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id, revision, populate]);

  const changeField = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));
  const changeSlot = (key, value) => setSlot((prev) => ({ ...prev, [key]: value }));
  const clearSlot = () => setSlot(emptySlot());
  const changeComment = (key, value) => setComment((prev) => ({ ...prev, [key]: value }));
  const retry = () => setRevision((value) => value + 1);

  const save = async () => {
    setError('');
    setNotice('');
    try {
      const changes = pedidoChanges(pedido, values, estado, slot);
      if (!Object.keys(changes).length) {
        setNotice('No hay cambios para guardar.');
        return;
      }
      setBusy('save');
      const data = await pedidosService.update(id, changes);
      populate(data.pedido);
      setNotice('Cambios guardados.');
      onSaved('Pedido actualizado.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const addComment = async () => {
    setCommentError('');
    setNotice('');
    setBusy('comment');
    try {
      const { comentario } = await pedidosService.comment(id, comment);
      setComments((prev) => [...prev, comentario]);
      setComment((prev) => ({ ...prev, texto: '' }));
      setNotice('Comentario agregado.');
      onSaved('Comentario agregado.');
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setBusy('');
    }
  };

  return {
    pedido, values, slot, estado, comments, comment,
    loading, loadError, error, commentError, notice, busy,
    changeField, changeSlot, clearSlot, changeComment, changeEstado: setEstado,
    retry, save, addComment,
  };
};

export default usePedidoDetail;
