import Icon from '../common/Icon.jsx';

const EmptyPedidos = ({ activeTab, onCreate }) => (
  <div className="empty-state">
    <div className="empty-icon"><Icon name={activeTab.icon} size={32} /></div>
    <h3>{activeTab.empty}</h3>
    <p>{activeTab.hint}</p>
    {activeTab.id === 'SIN_ASIGNAR' && (
      <button className="btn btn-outline-primary" onClick={onCreate}>
        <Icon name="plus" size={17} /> Crear primer pedido
      </button>
    )}
  </div>
);

export default EmptyPedidos;
