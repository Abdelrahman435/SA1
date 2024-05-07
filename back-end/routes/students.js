var express = require("express");
var router = express.Router();
const upload = require("../middleware/uploadImages");
const student = require("../controller/studentsController");

router.param("id", student.checkId);

router
  .route("/:id")
  .patch(upload.single("image"), student.updateStudent)
  .get(student.getStudent);

router.delete("/delete/:id", student.deleteStudent);

router.get("/", student.getStudents);

router.post("/registerCourses/:course_id/:student_id", student.enrollment);

router.get("/showGrades/:id", student.showGrade);

router.get("/check/:studentId/:courseId", student.checkEnrollment);

module.exports = router;
