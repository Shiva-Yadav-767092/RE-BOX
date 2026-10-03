$git = "C:\Users\Asus\AppData\Local\Programs\MinGit\cmd\git.exe"

Write-Host "Initializing Git..."
& $git init
& $git config user.name "Shiva-Yadav-767092"
& $git config user.email "shiva-yadav@users.noreply.github.com"
& $git branch -M main

Write-Host "Adding remote..."
& $git remote remove origin 2>$null
& $git remote add origin "https://github.com/Shiva-Yadav-767092/RE-BOX.git"

Write-Host "Staging files..."
& $git add .

Write-Host "Committing..."
& $git commit -m "Initial commit: RE:BOX - Give Old Things a New Identity (Complete Web Application)"

Write-Host "Pushing to GitHub..."
& $git push -u origin main
