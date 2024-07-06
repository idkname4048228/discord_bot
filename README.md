# 重啟

```
sudo systemctl start bot-test
```

# 運行狀態

```
sudo systemctl status bot-test
journalctl -u bot-test.service -f
```


# installs
```
sudo apt-get update
sudo apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 libxrandr2 libxdamage1 libpango1.0-0 libx11-xcb1 libxss1 libgbm-dev
sudo apt-get install -y libxkbcommon0
npm install user-agents
```