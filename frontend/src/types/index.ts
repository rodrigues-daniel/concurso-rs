// concursos-web/src/types/index.ts

export interface Banca {
    id: number;
    nome: string;
    descricao: string | null;
}

export interface Concurso {
    id: number;
    nome: string;
    orgao: string | null;
    ano: number | null;
    banca_id: number | null;
}

export interface Assunto {
    id: number;
    nome: string;
    descricao: string | null;
}

export interface Questao {
    id: number;
    enunciado: string;
    alternativa_a: string | null;
    alternativa_b: string | null;
    alternativa_c: string | null;
    alternativa_d: string | null;
    alternativa_e: string | null;
    alternativa_correta: string;
    assunto_id: number | null;
    concurso_id: number | null;
}

export interface ValidarRespostaResponse {
    correta: boolean;
    alternativa_correta: string;
}