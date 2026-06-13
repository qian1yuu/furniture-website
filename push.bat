@echo off
echo ============================
echo    榆城家具网站 - 一键推送
echo ============================
echo.

cd /d "g:\traepython\furniture_website"

echo 1. 检查修改...
git status
echo.

echo 2. 添加所有修改...
git add .
echo.

set /p commit_msg=请输入修改说明: 
git commit -m "%commit_msg%"
echo.

echo 3. 推送到 GitHub...
git push origin main
echo.

echo ✅ 推送完成！
pause