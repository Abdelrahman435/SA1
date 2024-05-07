const materialsServices = require("../services/materialsServices");
const fs = require("fs");

exports.checkId = async (req, res, next) => {
  try {
    const material = await materialsServices.getMaterial(req.params.id);
    if (!material[0]) {
      return res.status(400).json({ errors: ["Material not found"] });
    }
    next();
  } catch (error) {
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

exports.addMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        errors: [
          {
            msg: "File is Required",
          },
        ],
      });
    }

    let data = {
      name: req.body.name,
      fileName: req.file.filename,
      course_id: req.params.course_id,
    };

    await materialsServices.addmaterials(data);
    res.status(200).json({ msg: "Added material successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const data = await materialsServices.getMaterials(req.params.course_id);
    if (data.length > 0) {
      data.map((item) => {
        item.fileName = "http://" + req.hostname + ":3000/" + item.fileName;
      });
      return res.status(200).json(data);
    }
    return res.status(404).json({ msg: "Not Found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const material = await materialsServices.getMaterial(req.params.id);
    if (req.file) {
      req.body.fileName = req.file.filename;
      fs.unlinkSync("./upload/" + material[0].fileName);
    }

    await materialsServices.updateMaterials(req.body, req.params.id);
    res.status(200).json({
      msg: "Material updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

exports.deleteMaterials = async (req, res) => {
  try {
    const material = await materialsServices.getMaterial(req.params.id);
    fs.unlinkSync("./upload/" + material[0].fileName);
    await materialsServices.deleteMaterials(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};
