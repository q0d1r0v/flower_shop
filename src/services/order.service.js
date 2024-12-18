/**
 * @swagger
 * /admin/api/v1/order/create:
 *   post:
 *     tags: ['Orders']
 *     summary: Create a new order
 *     description: Adds a new order to the database with the specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the customer.
 *                 example: "John Doe"
 *               region:
 *                 type: string
 *                 description: Region of the customer.
 *                 example: "Tashkent"
 *               phoneNumber:
 *                 type: string
 *                 description: Customer's phone number.
 *                 example: "+998901234567"
 *               productId:
 *                 type: string
 *                 description: ID of the product being ordered.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Order successfully created.
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
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     region:
 *                       type: string
 *                       example: "Tashkent"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+998901234567"
 *                     productId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/orders/get/all:
 *   get:
 *     tags: ['Orders']
 *     summary: Get all orders
 *     description: Retrieves all orders along with the associated product details.
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully.
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
 *                       fullName:
 *                         type: string
 *                         example: "John Doe"
 *                       region:
 *                         type: string
 *                         example: "Tashkent"
 *                       phoneNumber:
 *                         type: string
 *                         example: "+998901234567"
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "123e4567-e89b-12d3-a456-426614174000"
 *                           title:
 *                             type: string
 *                             example: "Smartphone"
 *                           amount:
 *                             type: number
 *                             example: 5
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/order/update/{id}:
 *   put:
 *     tags: ['Orders']
 *     summary: Update an order
 *     description: Updates the details of an existing order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the order to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Updated full name of the customer.
 *                 example: "Jane Doe"
 *               region:
 *                 type: string
 *                 description: Updated region of the customer.
 *                 example: "Samarkand"
 *               phoneNumber:
 *                 type: string
 *                 description: Updated phone number of the customer.
 *                 example: "+998901234568"
 *     responses:
 *       200:
 *         description: Order updated successfully.
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
 *                   example: "Order updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174001"
 *                     fullName:
 *                       type: string
 *                       example: "Jane Doe"
 *                     region:
 *                       type: string
 *                       example: "Samarkand"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+998901234568"
 *       400:
 *         description: Validation error.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/api/v1/order/delete/{id}:
 *   delete:
 *     tags: ['Orders']
 *     summary: Delete an order
 *     description: Deletes an order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the order to delete.
 *     responses:
 *       200:
 *         description: Order successfully deleted.
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
 *                   example: "Order deleted successfully"
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */

const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Order, Product } = require("../../models/index");

const createOrder = async (req, res) => {
  try {
    const schema = Joi.object({
      fullName: Joi.string().required(),
      region: Joi.string().required(),
      phoneNumber: Joi.string().required(),
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
    const newOrder = await Order.create({
      id: uuidv4(),
      full_name: value.fullName,
      region: value.region,
      phone_number: value.phoneNumber,
      product_id: value.productId,
    });
    res.status(201).json({
      status: "success",
      data: newOrder,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "title", "amount"],
        },
      ],
    });
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const schema = Joi.object({
      fullName: Joi.string().optional(),
      region: Joi.string().optional(),
      phoneNumber: Joi.string().optional(),
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
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }
    await order.update({
      full_name: value.fullName || order.full_name,
      region: value.region || order.region,
      phone_number: value.phoneNumber || order.phone_number,
    });
    res.status(200).json({
      status: "success",
      message: "Order updated successfully",
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }
    await order.destroy();
    res.status(200).json({
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = { createOrder, updateOrder, getAllOrders, deleteOrder };
