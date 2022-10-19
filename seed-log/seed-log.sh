COUNT=0
while true
do
  ((COUNT++))
  echo "`date`"
  echo "file1" $COUNT >> logs/file1.log 
  echo "file2" $COUNT >> logs/file2.log 
  echo "file3" $COUNT >> logs/file3.log 
  uuidgen >> logs/file2.log 
  openssl rand -base64 120 >> logs/file1.log 
  sleep 1
done