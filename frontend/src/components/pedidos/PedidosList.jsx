import ErrorMessage from '../common/ErrorMessage.jsx';
import Loading from '../common/Loading.jsx';
import EmptyPedidos from './EmptyPedidos.jsx';
import PedidoCard from './PedidoCard.jsx';

const PedidosList = ({ pedidos, loading, error, activeTab, onCreate, onOpen }) => {
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!pedidos.length) return <EmptyPedidos activeTab={activeTab} onCreate={onCreate} />;

  return (
    <div className="row g-4">
      {pedidos.map((pedido) => (
        <div className="col-12 col-md-6 col-xl-4" key={pedido.id}>
          <PedidoCard pedido={pedido} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
};

export default PedidosList;
