
import React from "react";
import clsx from "clsx";

interface BadgeProps {
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  className,
  children,
}) => {
  const badgeStyles = clsx(
    "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",
    variant === "primary" ? "bg-blue-600 text-white" : "bg-gray-300 text-black",
    className
  );

  return <span className={badgeStyles}>{children}</span>;
};
