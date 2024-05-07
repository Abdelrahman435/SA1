const courseService = require("../services/coursesServices");
const fs = require("fs");

exports.addCourse = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        errors: [
          {
            msg: "Image is Required",
          },
        ],
      });
    }
    let course = {
      ...req.body,
    };
    await courseService.addCourse(course);
    res.status(200).json({
      status: "success",
      msg: "course created successfully !",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Iternal Error" });
  }
};

exports.checkId = async (req, res, next, val) => {
  try {
    const course = await courseService.getCourse(req.params.id);
    if (!course[0]) {
      return res.status(404).json({ status: "fail", msg: "Course not found" });
    }
    next();
  } catch (error) {
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await courseService.getCourse(req.params.id);
    if (req.file) {
      req.body.image_url = req.file.filename;
      fs.unlinkSync("./upload/" + course[0].image_url);
    }
    await courseService.updateCourse(req.body, req.params.id);
    res.status(200).json({
      status: "success",
      msg: "Course updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await courseService.getCourse(req.params.id);
    fs.unlinkSync("./upload/" + course[0].image_url);
    await courseService.deleteCourse(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

exports.getCourses = async (req, res) => {
  try {
    let courses;
    let search = "";
    if (req.query.search) {
      search = `where name like '%${req.query.search}%' or description like '%${req.query.description}%'`;
      courses = await courseService.searchCourses(search);
    } else {
      courses = await courseService.showcourses();
    }
    if (courses) {
      courses.map((course) => {
        course.image_url =
          "http://" + req.hostname + ":3000/" + course.image_url;
      });
    }
    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await courseService.getCourse(req.params.id);
    course[0].image_url =
      "http://" + req.hostname + ":3000/" + course[0].image_url;

    res.status(200).json(course[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};
