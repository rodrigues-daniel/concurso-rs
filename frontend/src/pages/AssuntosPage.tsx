// concursos-web/src/pages/AssuntosPage.tsx

import { getAssuntos } from "../api/assuntos";
import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import Loading from "../components/Loading";
import Erro from "../components/Erro";
import styles from "./ListaPage.module.css";

export default function AssuntosPage() {
    const { data: assuntos, carregando, erro } = useFetch(getAssuntos);

    if (carregando) return <Loading full />;
    if (erro) return <Erro mensagem={erro} />;

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <p className={styles.eyebrow}>Conteúdo</p>
                    <h1 className={styles.titulo}>Assuntos</h1>
                </div>
                <span className={styles.total}>{assuntos?.length ?? 0} registros</span>
            </header>

            <div className={styles.lista}>
                {assuntos?.map((a, i) => (
                    <Card
                        key={a.id}
                        className={styles.item}
                        style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
                    >
                        <div className={styles.itemIcon}>◎</div>
                        <div className={styles.itemBody}>
                            <h3 className={styles.itemTitle}>{a.nome}</h3>
                            {a.descricao && (
                                <p className={styles.itemDesc}>{a.descricao}</p>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}