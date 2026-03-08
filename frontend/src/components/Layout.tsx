// concursos-web/src/components/Layout.tsx

import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

const nav = [
    { to: "/inicio", icon: "⌂", label: "Início" },
    { to: "/bancas", icon: "◈", label: "Bancas" },
    { to: "/concursos", icon: "◉", label: "Concursos" },
    { to: "/assuntos", icon: "◎", label: "Assuntos" },
    { to: "/questoes", icon: "◐", label: "Questões" },
];

export default function Layout() {
    const [aberto, setAberto] = useState(false);

    return (
        <div className={styles.shell}>
            {/* Overlay mobile */}
            {aberto && (
                <div className={styles.overlay} onClick={() => setAberto(false)} />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${aberto ? styles.sidebarOpen : ""}`}>
                <div className={styles.brand}>
                    <span className={styles.brandIcon}>◈</span>
                    <span className={styles.brandText}>Concursos</span>
                </div>

                <nav className={styles.nav}>
                    <p className={styles.navLabel}>Menu</p>
                    {nav.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setAberto(false)}
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
                            }
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <span>v1.0.0</span>
                </div>
            </aside>

            {/* Conteúdo */}
            <div className={styles.wrapper}>
                {/* Topbar mobile */}
                <header className={styles.topbar}>
                    <button
                        className={styles.menuBtn}
                        onClick={() => setAberto(!aberto)}
                        aria-label="Menu"
                    >
                        <span /><span /><span />
                    </button>
                    <span className={styles.topbarTitle}>Concursos</span>
                </header>

                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}