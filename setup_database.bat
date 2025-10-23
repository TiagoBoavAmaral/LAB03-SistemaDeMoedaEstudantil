@echo off
echo Configurando banco de dados PostgreSQL...
echo.
echo Digite a senha do usuario postgres quando solicitado:
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE moedaestudantil_db;"
echo.
echo Banco de dados criado com sucesso!
echo.
echo Agora configure as credenciais no arquivo application.properties:
echo - Usuario: postgres
echo - Senha: postgres
echo - Database: moedaestudantil_db
pause
