import { useEffect, useState } from 'react';
import { api } from './api.js';
import { blankFields, FIELDS, formatDateTime, slotFields, slotPayload } from './domain.js';
import { ErrorMessage, Icon, Loading, Modal, PedidoFields, StatusBadge } from './components.jsx';

export function CreatePedido({ onClose, onCreated }) {
  const [values, setValues] = useState(blankFields);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      await api.create(values);
      onCreated();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <Modal title="Nuevo pedido" subtitle="Ingresá los datos para empezar a coordinar el servicio." onClose={onClose} busy={busy}>
    <form onSubmit={submit}>
      <div className="dialog-body"><ErrorMessage message={error} /><fieldset disabled={busy}><PedidoFields prefix="new" values={values} onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))} /></fieldset><p className="form-note"><Icon name="inbox" size={16} />Se creará como pendiente, sin fecha ni horario.</p></div>
      <footer className="dialog-footer"><button type="button" className="btn btn-light" onClick={onClose} disabled={busy}>Cancelar</button><button className="btn btn-primary" disabled={busy}>{busy ? 'Creando…' : 'Crear pedido'}</button></footer>
    </form>
  </Modal>;
}

export function PedidoDetail({ id, onClose, onSaved }) {
  const [pedido, setPedido] = useState(null);
  const [values, setValues] = useState(blankFields);
  const [slot, setSlot] = useState({ fecha: '', inicio: '', fin: '' });
  const [estado, setEstado] = useState('PENDIENTE');
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({ autor: '', texto: '' });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [retry, setRetry] = useState(0);

  function populate(data) {
    setPedido(data);
    setValues(Object.fromEntries(FIELDS.map(({ name }) => [name, data[name]])));
    setSlot(slotFields(data)); setEstado(data.estado);
  }
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setLoadError('');
    api.detail(id, controller.signal).then((data) => {
      if (!controller.signal.aborted) { populate(data.pedido); setComments(data.comentarios); }
    }).catch((err) => { if (!controller.signal.aborted) setLoadError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, retry]);

  async function save(event) {
    event.preventDefault(); setError(''); setNotice('');
    try {
      const schedule = slotPayload(slot);
      // Enviar solo cambios evita pisar campos que otro operador actualizó.
      const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) => value !== pedido[key]));
      if (estado !== pedido.estado) changes.estado = estado;
      if (JSON.stringify(slot) !== JSON.stringify(slotFields(pedido))) Object.assign(changes, schedule);
      if (!Object.keys(changes).length) { setNotice('No hay cambios para guardar.'); return; }
      setBusy('save');
      const data = await api.update(id, changes);
      populate(data.pedido); setNotice('Cambios guardados.'); onSaved('Pedido actualizado.');
    } catch (err) { setError(err.message); }
    finally { setBusy(''); }
  }
  async function addComment(event) {
    event.preventDefault(); setCommentError(''); setNotice(''); setBusy('comment');
    try {
      const { comentario } = await api.comment(id, comment);
      setComments((prev) => [...prev, comentario]); setComment((prev) => ({ ...prev, texto: '' }));
      setNotice('Comentario agregado.'); onSaved('Comentario agregado.');
    } catch (err) { setCommentError(err.message); }
    finally { setBusy(''); }
  }
  const slotRequired = Boolean(slot.fecha || slot.inicio || slot.fin);
  return <Modal title="Detalle del pedido" subtitle={pedido ? `Cuenta ${pedido.numero_cuenta} · Creado el ${formatDateTime(pedido.created_at)}` : 'Datos, turno e historial del servicio.'} onClose={onClose} busy={Boolean(busy)}>
    {loading ? <Loading label="Cargando detalle…" /> : loadError ? <div className="dialog-body"><ErrorMessage message={loadError} /><button className="btn btn-outline-secondary" onClick={() => setRetry((value) => value + 1)}>Reintentar</button></div> : <>
      <form onSubmit={save}>
        <div className="dialog-body">
          {notice && <div className="alert alert-success" role="status">{notice}</div>}
          <ErrorMessage message={error} />
          <fieldset disabled={Boolean(busy)}>
            <div className="section-title"><h3>Datos del servicio</h3><StatusBadge pedido={pedido} /></div>
            <PedidoFields prefix="edit" values={values} onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))} />
            <section className="schedule-section" aria-labelledby="schedule-heading">
              <div className="section-title"><h3 id="schedule-heading"><Icon name="calendar" size={19} /> Turno y seguimiento</h3><button type="button" className="btn btn-link btn-sm" onClick={() => setSlot({ fecha: '', inicio: '', fin: '' })} disabled={!slotRequired || Boolean(busy)}>Quitar turno</button></div>
              <div className="row g-3">
                <div className="col-sm-6"><label className="form-label" htmlFor="turno-fecha">Fecha</label><input type="date" className="form-control" id="turno-fecha" min="0001-01-01" max="9999-12-31" required={slotRequired} value={slot.fecha} onChange={(e) => setSlot((prev) => ({ ...prev, fecha: e.target.value }))} /></div>
                <div className="col-6 col-sm-3"><label className="form-label" htmlFor="turno-inicio">Inicio</label><input type="time" className="form-control" id="turno-inicio" required={slotRequired} value={slot.inicio} onChange={(e) => setSlot((prev) => ({ ...prev, inicio: e.target.value }))} /></div>
                <div className="col-6 col-sm-3"><label className="form-label" htmlFor="turno-fin">Fin</label><input type="time" className="form-control" id="turno-fin" required={slotRequired} value={slot.fin} onChange={(e) => setSlot((prev) => ({ ...prev, fin: e.target.value }))} /></div>
                <div className="col-12"><label className="form-label" htmlFor="estado">Estado</label><select className="form-select" id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}><option value="PENDIENTE">PENDIENTE</option><option value="PRUEBA">PRUEBA</option><option value="FINALIZADO">FINALIZADO</option></select></div>
              </div>
              <p className="form-note">Hora de Buenos Aires. Solo los pedidos pendientes reservan la franja; en prueba o finalizados la liberan.</p>
            </section>
          </fieldset>
          <div className="save-row"><button className="btn btn-primary" disabled={Boolean(busy)}>{busy === 'save' ? 'Guardando…' : 'Guardar cambios'}</button></div>
        </div>
      </form>
      <section className="comments-section" aria-labelledby="comments-heading">
        <div className="section-title"><h3 id="comments-heading">Historial de comentarios</h3><span className="count-pill">{comments.length}</span></div>
        {comments.length === 0 ? <p className="text-secondary small">Todavía no hay comentarios. Agregá los avances del servicio para mantener el seguimiento.</p> : <ol className="comment-list">{comments.map((item) => <li key={item.id}><div className="comment-meta"><strong>{item.autor}</strong><time dateTime={item.created_at}>{formatDateTime(item.created_at)}</time></div><p>{item.texto}</p></li>)}</ol>}
        <form onSubmit={addComment}>
          <ErrorMessage message={commentError} />
          <fieldset disabled={Boolean(busy)}>
            <div className="mb-3"><label className="form-label" htmlFor="comment-autor">Tu nombre <span aria-hidden="true">*</span></label><input className="form-control" id="comment-autor" required maxLength={120} placeholder="Nombre de quien comenta" value={comment.autor} onChange={(e) => setComment((prev) => ({ ...prev, autor: e.target.value }))} /></div>
            <div className="mb-3"><label className="form-label" htmlFor="comment-texto">Nuevo comentario <span aria-hidden="true">*</span></label><textarea className="form-control" id="comment-texto" required maxLength={5000} rows={3} placeholder="Registrá una novedad o el resultado de la visita" value={comment.texto} onChange={(e) => setComment((prev) => ({ ...prev, texto: e.target.value }))} /></div>
            <button className="btn btn-outline-primary" disabled={Boolean(busy)}>{busy === 'comment' ? 'Agregando…' : 'Agregar comentario'}</button>
          </fieldset>
        </form>
      </section>
      <footer className="dialog-footer"><button type="button" className="btn btn-light" disabled={Boolean(busy)} onClick={onClose}>Cerrar detalle</button></footer>
    </>}
  </Modal>;
}
