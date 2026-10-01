import { useEffect, useRef } from 'react';
import { FIELDS, formatDateTime, formatSlot, mapsUrl, statusLabel } from './domain.js';

export function Icon({ name, size = 20, ...props }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2" /></>,
    inbox: <><path d="m4 4-2 11v5h20v-5L20 4Z" /><path d="M2 15h6l2 3h4l2-3h6" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
    tool: <><path d="m14 6 4 4 3-3a7 7 0 0 1-9 9l-5 5-4-4 5-5a7 7 0 0 1 9-9Z" /></>,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6 7a7 7 0 0 1 12-2l2 3M4 16l2 3a7 7 0 0 0 12-2" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
    external: <><path d="M14 3h7v7M10 14 21 3M10 3H4v17h17v-6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.calendar}</svg>;
}

export function ErrorMessage({ message }) {
  return message ? <div className="alert alert-danger" role="alert">{message}</div> : null;
}
export function Loading({ label = 'Cargando pedidos…' }) {
  return <div className="loading-state" role="status"><span className="spinner-border spinner-border-sm" aria-hidden="true" />{label}</div>;
}
export function MapLink({ address, compact = false }) {
  return <a className="map-link" href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${address} en Google Maps (nueva pestaña)`}>{compact ? 'Ver mapa' : 'Google Maps'} <Icon name="external" size={13} /></a>;
}
export function StatusBadge({ pedido }) {
  return <span className={`status-badge status-${pedido.estado.toLowerCase()} ${pedido.turno_inicio ? 'has-slot' : ''}`}><span />{statusLabel(pedido)}</span>;
}
export function PedidoCard({ pedido, onOpen }) {
  return <article className="pedido-card card h-100">
    <div className="card-body">
      <div className="card-top"><span className="account">CUENTA <strong>{pedido.numero_cuenta}</strong></span><StatusBadge pedido={pedido} /></div>
      <h3>{pedido.titular}</h3>
      <div className="address"><Icon name="pin" size={17} /><span>{pedido.direccion} <MapLink address={pedido.direccion} compact /></span></div>
      <p className="reason">{pedido.motivo}</p>
      <div className={`slot-preview ${pedido.turno_inicio ? 'scheduled' : ''}`}><Icon name="calendar" size={18} /><span>{formatSlot(pedido)}</span></div>
      <div className="card-meta"><Icon name="user" size={14} /><span>{pedido.operador}</span><span className="created">{formatDateTime(pedido.created_at)}</span></div>
    </div>
    <div className="card-footer"><button className="open-detail" onClick={() => onOpen(pedido.id)} aria-label={`Ver pedido de ${pedido.titular}`}>Ver pedido <Icon name="arrow" size={17} /></button></div>
  </article>;
}

export function PedidoFields({ values, onChange, prefix }) {
  return <div className="row g-3">{FIELDS.map((field) => <div className={field.wide ? 'col-12' : 'col-sm-6'} key={field.name}>
    <div className="field-label"><label className="form-label" htmlFor={`${prefix}-${field.name}`}>{field.label} <span aria-hidden="true">*</span></label>{field.name === 'direccion' && values.direccion.trim() && <MapLink address={values.direccion} />}</div>
    {field.multiline
      ? <textarea className="form-control" id={`${prefix}-${field.name}`} required maxLength={field.max} rows={3} value={values[field.name]} placeholder={field.placeholder} onChange={(e) => onChange(field.name, e.target.value)} />
      : <input className="form-control" id={`${prefix}-${field.name}`} required maxLength={field.max} value={values[field.name]} placeholder={field.placeholder} onChange={(e) => onChange(field.name, e.target.value)} />}
  </div>)}</div>;
}

export function Modal({ title, subtitle, onClose, busy, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={ref} className="pedido-dialog" aria-labelledby="dialog-title" onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}>
    <header className="dialog-header"><div><p className="eyebrow">SERVICIOS TÉCNICOS</p><h2 id="dialog-title">{title}</h2><p>{subtitle}</p></div><button type="button" className="icon-button" aria-label="Cerrar" onClick={onClose} disabled={busy}><Icon name="close" /></button></header>
    {children}
  </dialog>;
}
