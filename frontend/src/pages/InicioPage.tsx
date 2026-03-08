// concursos-web/src/pages/InicioPage.tsx

import { Link } from "react-router-dom";
import Card from "../components/Card";
import styles from "./InicioPage.module.css";

const atalhos = [
    {
        to: "/bancas",
        icon: "◈",
        label: "Bancas",
        desc: "Veja as organizadoras",
        cor: "#2D5BE3",
        corBg: "#EBF0FD",
    },
    {
        to: "/concursos",
        icon: "◉",
        label: "Concursos",
        desc: "Explore os editais",
        cor: "#0D7A4E",
        corBg: "#E6F7F1",
    },
    {
        to: "/assuntos",
        icon: "◎",
        label: "Assuntos",
        desc: "Organize seus estudos",
        cor: "#B45309",
        corBg: "#FEF3C7",
    },
    {
        to: "/questoes",
        icon: "◐",
        label: "Questões",
        desc: "Inicie um simulado",
        cor: "#7C3AED",
        corBg: "#F3EFFE",
    },
];

const stats = [
    { valor: "1", label: "Banca" },
    { valor: "1", label: "Concurso" },
    { valor: "4", label: "Assuntos" },
    { valor: "4+", label: "Questões" },
];

export default function InicioPage() {
    return (
        <div className={styles.page}>

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroEyebrow}>Plataforma de Estudos</div>
                <h1 className={styles.heroTitle}>
                    Prepare-se para<br />
                    <span className={styles.heroAccent}>concursos públicos</span>
                </h1>
                <p className={styles.heroDesc}>
                    Estude com questões reais, filtre por banca e assunto e
                    acompanhe seu desempenho em tempo real.
                </p>
                <Link to="/questoes" className={styles.heroCta}>
                    Começar simulado agora →
                </Link>
            </section>

            {/* Stats */}
            <section className={styles.statsRow}>
                {stats.map((s) => (
                    <div key={s.label} className={styles.statItem}>
                        <span className={styles.statValor}>{s.valor}</span>
                        <span className={styles.statLabel}>{s.label}</span>
                    </div>
                ))}
            </section>

            {/* Atalhos */}
            <section>
                <h2 className={styles.secTitle}>Navegar por seção</h2>
                <div className={styles.grid}>
                    {atalhos.map((a, i) => (
                        <Link to={a.to} key={a.to} className={styles.atalhoLink}
                            style={{ animationDelay: `${i * 60}ms` }}>
                            <Card hover className={styles.atalhoCard}>
                                <div
                                    className={styles.atalhoIconWrap}
                                    style={{ background: a.corBg, color: a.cor }}
                                >
                                    {a.icon}
                                </div>
                                <div>
                                    <p className={styles.atalhoLabel}>{a.label}</p>
                                    <p className={styles.atalhoDesc}>{a.desc}</p>
                                </div>
                                <span className={styles.atalhoArrow} style={{ color: a.cor }}>→</span>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Dica */}
            <div className={styles.dica}>
                <span className={styles.dicaIcon}>💡</span>
                <p>
                    <strong>Dica:</strong> Use os filtros na tela de Questões para praticar
                    por banca ou assunto específico e maximize sua preparação.
                </p>
            </div>

        </div>
    );
}