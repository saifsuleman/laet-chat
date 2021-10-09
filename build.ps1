cd client
npm run build
cd ..
Remove-Item server/views -Recurse -ErrorAction Ignore
cp -r client/build server/views
cd server
go build
cd ..
cp server/server.exe .
echo "Built"