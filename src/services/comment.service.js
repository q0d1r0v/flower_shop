const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Op, where } = require("sequelize");
const { Comment, Product } = require("../../models/index");
const { text } = require("express");

const createComment = async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required(),
      text: Joi.string().required(),
      productId: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
    }
    const product = await Product.findOne({
      where: {
        id: value.productId,
      },
    });
    if (!product) {
      res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    const newComment = await Comment.create({
      id: uuidv4(),
      email: value.email,
      text: value.text,
      product_id: value.productId,
    });
    res.status(201).json({
      status: "success",
      data: newComment,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
const getCommentsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }
    const comments = await Comment.findAll({
      where: { product_id: productId },
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({
      status: "success",
      data: comments,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "title", "description"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      data: comments,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = { createComment, getCommentsByProductId, getAllComments };
