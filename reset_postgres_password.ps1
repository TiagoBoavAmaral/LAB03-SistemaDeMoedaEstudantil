# Script para redefinir senha do PostgreSQL
Write-Host "Redefinindo senha do PostgreSQL..." -ForegroundColor Green

# Parar o serviço
Write-Host "Parando o serviço PostgreSQL..." -ForegroundColor Yellow
Stop-Service postgresql-x64-18 -Force

# Aguardar
Start-Sleep -Seconds 3

# Criar arquivo SQL temporário
$sqlFile = "C:\temp\reset_password.sql"
New-Item -ItemType Directory -Path "C:\temp" -Force | Out-Null
Set-Content -Path $sqlFile -Value "ALTER USER postgres PASSWORD 'postgres';"

# Executar em modo single-user
Write-Host "Redefinindo senha..." -ForegroundColor Yellow
& "C:\Program Files\PostgreSQL\18\bin\postgres.exe" --single -D "C:\Program Files\PostgreSQL\18\data" postgres < $sqlFile

# Limpar arquivo temporário
Remove-Item $sqlFile -Force

# Aguardar
Start-Sleep -Seconds 3

# Reiniciar serviço
Write-Host "Reiniciando o serviço PostgreSQL..." -ForegroundColor Yellow
Start-Service postgresql-x64-18

Write-Host "Senha redefinida com sucesso!" -ForegroundColor Green
Write-Host "Usuário: postgres" -ForegroundColor Cyan
Write-Host "Senha: postgres" -ForegroundColor Cyan

# Testar conexão
Write-Host "Testando conexão..." -ForegroundColor Yellow
$env:PGPASSWORD="postgres"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "SELECT 'Conexão bem-sucedida!' as status;"
