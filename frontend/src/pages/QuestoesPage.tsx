// concursos-web/src/pages/QuestoesPage.tsx
// ALTERAÇÃO COMPLETA: lógica Certo/Errado, justificativa, visual CEBRASPE

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

type Feedback = {
    correta: boolean;
    gabarito: boolean;
    justificativa: string | null;
} | null;

export default function QuestoesPage() {
    const [concursoId, setConcursoId] = useState<number | undefined>();
    const [assuntoId, setAssuntoId] = useState<number | undefined>();
    const [indice, setIndice] = useState(0);
    const [selecionada, setSelecionada] = useState<boolean | null>(null);
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

    const resetFiltro = () => {
        setIndice(0);
        setFeedback(null);
        setSelecionada(null);
        setAcertos(0);
        setRespondidas(0);
    };

    const handleResponder = async () => {
        if (selecionada === null || !questaoAtual) return;
        setRespondendo(true);
        try {
            const res = await validarResposta(questaoAtual.id, selecionada);
            setRespondidas((n) => n + 1);
            if (res.correta) setAcertos((n) => n + 1);
            setFeedback({
                correta: res.correta,
                gabarito: res.gabarito,
                justificativa: res.justificativa,
            });
        } finally {
            setRespondendo(false);
        }
    };

    const handleProxima = () => {
        setIndice((i) => i + 1);
        setSelecionada(null);
        setFeedback(null);
    };

    const handleReiniciar = () => {
        setIndice(0);
        setSelecionada(null);
        setFeedback(null);
        setAcertos(0);
        setRespondidas(0);
    };

    return (
        <div className={styles.page}>

            {/* Header */}
            <header className={styles.pageHeader}>
                <div>
                    <p className={styles.eyebrow}>CEBRASPE — Certo ou Errado</p>
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
                        resetFiltro();
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
                        resetFiltro();
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

            {/* Conteúdo principal */}
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

/* ── QuestaoCard ─────────────────────────────────────── */

interface QuestaoCardProps {
    questao: Questao;
    indice: number;
    total: number;
    selecionada: boolean | null;
    feedback: Feedback;
    respondendo: boolean;
    assuntosMap: Record<number, string>;
    onSelecionar: (v: boolean) => void;
    onResponder: () => void;
    onProxima: () => void;
}

function QuestaoCard({
    questao, indice, total, selecionada, feedback,
    respondendo, assuntosMap, onSelecionar, onResponder, onProxima,
}: QuestaoCardProps) {

    const getBotaoClass = (valor: boolean) => {
        const base = valor ? styles.btnCerto : styles.btnErrado;

        if (!feedback) {
            return `${base} ${selecionada === valor ? styles.btnSelecionado : ""}`;
        }

        // após responder: destacar gabarito e erro
        if (valor === feedback.gabarito) return `${base} ${styles.btnGabarito}`;
        if (selecionada === valor && !feedback.correta) return `${base} ${styles.btnErrouEscolha}`;
        return `${base} ${styles.btnInativo}`;
    };

    return (
        <Card className={styles.questaoCard}>

            {/* Meta */}
            <div className={styles.questaoMeta}>
                <span className={styles.questaoNum}>
                    {indice + 1} <span>/ {total}</span>
                </span>
                {questao.assunto_id && assuntosMap[questao.assunto_id] && (
                    <Badge variant="accent">{assuntosMap[questao.assunto_id]}</Badge>
                )}
                <Badge>CEBRASPE</Badge>
            </div>

            {/* Instrução */}
            <p className={styles.instrucao}>
                Julgue o item a seguir como <strong>Certo</strong> ou <strong>Errado</strong>:
            </p>

            {/* Enunciado */}
            <p className={styles.enunciado}>{questao.enunciado}</p>

            {/* Botões Certo / Errado */}
            <div className={styles.opcoes}>
                <button
                    className={getBotaoClass(true)}
                    disabled={!!feedback}
                    onClick={() => onSelecionar(true)}
                >
                    <span className={styles.opcaoIcone}>✓</span>
                    <span className={styles.opcaoTexto}>Certo</span>
                </button>

                <button
                    className={getBotaoClass(false)}
                    disabled={!!feedback}
                    onClick={() => onSelecionar(false)}
                >
                    <span className={styles.opcaoIcone}>✗</span>
                    <span className={styles.opcaoTexto}>Errado</span>
                </button>
            </div>

            {/* Feedback + Justificativa */}
            {feedback && (
                <div className={`${styles.feedback} ${feedback.correta ? styles.feedbackOk : styles.feedbackErr}`}>
                    <div className={styles.feedbackTitulo}>
                        {feedback.correta
                            ? "✓ Resposta correta! O gabarito é " + (feedback.gabarito ? "Certo" : "Errado") + "."
                            : "✗ Resposta incorreta. O gabarito é " + (feedback.gabarito ? "Certo" : "Errado") + "."}
                    </div>
                    {feedback.justificativa && (
                        <div className={styles.justificativa}>
                            <span className={styles.justificativaTitulo}>📝 Justificativa:</span>
                            <span>{feedback.justificativa}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Ações */}
            <div className={styles.botoes}>
                {!feedback ? (
                    <button
                        className={styles.btnConfirmar}
                        onClick={onResponder}
                        disabled={selecionada === null || respondendo}
                    >
                        {respondendo ? "Verificando..." : "Confirmar resposta"}
                    </button>
                ) : (
                    <button className={styles.btnConfirmar} onClick={onProxima}>
                        {indice + 1 < total ? "Próxima questão →" : "Ver resultado →"}
                    </button>
                )}
            </div>

        </Card>
    );
}

/* ── ResultadoFinal ──────────────────────────────────── */

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

            <button className={styles.btnConfirmar} onClick={onReiniciar}>
                Refazer simulado
            </button>
        </Card>
    );
}