-- Add migration script here
-- concursos-api/migrations/002_seed_data.sql

INSERT INTO bancas (nome, descricao) VALUES
('CEBRASPE', 'Centro Brasileiro de Pesquisa em Avaliação e Seleção e de Promoção de Eventos')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO assuntos (nome, descricao) VALUES
('Direito Constitucional', 'Estudo da Constituição Federal e princípios fundamentais'),
('Direito Administrativo',  'Princípios, atos e contratos administrativos'),
('Controle Externo',        'Fiscalização contábil, financeira, orçamentária e patrimonial'),
('Tecnologia da Informação','Segurança da informação, redes, banco de dados e engenharia de software')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO concursos (nome, orgao, ano, banca_id)
SELECT 'TCE-RN', 'Tribunal de Contas do Estado do RN', 2024, id
FROM bancas WHERE nome = 'CEBRASPE'
ON CONFLICT DO NOTHING;

-- Direito Constitucional
INSERT INTO questoes (enunciado, gabarito, justificativa, assunto_id, concurso_id)
SELECT
    'Os direitos sociais previstos no art. 6.º da Constituição Federal de 1988 incluem, entre outros, a educação, a saúde, a alimentação, o trabalho, a moradia, o transporte e o lazer.',
    true,
    'O art. 6.º da CF/88 elenca expressamente todos esses direitos sociais, tendo sido ampliado por emendas constitucionais ao longo dos anos.',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Direito Constitucional' AND c.nome = 'TCE-RN';

INSERT INTO questoes (enunciado, gabarito, justificativa, assunto_id, concurso_id)
SELECT
    'O processo legislativo brasileiro não prevê a elaboração de medidas provisórias pelo Presidente da República, sendo este instrumento exclusivo do Poder Legislativo.',
    false,
    'O art. 62 da CF/88 atribui ao Presidente da República a competência para editar medidas provisórias com força de lei, em casos de relevância e urgência.',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Direito Constitucional' AND c.nome = 'TCE-RN';

INSERT INTO questoes (enunciado, gabarito, justificativa, assunto_id, concurso_id)
SELECT
    'A Constituição Federal de 1988 é classificada como rígida, pois exige um processo legislativo mais rigoroso para sua alteração em comparação às leis ordinárias.',
    true,
    'A CF/88 é rígida pois exige, para emenda, aprovação em dois turnos em cada Casa do Congresso Nacional por três quintos dos membros, conforme o art. 60.',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Direito Constitucional' AND c.nome = 'TCE-RN';

-- Direito Administrativo
INSERT INTO questoes (enunciado, gabarito, justificativa, assunto_id, concurso_id)
SELECT
    'O princípio da legalidade, aplicado à administração pública, determina que o administrador somente pode fazer o que a lei expressamente autoriza.',
    true,
    'Na Administração Pública vigora o princípio da legalidade estrita: o agente público só pode agir quando houver previsão legal, diferente do particular que pode fazer tudo que a lei não proíbe.',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Direito Administrativo' AND c.nome = 'TCE-RN';

INSERT INTO questoes (enunciado, gabarito, justificativa, assunto_id, concurso_id)
SELECT
    'O princípio da impessoalidade na administração pública permite que o agente público utilize obras e serviços públicos para promoção pessoal.',
    false,
    'O princípio da impessoalidade proíbe exatamente isso. A atuação do agente deve ser imputada ao órgão ou entidade, vedando promoção pessoal com recursos públicos (art. 37, §1º, CF/88).',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Direito Administrativo' AND c.nome = 'TCE-RN';

-- Controle Externo
INSERT INTO questoes (enunciado, gabarito, justificativa, assunto_id, concurso_id)
SELECT
    'O controle externo da União é exercido pelo Congresso Nacional com o auxílio do Tribunal de Contas da União, conforme previsto na Constituição Federal.',
    true,
    'O art. 71 da CF/88 estabelece que o controle externo, a cargo do Congresso Nacional, será exercido com o auxílio do TCU.',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Controle Externo' AND c.nome = 'TCE-RN';

INSERT INTO questoes (enunciado, gabarito, justificativa, assunto_id, concurso_id)
SELECT
    'O Tribunal de Contas da União possui natureza jurisdicional plena e suas decisões têm força de coisa julgada, impedindo revisão pelo Poder Judiciário.',
    false,
    'O TCU não possui natureza jurisdicional plena. Suas decisões têm natureza administrativa e podem ser revistas pelo Poder Judiciário, conforme pacífica jurisprudência do STF.',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Controle Externo' AND c.nome = 'TCE-RN';

-- Tecnologia da Informação
INSERT INTO questoes (enunciado, gabarito, justificativa, assunto_id, concurso_id)
SELECT
    'A confidencialidade é o princípio de segurança da informação que garante que a informação seja acessível somente às pessoas autorizadas.',
    true,
    'A confidencialidade é um dos pilares da segurança da informação (CID: Confidencialidade, Integridade e Disponibilidade) e tem exatamente esse objetivo.',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Tecnologia da Informação' AND c.nome = 'TCE-RN';

INSERT INTO questoes (enunciado, gabarito, justificativa, assunto_id, concurso_id)
SELECT
    'O protocolo HTTP é considerado seguro para transmissão de dados sensíveis, pois implementa criptografia nativa em todas as suas versões.',
    false,
    'O HTTP não possui criptografia nativa. Para transmissão segura de dados sensíveis, deve-se utilizar o HTTPS, que combina o HTTP com o protocolo TLS/SSL para criptografar os dados.',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Tecnologia da Informação' AND c.nome = 'TCE-RN';