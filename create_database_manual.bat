@echo off
echo Criando banco de dados moedaestudantil_db...
echo.
echo Digite a senha do usuario postgres quando solicitado:
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE moedaestudantil_db;"
echo.
if %errorlevel% == 0 (
    echo Banco de dados criado com sucesso!
) else (
    echo Erro ao criar banco de dados. Verifique a senha.
)
echo.
pause
