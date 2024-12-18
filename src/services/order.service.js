const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
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
