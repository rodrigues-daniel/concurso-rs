// concursos-web/src/types/index.ts
// ALTERAÇÃO: Questao sem alternativas, gabarito boolean, justificativa adicionada

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
    gabarito: boolean;        // nunca exposto ao usuário antes de responder
    justificativa: string | null;  // exibida somente após responder
    assunto_id: number | null;
    concurso_id: number | null;
}

export interface ValidarRespostaResponse {
    correta: boolean;
    gabarito: boolean;
    justificativa: string | null;
}