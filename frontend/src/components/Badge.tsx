// concursos-web/src/components/Badge.tsx

import styles from "./Badge.module.css";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "accent" | "ok" | "warn";
}

export default function Badge({ children, variant = "default" }: BadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[variant]}`}>
            {children}
        </span>
    );
}