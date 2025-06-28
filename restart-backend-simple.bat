@echo off
echo ========================================
echo    RESTARTING SPRING BOOT BACKEND
echo ========================================

echo.
echo [1/3] Stopping existing processes on port 8088...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8088') do (
    echo Stopping process %%a
    taskkill /F /PID %%a 2>nul
)

echo.
echo [2/3] Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Starting Spring Boot application...
echo Please wait 30-60 seconds for startup...
cd ..\Online-shoppBE
call mvnw spring-boot:run

pause 