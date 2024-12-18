const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { Admin } = require("../../models/index");

const adminRegister = async (req, res) => {
  try {
    const schema = Joi.object({
      secretKey: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    if (process.env.ADMIN_SECRET_KEY === value.secretKey) {
      const existingAdmin = await Admin.findOne({
        where: {
          [Op.or]: [{ username: value.username }],
        },
      });

      if (existingAdmin) {
        return res.status(400).json({
          status: "fail",
          message: "Username already exists",
        });
      }
      const hashedPassword = await bcrypt.hash(value.password, 10);

      const newAdmin = await Admin.create({
        id: uuidv4(),
        username: value.username,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      });
      res.status(201).json({
        status: "success",
        data: {
          admin: {
            id: newAdmin.id,
            username: newAdmin.username,
          },
        },
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Bad request",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const admin = await Admin.findOne({
      where: { username: value.username },
    });

    if (!admin) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid username or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      value.password,
      admin.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      status: "success",
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = { adminRegister, adminLogin };
