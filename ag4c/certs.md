# 1 install certbot and switch to root user
sudo apt-get update -y && sudo apt-get install certbot -y
# 2 intitate certification issuance
sudo certbot certonly \
  --preferred-challenges=dns \
  --manual \
  --email nadeemkhalid@outlook.com \
  --server https://acme-v02.api.letsencrypt.org/directory \
  -d *.pocvivahealth.com \
  --agree-tos

  # 3 prepare files to be copied locally
  cd /tmp
  cp /etc/letsencrypt/archive/pocvivahealth.com/* /tmp/certbot
  chmod +r privkey2.pem

  # 4 copy files using scp
  