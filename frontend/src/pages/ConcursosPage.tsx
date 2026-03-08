// concursos-web/src/pages/ConcursosPage.tsx

import { useState } from "react";
import { getConcursos } from "../api/concursos";
import { getBancas } from "../api/bancas";
import { useFetch } from "../hooks/useFetch";
import Card from "../components/Card";
import Loading from "../components/Loading";
import Erro from "../components/Erro";
import Badge from "../components/Badge";
import styles from "./ListaPage.module.css";

export default function ConcursosPage() {
    const [bancaId, setBancaId] = useState<number | undefined>();

    const { data: bancas } = useFetch(getBancas);
    const { data: concursos, carregando, erro } = useFetch(
        () => getConcursos(bancaId),
        [bancaId]
    );

    const bancasMap = Object.fromEntries(
        (bancas ?? []).map((b) => [b.id, b.nome])
    );

    if (carregando) return <Loading full />;
    if (erro) return <Erro mensagem={erro} />;

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <p className={styles.eyebrow}>Editais</p>
                    <h1 className={styles.titulo}>Concursos</h1>
                </div>
                <span className={styles.total}>{concursos?.length ?? 0} registros</span>
            </header>

            <div className={styles.filtros}>
                <label className={styles.filtroLabel}>Banca</label>
                <select
                    className={styles.select}
                    value={bancaId ?? ""}
                    onChange={(e) =>
                        setBancaId(e.target.value ? Number(e.target.value) : undefined)
                    }
                >
                    <option value="">Todas as bancas</option>
                    {bancas?.map((b) => (
                        <option key={b.id} value={b.id}>{b.nome}</option>
                    ))}
                </select>
            </div>

            <div className={styles.lista}>
                {concursos?.map((c, i) => (
                    <Card
                        key={c.id}
                        className={styles.item}
                        style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
                    >
                        <div className={styles.itemIcon}>◉</div>
                        <div className={styles.itemBody}>
                            <div className={styles.itemRow}>
                                <h3 className={styles.itemTitle}>{c.nome}</h3>
                                <div className={styles.itemBadges}>
                                    {c.ano && <Badge variant="accent">{c.ano}</Badge>}
                                    {c.banca_id && bancasMap[c.banca_id] && (
                                        <Badge>{bancasMap[c.banca_id]}</Badge>
                                    )}
                                </div>
                            </div>
                            {c.orgao && <p className={styles.itemDesc}>{c.orgao}</p>}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}