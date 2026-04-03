@echo off
REM start-scraper.bat - Windows 启动淘宝爬虫脚本

setlocal enabledelayedexpansion

echo.
echo ================================
echo 0x20  电脑配件价格爬虫启动器 (Windows)
echo ================================
echo.

REM 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Python
    echo    请先安装 Python: https://www.python.org/downloads/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✓ Python 版本: %PYTHON_VERSION%
echo.

REM 检查依赖
echo 检查 Python 依赖...
setlocal

for %%p in (requests beautifulsoup4 cloudscraper) do (
    python -m pip show %%p >nul 2>&1
    if errorlevel 1 (
        echo   安装 %%p...
        python -m pip install %%p -q
    ) else (
        echo   ✓ %%p
    )
)

echo.
echo 选择操作模式:
echo.
echo   1) 一次性爬取 (--once^)
echo   2) 定时爬取 - 每1小时 (默认^)
echo   3) 定时爬取 - 每30分钟
echo   4) 定时爬取 - 每10分钟
echo   5) 自定义时间间隔
echo.

set /p choice="请选择 [1-5]: "

if "%choice%"=="1" (
    echo.
    echo 运行一次性爬取...
    python scripts/taobao_price_scraper.py --once
    pause
) else if "%choice%"=="2" (
    echo.
    echo 启动定时爬虫 (1小时间隔^)...
    python scripts/taobao_price_scraper.py
) else if "%choice%"=="3" (
    echo.
    echo 启动定时爬虫 (30分钟间隔^)...
    python scripts/taobao_price_scraper.py --interval 1800
) else if "%choice%"=="4" (
    echo.
    echo 启动定时爬虫 (10分钟间隔^)...
    python scripts/taobao_price_scraper.py --interval 600
) else if "%choice%"=="5" (
    set /p interval="输入间隔时间 (秒^): "
    echo.
    echo 启动定时爬虫 (%interval%秒间隔^)...
    python scripts/taobao_price_scraper.py --interval %interval%
) else (
    echo ❌ 无效的选择
    pause
    exit /b 1
)

echo.
echo ✓ 爬虫已启动！
echo   数据文件: data\price-history.json
echo   按 Ctrl+C 停止爬虫
echo.
pause
