import { useEffect, useRef, useState } from 'react';
import { api } from './api.js';
import { TABS } from './domain.js';
import { ErrorMessage, Icon, Loading, PedidoCard } from './components.jsx';
import { CreatePedido, PedidoDetail } from './PedidoForms.jsx';

export default function App() {
  const [tab, setTab] = useState('SIN_ASIGNAR');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [revision, setRevision] = useState(0);
  const [modal, setModal] = useState(null);
  const tabRefs = useRef([]);
  const activeTab = TABS.find((item) => item.id === tab);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    api.list(tab, controller.signal).then((data) => { if (!controller.signal.aborted) setPedidos(data.pedidos); })
      .catch((err) => { if (!controller.signal.aborted) { setError(err.message); setPedidos([]); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [tab, revision]);

  function refresh(message) {
    setNotice(message); setRevision((value) => value + 1);
  }
  function selectTab(id) {
    if (id === tab) return;
    setTab(id); setNotice(''); setError(''); setPedidos([]); setLoading(true);
  }
  function tabKey(event, index) {
    const target = event.key === 'ArrowRight' ? (index + 1) % TABS.length : event.key === 'ArrowLeft' ? (index + TABS.length - 1) % TABS.length : event.key === 'Home' ? 0 : event.key === 'End' ? TABS.length - 1 : null;
    if (target !== null) { event.preventDefault(); selectTab(TABS[target].id); tabRefs.current[target].focus(); }
  }
  return <>
    <a className="skip-link" href="#main">Ir a los pedidos</a>
    <header className="app-header"><div className="app-container header-inner"><a className="brand" href="./" aria-label="Turnera, inicio"><span className="brand-symbol"><Icon name="calendar" size={24} /></span><span>turnera<span className="brand-dot">.</span><small>Servicios técnicos</small></span></a><div className="header-label"><span className="live-dot" /> Gestión de servicios</div></div></header>
    <main id="main" className="app-container">
      <section className="page-heading"><div><p className="eyebrow">ORGANIZÁ CADA VISITA</p><h1>Pedidos de servicio</h1><p>Coordiná los turnos y acompañá cada pedido hasta su resolución.</p></div><button className="btn btn-primary new-button" onClick={() => { setNotice(''); setModal({ type: 'create' }); }}><Icon name="plus" size={19} /> Nuevo pedido</button></section>
      <div className="workspace">
        <div className="tabs-row"><div className="nav nav-tabs" role="tablist" aria-label="Estado de los pedidos">{TABS.map((item, index) => <button key={item.id} ref={(element) => { tabRefs.current[index] = element; }} className={`nav-link ${tab === item.id ? 'active' : ''}`} id={`tab-${item.id}`} role="tab" aria-selected={tab === item.id} aria-controls="pedidos-panel" tabIndex={tab === item.id ? 0 : -1} onKeyDown={(e) => tabKey(e, index)} onClick={() => { if (tab !== item.id) selectTab(item.id); }}><Icon name={item.icon} size={18} />{item.label}</button>)}</div></div>
        <section id="pedidos-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
          <div className="list-toolbar"><div><h2>{activeTab.label} {!loading && !error && <span className="count-pill">{pedidos.length}</span>}</h2><p>{activeTab.description}</p></div><button className="btn refresh-button" onClick={() => setRevision((value) => value + 1)} disabled={loading}><Icon name="refresh" size={16} /> Actualizar</button></div>
          {notice && <div className="alert alert-success alert-dismissible" role="status">{notice}<button className="btn-close" aria-label="Descartar notificación" onClick={() => setNotice('')} /></div>}
          <ErrorMessage message={error} />
          {loading ? <Loading /> : !error && (pedidos.length ? <div className="row g-4">{pedidos.map((pedido) => <div className="col-12 col-md-6 col-xl-4" key={pedido.id}><PedidoCard pedido={pedido} onOpen={(id) => setModal({ type: 'detail', id })} /></div>)}</div> : <div className="empty-state"><div className="empty-icon"><Icon name={activeTab.icon} size={32} /></div><h3>{activeTab.empty}</h3><p>{activeTab.hint}</p>{tab === 'SIN_ASIGNAR' && <button className="btn btn-outline-primary" onClick={() => setModal({ type: 'create' })}><Icon name="plus" size={17} /> Crear primer pedido</button>}</div>)}
        </section>
      </div>
      <footer className="page-footer"><span>Un lugar para cada pedido. Un paso más cerca de resolverlo.</span><span><Icon name="clock" size={14} /> Horarios de Buenos Aires</span></footer>
    </main>
    {modal?.type === 'create' && <CreatePedido onClose={() => setModal(null)} onCreated={() => { setModal(null); setTab('SIN_ASIGNAR'); refresh('Pedido creado. Ya podés asignarle un turno.'); }} />}
    {modal?.type === 'detail' && <PedidoDetail key={modal.id} id={modal.id} onClose={() => setModal(null)} onSaved={refresh} />}
  </>;
}
