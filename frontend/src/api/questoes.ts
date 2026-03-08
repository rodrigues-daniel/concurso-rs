// concursos-web/src/api/questoes.ts

import api from "./client";
import type { Questao, ValidarRespostaResponse } from "../types";

export const getQuestoes = async (
    concursoId?: number,
    assuntoId?: number
): Promise<Questao[]> => {
    const params: Record<string, number> = {};
    if (concursoId) params.concurso_id = concursoId;
    if (assuntoId) params.assunto_id = assuntoId;
    const { data } = await api.get<Questao[]>("/api/questoes", { params });
    return data;
};

export const validarResposta = async (
    questaoId: number,
    resposta: string
): Promise<ValidarRespostaResponse> => {
    const { data } = await api.post<ValidarRespostaResponse>(
        `/api/questoes/${questaoId}/validar`,
        { resposta }
    );
    return data;
};