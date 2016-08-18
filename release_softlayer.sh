svn up
rm -rf tmp
npm run package
rsync -rave 'ssh -o ProxyCommand="/usr/bin/nc -X 5 -x 127.0.0.1:2222 %h %p" -p 58022 -i  /Users/fwy/.ssh/id_rsa.pub' --progress  -r tmp/ fengwenyong@10.102.30.217:/tmp/static
