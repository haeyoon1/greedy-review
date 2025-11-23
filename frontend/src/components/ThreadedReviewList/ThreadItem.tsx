import type { ReviewThread } from "../../types/review";
import ReviewComment from "./ReviewComment";
import "./ThreadItem.css";

interface ThreadItemProps {
  thread: ReviewThread;
  onToggle: (threadId: number) => void;
  keyword?: string;
}

export default function ThreadItem({
  thread,
  onToggle,
  keyword,
}: ThreadItemProps) {
  const { main_comment, replies, reply_count, thread_id, is_expanded } = thread;

  return (
    <div className="thread-item">
      <div className="main-comment-wrapper">
        <ReviewComment comment={main_comment} keyword={keyword} isMain={true} />
      </div>

      {reply_count > 0 && (
        <>
          <button
            className={`reply-toggle ${is_expanded ? "expanded" : ""}`}
            onClick={() => onToggle(thread_id)}
            aria-expanded={is_expanded}
          >
            <span className="toggle-icon">{is_expanded ? "▼" : "▶"}</span>
            <span className="toggle-text">
              {is_expanded ? "댓글 접기" : `댓글 ${reply_count}개 더 보기`}
            </span>
          </button>

          {is_expanded && (
            <div className="replies-container">
              {replies.map((reply) => (
                <div key={reply.comment_id} className="reply-wrapper">
                  <ReviewComment
                    comment={reply}
                    keyword={keyword}
                    isMain={false}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
