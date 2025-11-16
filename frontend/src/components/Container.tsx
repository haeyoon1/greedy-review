import type { ReactNode } from "react";
import "./Container.css";

interface ContainerProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export default function Container({
  children,
  maxWidth = "lg",
  className = "",
}: ContainerProps) {
  return (
    <div className={`container container-${maxWidth} ${className}`}>
      {children}
    </div>
  );
}
