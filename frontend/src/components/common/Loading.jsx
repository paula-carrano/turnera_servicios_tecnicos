const Loading = ({ label = 'Cargando pedidos…' }) => (
  <div className="loading-state" role="status">
    <span className="spinner-border spinner-border-sm" aria-hidden="true" />
    {label}
  </div>
);

export default Loading;
