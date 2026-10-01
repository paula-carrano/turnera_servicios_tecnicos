import { useId } from 'react';
import useDialog from '../../hooks/useDialog.js';
import Icon from './Icon.jsx';

const Modal = ({ title, subtitle, onClose, busy, children }) => {
  const ref = useDialog();
  const titleId = useId();

  const handleCancel = (event) => {
    event.preventDefault();
    if (!busy) onClose();
  };

  return (
    <dialog ref={ref} className="pedido-dialog" aria-labelledby={titleId} onCancel={handleCancel}>
      <header className="dialog-header">
        <div>
          <p className="eyebrow">SERVICIOS TÉCNICOS</p>
          <h2 id={titleId}>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <button type="button" className="icon-button" aria-label="Cerrar" onClick={onClose} disabled={busy}>
          <Icon name="close" />
        </button>
      </header>
      {children}
    </dialog>
  );
};

export default Modal;
