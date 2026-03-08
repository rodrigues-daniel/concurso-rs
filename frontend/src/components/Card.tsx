// concursos-web/src/components/Card.tsx

import styles from "./Card.module.css";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
}

export default function Card({
    children,
    className = "",
    onClick,
    hover = false,
}: CardProps) {
    return (
        <div
            className={`${styles.card} ${hover ? styles.cardHover : ""} ${className}`}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {children}
        </div>
    );
}