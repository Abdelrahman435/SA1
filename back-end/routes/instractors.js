var express = require("express");
var router = express.Router();
const upload = require("../middleware/uploadImages");
const insturctor = require("../controller/instructorController");

router.param('id', insturctor.checkId)

router
  .route("/:id")
  .patch(upload.single("image"), insturctor.updateInstructor)
  .delete(insturctor.deleteInstructor)
  .get(insturctor.getInstructor);

router.get("/", insturctor.getInstructors);

router.get("/view/:id", insturctor.getRelatedCourses);

router.post("/setGrades/:studentId/:courseId", insturctor.setGrades);

router.get("/student/:id", insturctor.viewStudents);

module.exports = router;
