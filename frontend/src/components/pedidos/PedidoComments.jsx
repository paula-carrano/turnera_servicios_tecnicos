import CommentForm from './CommentForm.jsx';
import CommentItem from './CommentItem.jsx';

const PedidoComments = ({ comments, comment, busy, error, onChange, onSubmit }) => (
  <section className="comments-section" aria-labelledby="comments-heading">
    <div className="section-title">
      <h3 id="comments-heading">Historial de comentarios</h3>
      <span className="count-pill">{comments.length}</span>
    </div>
    {comments.length ? (
      <ol className="comment-list">
        {comments.map((item) => <CommentItem key={item.id} comment={item} />)}
      </ol>
    ) : (
      <p className="text-secondary small">
        Todavía no hay comentarios. Agregá los avances del servicio para mantener el seguimiento.
      </p>
    )}
    <CommentForm comment={comment} busy={busy} error={error} onChange={onChange} onSubmit={onSubmit} />
  </section>
);

export default PedidoComments;
