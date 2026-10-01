import { formatDateTime } from '../../utils/dateTime.js';

const CommentItem = ({ comment }) => (
  <li>
    <div className="comment-meta">
      <strong>{comment.autor}</strong>
      <time dateTime={comment.created_at}>{formatDateTime(comment.created_at)}</time>
    </div>
    <p>{comment.texto}</p>
  </li>
);

export default CommentItem;
