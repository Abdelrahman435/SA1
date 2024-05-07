var express = require("express");
var router = express.Router();
const upload = require("../middleware/uploadImages");
const course = require("../controller/coursesController");

router.param('id', course.checkId)

router
  .route("/")
  .post(upload.single("image"), course.addCourse)
  .get(course.getCourses);

router
  .route("/:id/:code")
  .patch(upload.single("image"), course.updateCourse)
  .get(course.getCourse);

router.delete("/:id", course.deleteCourse);

module.exports = router;
