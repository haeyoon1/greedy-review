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
              <img src="/favicon.png" alt="Greedy Review Logo" width="32" height="32" />
            </div>
            <h1 className="header-title">{title || "Greedy Review"}</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
