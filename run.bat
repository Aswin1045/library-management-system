@echo off
echo ====================================================
echo Starting Library Management System...
echo ====================================================

:: Start Spring Boot in a separate PowerShell window to avoid nested quote issues
start "LMS Server" powershell -NoExit -Command "cd '%~dp0'; $env:JAVA_HOME='C:\Program Files\Java\jdk-21'; $env:PATH='C:\Program Files\Java\jdk-21\bin;' + $env:PATH; & 'C:\Users\Aswin v\.m2\wrapper\apache-maven-3.9.6\bin\mvn.cmd' spring-boot:run"

echo Waiting 7 seconds for Tomcat server to start...
timeout /t 7 /nobreak >nul

echo Opening Library Management System web page...
start http://localhost:9090
echo Done!
