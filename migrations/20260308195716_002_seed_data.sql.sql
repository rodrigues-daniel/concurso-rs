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

INSERT INTO questoes (enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, alternativa_correta, assunto_id, concurso_id)
SELECT
    'De acordo com a Constituição Federal de 1988, são direitos sociais, entre outros:',
    'A) a educação, a saúde, a alimentação, o trabalho, a moradia, o transporte, o lazer, a segurança, a previdência social, a proteção à maternidade e à infância, a assistência aos desamparados.',
    'B) apenas a educação, a saúde e o trabalho, pois os demais são garantidos por legislação infraconstitucional.',
    'C) a educação, a saúde e a segurança pública, sendo os demais direitos sociais previstos apenas em lei ordinária.',
    'D) somente a educação e a saúde, pois são direitos mínimos assegurados constitucionalmente a todos os cidadãos.',
    'E) a educação, a saúde, o trabalho e a segurança, excluindo-se o lazer e o transporte do rol constitucional.',
    'A',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Direito Constitucional' AND c.nome = 'TCE-RN';

INSERT INTO questoes (enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, alternativa_correta, assunto_id, concurso_id)
SELECT
    'Com relação ao TCU e ao controle externo no Brasil, assinale a opção correta:',
    'A) O controle externo é exercido pelo Congresso Nacional com o auxílio do Tribunal de Contas da União.',
    'B) O TCU possui função jurisdicional plena, podendo anular atos administrativos com efeito vinculante.',
    'C) O controle externo é exercido exclusivamente pelo Poder Judiciário.',
    'D) O TCU é um órgão do Poder Executivo responsável pela fiscalização interna das contas públicas.',
    'E) O controle externo é realizado pelo próprio Poder Executivo sem participação do Legislativo.',
    'A',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Controle Externo' AND c.nome = 'TCE-RN';

INSERT INTO questoes (enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, alternativa_correta, assunto_id, concurso_id)
SELECT
    'Em segurança da informação, o princípio que garante acesso somente a pessoas autorizadas é:',
    'A) Confidencialidade.',
    'B) Integridade.',
    'C) Disponibilidade.',
    'D) Autenticidade.',
    'E) Irretratabilidade.',
    'A',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Tecnologia da Informação' AND c.nome = 'TCE-RN';

INSERT INTO questoes (enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, alternativa_e, alternativa_correta, assunto_id, concurso_id)
SELECT
    'Os princípios constitucionais expressos da Administração Pública no art. 37 da CF são:',
    'A) legalidade, impessoalidade, moralidade, publicidade e eficiência.',
    'B) legalidade, impessoalidade, moralidade, publicidade e economicidade.',
    'C) legalidade, moralidade, publicidade, eficiência e proporcionalidade.',
    'D) legalidade, impessoalidade, publicidade, eficiência e razoabilidade.',
    'E) legalidade, impessoalidade, moralidade, eficiência e supremacia do interesse público.',
    'A',
    a.id, c.id
FROM assuntos a, concursos c
WHERE a.nome = 'Direito Administrativo' AND c.nome = 'TCE-RN';