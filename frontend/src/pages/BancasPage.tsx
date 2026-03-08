// concursos-web/src/pages/BancasPage.tsx

import { getBancas } from "../api/bancas";
import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import Loading from "../components/Loading";
import Erro from "../components/Erro";
import styles from "./ListaPage.module.css";

export default function BancasPage() {
    const { data: bancas, carregando, erro } = useFetch(getBancas);

    if (carregando) return <Loading full />;
    if (erro) return <Erro mensagem={erro} />;

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <p className={styles.eyebrow}>Organizadoras</p>
                    <h1 className={styles.titulo}>Bancas</h1>
                </div>
                <span className={styles.total}>{bancas?.length ?? 0} registros</span>
            </header>

            <div className={styles.lista}>
                {bancas?.map((b, i) => (
                    <Card
                        key={b.id}
                        className={styles.item}
                        style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
                    >
                        <div className={styles.itemIcon}>◈</div>
                        <div className={styles.itemBody}>
                            <h3 className={styles.itemTitle}>{b.nome}</h3>
                            {b.descricao && (
                                <p className={styles.itemDesc}>{b.descricao}</p>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}