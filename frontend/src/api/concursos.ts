// concursos-web/src/api/concursos.ts

import api from "./client";
import type { Concurso } from "../types";

export const getConcursos = async (bancaId?: number): Promise<Concurso[]> => {
    const params = bancaId ? { banca_id: bancaId } : {};
    const { data } = await api.get<Concurso[]>("/api/concursos", { params });
    return data;
};