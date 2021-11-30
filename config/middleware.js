/* Set flash set error and success messages in response so that we can fetch them on client side and send notifications */
module.exports.setFlash = function (req, res, next) {
  res.locals.flash = {
    "success": req.flash("success"),
    "error": req.flash("error"),
  };

  next();
};
