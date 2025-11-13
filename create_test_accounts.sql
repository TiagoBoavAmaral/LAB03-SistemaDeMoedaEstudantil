-- Script para criar contas de teste
-- Execute este script no banco de dados moedaestudantil_db

-- Empresa Parceira
INSERT INTO empresas_parceiras (nome, email, senha, cnpj) VALUES 
('Tech Solutions Ltda', 'empresa@techsolutions.com', '123456', '12.345.678/0001-90')
ON CONFLICT (email) DO NOTHING;

-- Professor
INSERT INTO professores (nome, email, senha, departamento) VALUES 
('João Silva', 'joao.silva@escola.edu', '123456', 'Ciência da Computação')
ON CONFLICT (email) DO NOTHING;

-- Aluno (assumindo que a instituição com id=1 existe)
INSERT INTO alunos (nome, email, senha, cpf, rg, endereco, curso, saldo_moedas, instituicao_ensino_id) VALUES 
('Tiago Santos', 'tiago.santos@aluno.edu', '123456', '123.456.789-00', 'MG-12.345.678', 'Rua das Flores, 123', 'Engenharia de Software', 50.0, 1)
ON CONFLICT (email) DO NOTHING;

