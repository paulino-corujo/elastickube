tell application "Terminal"
      do script "cd ~/Repositories/elastickube && fswatch -or --exclude=.git $(grep '^[^#]' .gitignore | sed -e 's/^/--exclude=/') . | xargs -n1 -I{} rsync -aHviSh --delete --filter=':- .gitignore' . 10.5.10.6::elastickube/"
end tell
