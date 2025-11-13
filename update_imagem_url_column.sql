-- Script para atualizar a coluna imagem_url na tabela vantagens
-- Este script altera o tipo da coluna de VARCHAR(2000) para TEXT
-- para suportar imagens em base64 que podem ser muito grandes

-- Conecte-se ao banco de dados moedaestudantil_db antes de executar este script

ALTER TABLE vantagens 
ALTER COLUMN imagem_url TYPE TEXT;

-- Verificar se a alteração foi aplicada
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'vantagens' AND column_name = 'imagem_url';

