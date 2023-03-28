const path = require("path");
const Koa = require("koa");
const bodyParser = require("koa-body");
const respond = require("koa-respond");
const morgan = require("koa-morgan");
const render = require("koa-ejs");
const router = require("./routes");

const withSocketIO = require("@zcorky/koa-socket.io").default;

const app = new Koa();
withSocketIO(app);
render(app, {
  root: path.join(__dirname, "views"),
  layout: "template",
  viewExt: "html",
  cache: false,
  debug: false,
});

app.use(morgan("dev"));
app.use(bodyParser());
app.use(respond());

app.use(router.routes());
app.use(router.allowedMethods());

app.io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (msg) => {
    app.io.emit("chat message", msg);
  });
});

app.listen(3000, async () => {
  console.log("Server up on http://localhost:3000");
});
