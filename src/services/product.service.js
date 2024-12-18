/**
 * @swagger
 * /admin/api/v1/product/create:
 *   post:
 *     tags: ['Products']
 *     summary: Create a new product
 *     description: Adds a new product to the database with the specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the product.
 *                 example: "Smartphone"
 *               description:
 *                 type: string
 *                 description: The description of the product.
 *                 example: "A high-quality smartphone with 128GB storage."
 *               amount:
 *                 type: number
 *                 description: The amount of the product in stock.
 *                 example: 50
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The product image file.
 *     responses:
 *       201:
 *         description: Product successfully created.
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
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     title:
 *                       type: string
 *                       example: "Smartphone"
 *                     description:
 *                       type: string
 *                       example: "A high-quality smartphone with 128GB storage."
 *                     amount:
 *                       type: number
 *                       example: 50
 *                     image:
 *                       type: string
 *                       example: "smartphone.jpg"
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/products/get/all:
 *   get:
 *     tags: ['Products']
 *     summary: Get all products
 *     description: Retrieves all products from the database.
 *     responses:
 *       200:
 *         description: List of products retrieved successfully.
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
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       title:
 *                         type: string
 *                         example: "Smartphone"
 *                       description:
 *                         type: string
 *                         example: "A high-quality smartphone with 128GB storage."
 *                       amount:
 *                         type: number
 *                         example: 50
 *                       image:
 *                         type: string
 *                         example: "smartphone.jpg"
 *       404:
 *         description: No products found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/product/update/{id}:
 *   put:
 *     tags: ['Products']
 *     summary: Update an existing product
 *     description: Updates the details of an existing product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the product.
 *                 example: "Updated Smartphone"
 *               description:
 *                 type: string
 *                 description: Updated description of the product.
 *                 example: "An updated high-quality smartphone with 256GB storage."
 *               amount:
 *                 type: number
 *                 description: Updated amount of the product.
 *                 example: 100
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     title:
 *                       type: string
 *                       example: "Updated Smartphone"
 *                     description:
 *                       type: string
 *                       example: "An updated high-quality smartphone with 256GB storage."
 *                     amount:
 *                       type: number
 *                       example: 100
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/product/delete/{id}:
 *   delete:
 *     tags: ['Products']
 *     summary: Delete a product
 *     description: Deletes a product from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the product to delete.
 *     responses:
 *       200:
 *         description: Product successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Product } = require("../../models/index");

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
