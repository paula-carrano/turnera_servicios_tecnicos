const SuccessMessage = ({ message, onDismiss }) => message ? (
  <div className={`alert alert-success${onDismiss ? ' alert-dismissible' : ''}`} role="status">
    {message}
    {onDismiss && (
      <button type="button" className="btn-close" aria-label="Descartar notificación" onClick={onDismiss} />
    )}
  </div>
) : null;

export default SuccessMessage;
