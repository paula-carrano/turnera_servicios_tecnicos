import useCreatePedido from '../../hooks/useCreatePedido.js';
import ErrorMessage from '../common/ErrorMessage.jsx';
import Icon from '../common/Icon.jsx';
import Modal from '../common/Modal.jsx';
import PedidoFields from './PedidoFields.jsx';

const CreatePedido = ({ onClose, onCreated }) => {
  const { values, busy, error, changeField, create } = useCreatePedido(onCreated);

  const handleSubmit = (event) => {
    event.preventDefault();
    create();
  };

  return (
    <Modal
      title="Nuevo pedido"
      subtitle="Ingresá los datos para empezar a coordinar el servicio."
      onClose={onClose}
      busy={busy}
    >
      <form onSubmit={handleSubmit}>
        <div className="dialog-body">
          <ErrorMessage message={error} />
          <fieldset disabled={busy}>
            <PedidoFields prefix="new" values={values} onChange={changeField} />
          </fieldset>
          <p className="form-note">
            <Icon name="inbox" size={16} />Se creará como pendiente, sin fecha ni horario.
          </p>
        </div>
        <footer className="dialog-footer">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={busy}>Cancelar</button>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Creando…' : 'Crear pedido'}</button>
        </footer>
      </form>
    </Modal>
  );
};

export default CreatePedido;
