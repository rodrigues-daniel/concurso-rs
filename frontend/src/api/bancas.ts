// concursos-web/src/api/bancas.ts

import api from "./client";
import type { Banca } from "../types";

export const getBancas = async (): Promise<Banca[]> => {
    const { data } = await api.get<Banca[]>("/api/bancas");
    return data;
};