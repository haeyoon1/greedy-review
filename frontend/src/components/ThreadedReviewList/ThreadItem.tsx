import { useState } from "react";
import type { ReviewThread } from "../../types/review";
import ReviewComment from "./ReviewComment";
import "./ThreadItem.css";

interface ThreadItemProps {
  thread: ReviewThread;
  onToggle: (threadId: number) => void;
  keyword?: string;
}

/**
 * 📌 ThreadItem 컴포넌트
 *
 * 하나의 스레드(thread)를 표시합니다.
 * - 메인 댓글 (항상 표시)
 * - 답글 개수 표시
 * - "댓글 X개 더 보기" / "접기" 토글 버튼
 * - 전개 시 답글 목록 표시
 *
 * Props:
 * - thread: 스레드 데이터
 * - onToggle: 전개/접기 토글 콜백
 * - keyword: 하이라이트할 키워드 (선택사항)
 */
export default function ThreadItem({
  thread,
  onToggle,
  keyword,
}: ThreadItemProps) {
  const { main_comment, replies, reply_count, thread_id, is_expanded } = thread;

  return (
    <div className="thread-item">
      {/* 메인 댓글 (항상 표시) */}
      <div className="main-comment-wrapper">
        <ReviewComment comment={main_comment} keyword={keyword} isMain={true} />
      </div>

      {/* 답글이 있으면 토글 버튼 표시 */}
      {reply_count > 0 && (
        <>
          {/* 토글 버튼 */}
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

          {/* 답글 목록 (전개 시에만 표시) */}
          {is_expanded && (
            <div className="replies-container">
              {replies.map((reply, idx) => (
                <div key={idx} className="reply-wrapper">
                  <ReviewComment comment={reply} keyword={keyword} isMain={false} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
