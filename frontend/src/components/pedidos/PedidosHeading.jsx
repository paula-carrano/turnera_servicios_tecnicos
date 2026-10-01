import Icon from '../common/Icon.jsx';

const PedidosHeading = ({ onCreate }) => (
  <section className="page-heading">
    <div>
      <p className="eyebrow">ORGANIZÁ CADA VISITA</p>
      <h1>Pedidos de servicio</h1>
      <p>Coordiná los turnos y acompañá cada pedido hasta su resolución.</p>
    </div>
    <button className="btn btn-primary new-button" onClick={onCreate}>
      <Icon name="plus" size={19} /> Nuevo pedido
    </button>
  </section>
);

export default PedidosHeading;
