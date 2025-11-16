import type { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  children: ReactNode;
  variant?: "default" | "outlined" | "elevated";
  padding?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  onClick,
}: CardProps) {
  return (
    <div
      className={`card card-${variant} card-padding-${padding} ${className} ${
        onClick ? "card-clickable" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
