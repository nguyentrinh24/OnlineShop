@echo off
echo ========================================
echo    RESTARTING SPRING BOOT BACKEND
echo ========================================

echo.
echo [1/4] Stopping existing processes on port 8088...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8088') do (
    echo Stopping process %%a
    taskkill /F /PID %%a 2>nul
)

echo.
echo [2/4] Cleaning project...
cd ..\Online-shoppBE
call mvnw clean

echo.
echo [3/4] Compiling project...
call mvnw compile

echo.
echo [4/4] Starting Spring Boot application...
echo Please wait 30-60 seconds for startup...
call mvnw spring-boot:run

pause 