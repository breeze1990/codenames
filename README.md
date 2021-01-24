# codenames

```bash
# terminal 1
cd server
npm run start

# terminal 2
cd webapp/codenames
npm run start

# run in production
nohup node -r esm app.js </dev/null >> app.log 2>&1 &
```
