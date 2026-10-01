import Icon from '../common/Icon.jsx';

const PedidosToolbar = ({ activeTab, count, loading, error, onRefresh }) => (
  <div className="list-toolbar">
    <div>
      <h2>
        {activeTab.label}
        {!loading && !error && <span className="count-pill">{count}</span>}
      </h2>
      <p>{activeTab.description}</p>
    </div>
    <button className="btn refresh-button" onClick={onRefresh} disabled={loading}>
      <Icon name="refresh" size={16} /> Actualizar
    </button>
  </div>
);

export default PedidosToolbar;
