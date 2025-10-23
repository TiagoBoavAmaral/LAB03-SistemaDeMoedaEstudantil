@echo off
echo Redefinindo senha do PostgreSQL...
echo.

REM Parar o servico
echo Parando o servico PostgreSQL...
net stop postgresql-x64-18

REM Aguardar um pouco
timeout /t 3 /nobreak >nul

REM Iniciar em modo single-user e redefinir senha
echo Redefinindo senha para 'postgres'...
echo ALTER USER postgres PASSWORD 'postgres'; | "C:\Program Files\PostgreSQL\18\bin\postgres.exe" --single -D "C:\Program Files\PostgreSQL\18\data" postgres

REM Aguardar um pouco
timeout /t 3 /nobreak >nul

REM Reiniciar o servico
echo Reiniciando o servico PostgreSQL...
net start postgresql-x64-18

echo.
echo Senha redefinida com sucesso!
echo Usuario: postgres
echo Senha: postgres
echo.
pause
