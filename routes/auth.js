var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var sanitizeHtml = require("sanitize-html");
var template = require("../lib/template.js");

router.get("/login", function (request, response) {
  var fmsg = request.flash();
  var feedback = "";
  if (fmsg.error) {
    feedback = fmsg.error[0];
  }
  var title = "WEB - login";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list,
    `
    <div style="color:red;
    ">${feedback}</div>
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
  `,
    ""
  );
  response.send(html);
});

router.get("/logout", function (request, response) {
  request.logout();
  // request.session.destroy(function (err) {
  //   response.redirect("/");
  // });
  request.session.save(function (err) {
    response.redirect("/");
  });
});

module.exports = router;
