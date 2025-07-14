npm run build
firebase deploy

# Remove existing git folder and start over
rd /s .git


git init
git status
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/sidmaji/collegeplanner.git
git push -u origin main

git remote set-url origin https://github.com/sidmaji/collegeplanner.git
git remote -v

...
Then 
git add.
git commit -m "Added command.md"
git push -u origin main


(If Needed, delete the .git folder and then add the .gitignore)
then do a git init

# For marketplace feature
git checkout -b feature/marketplace
git add .
git commit -m "Add marketplace feature for used books"
git push -u origin feature/marketplace
