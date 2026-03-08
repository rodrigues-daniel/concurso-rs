// concursos-web/src/components/Loading.tsx

import styles from "./Loading.module.css";

interface LoadingProps {
    texto?: string;
    full?: boolean;
}

export default function Loading({
    texto = "Carregando...",
    full = false,
}: LoadingProps) {
    return (
        <div className={`${styles.wrapper} ${full ? styles.full : ""}`}>
            <div className={styles.spinner} />
            <span className={styles.texto}>{texto}</span>
        </div>
    );
}