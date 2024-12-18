/**
 * @swagger
 * /admin/api/v1/comment/create:
 *   post:
 *     tags: ['Comments']
 *     summary: Create a new comment
 *     description: Creates a new comment for a specific product.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user making the comment.
 *                 example: "user@example.com"
 *               text:
 *                 type: string
 *                 description: The content of the comment.
 *                 example: "Great product! Highly recommended."
 *               productId:
 *                 type: string
 *                 description: The ID of the product being commented on.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Comment successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174001"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     text:
 *                       type: string
 *                       example: "Great product! Highly recommended."
 *                     product_id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     createdAt:
 *                       type: string
 *                       example: "2024-12-18T12:00:00.000Z"
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/comments/get/by/productId/{productId}:
 *   get:
 *     tags: ['Comments']
 *     summary: Get comments by product ID
 *     description: Retrieves all comments for a specific product.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: List of comments for the product retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174001"
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 *                       text:
 *                         type: string
 *                         example: "Great product! Highly recommended."
 *                       product_id:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       createdAt:
 *                         type: string
 *                         example: "2024-12-18T12:00:00.000Z"
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/comments/get/all:
 *   get:
 *     tags: ['Comments']
 *     summary: Get all comments
 *     description: Retrieves all comments along with associated product details.
 *     responses:
 *       200:
 *         description: List of all comments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174001"
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 *                       text:
 *                         type: string
 *                         example: "Great product! Highly recommended."
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                           title:
 *                             type: string
 *                             example: "Flower Bouquet"
 *                           description:
 *                             type: string
 *                             example: "A beautiful bouquet of flowers."
 *                       createdAt:
 *                         type: string
 *                         example: "2024-12-18T12:00:00.000Z"
 *       500:
 *         description: Internal server error.
 */

const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Comment, Product } = require("../../models/index");

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
