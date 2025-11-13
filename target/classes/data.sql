INSERT INTO instituicoes_ensino (nome) 
SELECT 'Universidade Federal de Minas Gerais - UFMG' 
WHERE NOT EXISTS (SELECT 1 FROM instituicoes_ensino WHERE nome = 'Universidade Federal de Minas Gerais - UFMG');

INSERT INTO instituicoes_ensino (nome) 
SELECT 'Pontifícia Universidade Católica de Minas Gerais - PUC-MG' 
WHERE NOT EXISTS (SELECT 1 FROM instituicoes_ensino WHERE nome = 'Pontifícia Universidade Católica de Minas Gerais - PUC-MG');

INSERT INTO instituicoes_ensino (nome) 
SELECT 'Instituto Tecnológico de Aeronáutica - ITA' 
WHERE NOT EXISTS (SELECT 1 FROM instituicoes_ensino WHERE nome = 'Instituto Tecnológico de Aeronáutica - ITA');

-- Empresa Parceira
INSERT INTO empresas_parceiras (nome, email, senha, cnpj) VALUES 
('Tech Solutions Ltda', 'empresa@techsolutions.com', '123456', '12.345.678/0001-90')
ON CONFLICT (email) DO NOTHING;

-- Professor
INSERT INTO professores (nome, email, senha, departamento) VALUES 
('João Silva', 'joao.silva@escola.edu', '123456', 'Ciência da Computação')
ON CONFLICT (email) DO NOTHING;

-- Aluno
INSERT INTO alunos (nome, email, senha, cpf, rg, endereco, curso, saldo_moedas, instituicao_ensino_id) VALUES 
('Tiago Santos', 'tiago.santos@aluno.edu', '123456', '123.456.789-00', 'MG-12.345.678', 'Rua das Flores, 123', 'Engenharia de Software', 50.0, 1)
ON CONFLICT (email) DO NOTHING;

