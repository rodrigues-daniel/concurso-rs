// concursos-web/src/api/assuntos.ts

import api from "./client";
import type { Assunto } from "../types"

export const getAssuntos = async (): Promise<Assunto[]> => {
    const { data } = await api.get<Assunto[]>("/api/assuntos");
    return data;
};