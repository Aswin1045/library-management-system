@REM Maven Wrapper batch script for Windows
@REM Auto-downloads Maven if not present

@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
set MAVEN_CMD_LINE_ARGS=%*

@REM Check for Maven Wrapper jar
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"

@REM Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto execute
echo ERROR: JAVA_HOME is not set and no 'java' command found.
goto error

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%\bin\java.exe
if exist "%JAVA_EXE%" goto execute
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
goto error

:execute
@REM If wrapper jar doesn't exist, download Maven directly
if not exist %WRAPPER_JAR% (
    @REM Use Maven directly from PATH or download
    set MAVEN_HOME=%MAVEN_PROJECTBASEDIR%.mvn\maven
    if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
        echo Downloading Maven...
        powershell -Command "& { $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip' -OutFile '%MAVEN_PROJECTBASEDIR%.mvn\maven.zip' }"
        powershell -Command "& { Expand-Archive -Path '%MAVEN_PROJECTBASEDIR%.mvn\maven.zip' -DestinationPath '%MAVEN_PROJECTBASEDIR%.mvn' -Force }"
        ren "%MAVEN_PROJECTBASEDIR%.mvn\apache-maven-3.9.6" maven
        del "%MAVEN_PROJECTBASEDIR%.mvn\maven.zip"
    )
    "%MAVEN_HOME%\bin\mvn.cmd" %MAVEN_CMD_LINE_ARGS%
    goto end
)

"%JAVA_EXE%" -jar %WRAPPER_JAR% %MAVEN_CMD_LINE_ARGS%
goto end

:error
set ERROR_CODE=1

:end
endlocal
exit /b %ERROR_CODE%
