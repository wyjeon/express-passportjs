var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var compression = require("compression");
var helmet = require("helmet");
app.use(helmet());
var session = require("express-session");
var FileStore = require("session-file-store")(session);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(
  session({
    secret: "asadlfkj!@#!@#dfgasdg",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

var authData = {
  email: "egoing777@gmail.com",
  password: "111111",
  nickname: "egoing",
};

// passport는 session을 활성화 시킨 코드 다음에 등장해야한다.
var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  console.log("serializeUser", user);
  done(null, user.email);
});

passport.deserializeUser(function (id, done) {
  console.log("deserializeUser", id);
  done(null, authData);
  // User.findById(id, function (err, user) {
  //   done(err, user);
  // });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pwd",
    },
    function (username, password, done) {
      if (username === authData.email) {
        console.log(1);
        if (password === authData.password) {
          console.log(2);
          return done(null, authData);
        } else {
          console.log(3);
          return done(null, false, { message: "Incorrect password." });
        }
      } else {
        console.log(4);
        return done(null, false, { message: "Incorrect username." });
      }
    }
  )
);

app.post(
  "/auth/login_process",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

app.get("*", function (request, response, next) {
  fs.readdir("./data", function (error, filelist) {
    request.list = filelist;
    next();
  });
});

var indexRouter = require("./routes/index");
var topicRouter = require("./routes/topic");
var authRouter = require("./routes/auth");

app.use("/", indexRouter);
app.use("/topic", topicRouter);
app.use("/auth", authRouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry cant find that!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
