import { useNavigate } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export default function Header({ title, showBackButton = false }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {showBackButton && (
            <button
              className="back-button"
              onClick={() => navigate(-1)}
              aria-label="뒤로 가기"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="header-brand" onClick={() => navigate("/")}>
            <div className="header-logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="var(--color-primary)" />
                <path
                  d="M12 16L15 19L20 14"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="header-title">{title || "Greedy Review"}</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
