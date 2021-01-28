nvm install 10.0.0 #was 8.17.0
sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080