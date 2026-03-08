// concursos-web/src/pages/QuestoesPage.tsx

import { useState } from "react";
import { getQuestoes, validarResposta } from "../api/questoes";
import { getConcursos } from "../api/concursos";
import { getAssuntos } from "../api/assuntos";
import { useFetch } from "../hooks/useFetch";
import type { Questao } from "../types";
import Card from "../components/Card";
import Loading from "../components/Loading";
import Erro from "../components/Erro";
import Badge from "../components/Badge";
import styles from "./QuestoesPage.module.css";

type Feedback = { correta: boolean; alternativaCorreta: string } | null;

export default function QuestoesPage() {
    const [concursoId, setConcursoId] = useState<number | undefined>();
    const [assuntoId, setAssuntoId] = useState<number | undefined>();
    const [indice, setIndice] = useState(0);
    const [selecionada, setSelecionada] = useState<string>("");
    const [feedback, setFeedback] = useState<Feedback>(null);
    const [acertos, setAcertos] = useState(0);
    const [respondidas, setRespondidas] = useState(0);
    const [respondendo, setRespondendo] = useState(false);

    const { data: concursos } = useFetch(getConcursos);
    const { data: assuntos } = useFetch(getAssuntos);

    const { data: questoes, carregando, erro } = useFetch(
        () => getQuestoes(concursoId, assuntoId),
        [concursoId, assuntoId]
    );

    const assuntosMap = Object.fromEntries(
        (assuntos ?? []).map((a) => [a.id, a.nome])
    );

    const total = questoes?.length ?? 0;
    const questaoAtual = questoes?.[indice] ?? null;
    const concluido = indice >= total && total > 0;
    const percentual = total > 0 ? (acertos / total) * 100 : 0;

    const handleFiltro = () => {
        setIndice(0);
        setFeedback(null);
        setSelecionada("");
        setAcertos(0);
        setRespondidas(0);
    };

    const handleResponder = async () => {
        if (!selecionada || !questaoAtual) return;
        setRespondendo(true);
        try {
            const res = await validarResposta(questaoAtual.id, selecionada);
            setRespondidas((n) => n + 1);
            if (res.correta) setAcertos((n) => n + 1);
            setFeedback({ correta: res.correta, alternativaCorreta: res.alternativa_correta });
        } finally {
            setRespondendo(false);
        }
    };

    const handleProxima = () => {
        setIndice((i) => i + 1);
        setSelecionada("");
        setFeedback(null);
    };

    const handleReiniciar = () => {
        setIndice(0);
        setSelecionada("");
        setFeedback(null);
        setAcertos(0);
        setRespondidas(0);
    };

    const alternativas: [string, string | null][] = questaoAtual
        ? [
            ["A", questaoAtual.alternativa_a],
            ["B", questaoAtual.alternativa_b],
            ["C", questaoAtual.alternativa_c],
            ["D", questaoAtual.alternativa_d],
            ["E", questaoAtual.alternativa_e],
        ]
        : [];

    return (
        <div className={styles.page}>

            {/* Header */}
            <header className={styles.pageHeader}>
                <div>
                    <p className={styles.eyebrow}>Simulado</p>
                    <h1 className={styles.titulo}>Questões</h1>
                </div>
            </header>

            {/* Filtros */}
            <div className={styles.filtros}>
                <select
                    className={styles.select}
                    value={concursoId ?? ""}
                    onChange={(e) => {
                        setConcursoId(e.target.value ? Number(e.target.value) : undefined);
                        handleFiltro();
                    }}
                >
                    <option value="">Todos os concursos</option>
                    {concursos?.map((c) => (
                        <option key={c.id} value={c.id}>{c.nome} ({c.ano})</option>
                    ))}
                </select>

                <select
                    className={styles.select}
                    value={assuntoId ?? ""}
                    onChange={(e) => {
                        setAssuntoId(e.target.value ? Number(e.target.value) : undefined);
                        handleFiltro();
                    }}
                >
                    <option value="">Todos os assuntos</option>
                    {assuntos?.map((a) => (
                        <option key={a.id} value={a.id}>{a.nome}</option>
                    ))}
                </select>
            </div>

            {/* Placar */}
            {total > 0 && !concluido && (
                <div className={styles.placar}>
                    <div className={styles.placarInfo}>
                        <span className={styles.placarLabel}>Progresso</span>
                        <span className={styles.placarValor}>{indice}/{total}</span>
                    </div>
                    <div className={styles.placarInfo}>
                        <span className={styles.placarLabel}>Acertos</span>
                        <span className={styles.placarValor}>{acertos}</span>
                    </div>
                    <div className={styles.placarInfo}>
                        <span className={styles.placarLabel}>Respondidas</span>
                        <span className={styles.placarValor}>{respondidas}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${(indice / total) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Conteúdo */}
            {carregando ? (
                <Loading full />
            ) : erro ? (
                <Erro mensagem={erro} />
            ) : total === 0 ? (
                <Erro mensagem="Nenhuma questão encontrada para os filtros selecionados." />
            ) : concluido ? (
                <ResultadoFinal
                    acertos={acertos}
                    total={total}
                    percentual={percentual}
                    onReiniciar={handleReiniciar}
                />
            ) : questaoAtual ? (
                <QuestaoCard
                    questao={questaoAtual}
                    indice={indice}
                    total={total}
                    alternativas={alternativas}
                    selecionada={selecionada}
                    feedback={feedback}
                    respondendo={respondendo}
                    assuntosMap={assuntosMap}
                    onSelecionar={setSelecionada}
                    onResponder={handleResponder}
                    onProxima={handleProxima}
                />
            ) : null}
        </div>
    );
}

/* ── Sub-componente: QuestaoCard ─────────────────────── */

interface QuestaoCardProps {
    questao: Questao;
    indice: number;
    total: number;
    alternativas: [string, string | null][];
    selecionada: string;
    feedback: Feedback;
    respondendo: boolean;
    assuntosMap: Record<number, string>;
    onSelecionar: (l: string) => void;
    onResponder: () => void;
    onProxima: () => void;
}

function QuestaoCard({
    questao, indice, total, alternativas,
    selecionada, feedback, respondendo, assuntosMap,
    onSelecionar, onResponder, onProxima,
}: QuestaoCardProps) {
    return (
        <Card className={styles.questaoCard}>

            <div className={styles.questaoMeta}>
                <span className={styles.questaoNum}>
                    {indice + 1} <span>/ {total}</span>
                </span>
                {questao.assunto_id && assuntosMap[questao.assunto_id] && (
                    <Badge variant="accent">
                        {assuntosMap[questao.assunto_id]}
                    </Badge>
                )}
            </div>

            <p className={styles.enunciado}>{questao.enunciado}</p>

            <div className={styles.alternativas}>
                {alternativas.map(([letra, texto]) =>
                    texto ? (
                        <button
                            key={letra}
                            disabled={!!feedback}
                            onClick={() => onSelecionar(letra)}
                            className={[
                                styles.alternativa,
                                selecionada === letra && !feedback ? styles.altSelecionada : "",
                                feedback && letra === feedback.alternativaCorreta ? styles.altCorreta : "",
                                feedback && selecionada === letra && !feedback.correta ? styles.altErrada : "",
                            ].join(" ")}
                        >
                            <span className={styles.altLetra}>{letra}</span>
                            <span className={styles.altTexto}>{texto}</span>
                        </button>
                    ) : null
                )}
            </div>

            {feedback && (
                <div className={`${styles.feedback} ${feedback.correta ? styles.feedbackOk : styles.feedbackErr}`}>
                    {feedback.correta
                        ? "✓ Resposta correta! Muito bem!"
                        : `✗ Resposta incorreta. A alternativa correta era a ${feedback.alternativaCorreta}.`}
                </div>
            )}

            <div className={styles.botoes}>
                {!feedback ? (
                    <button
                        className={styles.btnPrimario}
                        onClick={onResponder}
                        disabled={!selecionada || respondendo}
                    >
                        {respondendo ? "Verificando..." : "Confirmar resposta"}
                    </button>
                ) : (
                    <button className={styles.btnPrimario} onClick={onProxima}>
                        {indice + 1 < total ? "Próxima questão →" : "Ver resultado →"}
                    </button>
                )}
            </div>

        </Card>
    );
}

/* ── Sub-componente: ResultadoFinal ──────────────────── */

interface ResultadoFinalProps {
    acertos: number;
    total: number;
    percentual: number;
    onReiniciar: () => void;
}

function ResultadoFinal({ acertos, total, percentual, onReiniciar }: ResultadoFinalProps) {
    const nivel =
        percentual >= 80 ? { emoji: "🏆", txt: "Excelente!", cor: "var(--ok)" }
            : percentual >= 60 ? { emoji: "👍", txt: "Bom resultado!", cor: "var(--accent)" }
                : { emoji: "📚", txt: "Continue estudando!", cor: "var(--warn)" };

    return (
        <Card className={styles.resultado}>
            <div className={styles.resultadoEmoji}>{nivel.emoji}</div>
            <h2 className={styles.resultadoTitulo}>{nivel.txt}</h2>
            <p className={styles.resultadoDesc}>
                Você acertou <strong>{acertos}</strong> de <strong>{total}</strong> questões
            </p>

            <div className={styles.resultadoCirculo}>
                <svg viewBox="0 0 120 120" className={styles.circulo}>
                    <circle cx="60" cy="60" r="50"
                        fill="none" stroke="var(--surface-soft)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50"
                        fill="none"
                        stroke={nivel.cor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentual / 100)}`}
                        transform="rotate(-90 60 60)"
                        style={{ transition: "stroke-dashoffset 1s var(--ease)" }}
                    />
                </svg>
                <div className={styles.circuloTexto}>
                    <span className={styles.circuloValor} style={{ color: nivel.cor }}>
                        {percentual.toFixed(0)}%
                    </span>
                    <span className={styles.circuloLabel}>aproveitamento</span>
                </div>
            </div>

            <button className={styles.btnPrimario} onClick={onReiniciar}>
                Refazer simulado
            </button>
        </Card>
    );
}