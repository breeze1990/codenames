module.exports = function (app) {
  console.log("test.js");
  app.get("/", async (req, res) => {
    res.json({
      a: "b",
    });
  });
};
