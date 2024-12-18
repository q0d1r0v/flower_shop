const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Product, Comment } = require("../../models/index");

const createProduct = async (req, res) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      amount: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const newProduct = await Product.create({
      id: uuidv4(),
      title: value.title,
      image: req.file.filename,
      description: value.description,
      amount: value.amount,
    });
    res.status(201).json({
      status: "success",
      data: newProduct,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: [
        "id",
        "title",
        "image",
        "description",
        "amount",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!products || products.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No products found",
      });
    }
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const schema = Joi.object({
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      amount: Joi.number().optional(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    await product.update({
      title: value.title || product.title,
      description: value.description || product.description,
      amount: value.amount || product.amount,
    });
    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const fs = require("fs");
const path = require("path");

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    const filePath = path.join(__dirname, "../../uploads", product.image);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err.message);
      }
    });
    await product.destroy();
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
