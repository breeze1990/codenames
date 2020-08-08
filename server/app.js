const express = require("express");
const path = require("path");
const glob = require("glob");
const fs = require("fs").promises;

const app = express();
const port = 3000;

const log = require("./config/loggerFactory").getLogger(
  path.basename(__filename)
);

app.use(express.json());
app.get("/health", (req, res) => {
  res.send("Hello Codenames!");
});

glob("./controller/**/*", async (err, res) => {
  for (let path of res) {
    try {
      const stat = await fs.lstat(path);
      if (stat.isDirectory()) {
        continue;
      }
    } catch (e) {
      // ignore
      continue;
    }
    let controller = require(path);
    controller(app);
  }
});

app.listen(port, () => {
  log.info(`listening at ${port}`);
});
