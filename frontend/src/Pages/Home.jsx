import { useState } from 'react';
import { TABS } from '../constants/pedidos.js';
import usePedidos from '../hooks/usePedidos.js';
import SuccessMessage from '../components/common/SuccessMessage.jsx';
import AppFooter from '../components/layout/AppFooter.jsx';
import CreatePedido from '../components/pedidos/CreatePedido.jsx';
import PedidoDetail from '../components/pedidos/PedidoDetail.jsx';
import PedidosHeading from '../components/pedidos/PedidosHeading.jsx';
import PedidosList from '../components/pedidos/PedidosList.jsx';
import PedidosTabs from '../components/pedidos/PedidosTabs.jsx';
import PedidosToolbar from '../components/pedidos/PedidosToolbar.jsx';

const Home = () => {
  const { tab, pedidos, loading, error, notice, selectTab, reload, refresh, clearNotice } = usePedidos();
  const [modal, setModal] = useState(null);
  const activeTab = TABS.find((item) => item.id === tab);

  const openCreate = () => {
    clearNotice();
    setModal({ type: 'create' });
  };

  const openDetail = (id) => setModal({ type: 'detail', id });
  const closeModal = () => setModal(null);

  const handleCreated = () => {
    closeModal();
    selectTab('SIN_ASIGNAR');
    refresh('Pedido creado. Ya podés asignarle un turno.');
  };

  return (
    <>
      <main id="main" className="app-container">
        <PedidosHeading onCreate={openCreate} />
        <div className="workspace">
          <PedidosTabs tab={tab} onSelect={selectTab} />
          <section id="pedidos-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
            <PedidosToolbar
              activeTab={activeTab}
              count={pedidos.length}
              loading={loading}
              error={error}
              onRefresh={reload}
            />
            <SuccessMessage message={notice} onDismiss={clearNotice} />
            <PedidosList
              pedidos={pedidos}
              loading={loading}
              error={error}
              activeTab={activeTab}
              onCreate={openCreate}
              onOpen={openDetail}
            />
          </section>
        </div>
        <AppFooter />
      </main>
      {modal?.type === 'create' && <CreatePedido onClose={closeModal} onCreated={handleCreated} />}
      {modal?.type === 'detail' && (
        <PedidoDetail key={modal.id} id={modal.id} onClose={closeModal} onSaved={refresh} />
      )}
    </>
  );
};

export default Home;
