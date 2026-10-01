import ErrorMessage from '../common/ErrorMessage.jsx';

const CommentForm = ({ comment, busy, error, onChange, onSubmit }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorMessage message={error} />
      <fieldset disabled={Boolean(busy)}>
        <div className="mb-3">
          <label className="form-label" htmlFor="comment-autor">Tu nombre <span aria-hidden="true">*</span></label>
          <input
            className="form-control"
            id="comment-autor"
            required
            maxLength={120}
            placeholder="Nombre de quien comenta"
            value={comment.autor}
            onChange={(event) => onChange('autor', event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="comment-texto">Nuevo comentario <span aria-hidden="true">*</span></label>
          <textarea
            className="form-control"
            id="comment-texto"
            required
            maxLength={5000}
            rows={3}
            placeholder="Registrá una novedad o el resultado de la visita"
            value={comment.texto}
            onChange={(event) => onChange('texto', event.target.value)}
          />
        </div>
        <button className="btn btn-outline-primary" disabled={Boolean(busy)}>
          {busy === 'comment' ? 'Agregando…' : 'Agregar comentario'}
        </button>
      </fieldset>
    </form>
  );
};

export default CommentForm;
