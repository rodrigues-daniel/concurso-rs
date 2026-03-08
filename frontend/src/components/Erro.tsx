// concursos-web/src/components/Erro.tsx

import styles from "./Erro.module.css";

interface ErroProps {
    mensagem: string;
    onRetry?: () => void;
}

export default function Erro({ mensagem, onRetry }: ErroProps) {
    return (
        <div className={styles.wrapper}>
            <span className={styles.icon}>⚠</span>
            <div className={styles.body}>
                <p className={styles.msg}>{mensagem}</p>
                {onRetry && (
                    <button className={styles.btn} onClick={onRetry}>
                        Tentar novamente
                    </button>
                )}
            </div>
        </div>
    );
}