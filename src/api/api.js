const { authMiddleware } = require("../middlewares/middleware");
const { upload } = require("../middlewares/uploads.middleware");
const { adminRegister, adminLogin } = require("../services/auth.service");
const {
  createComment,
  getCommentsByProductId,
  getAllComments,
} = require("../services/comment.service");
const {
  createOrder,
  updateOrder,
  getAllOrders,
  deleteOrder,
} = require("../services/order.service");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../services/product.service");

const router = require("express").Router();

router.use("/admin/", authMiddleware);

router.post("/auth/register/admin", adminRegister);
router.post("/auth/login/admin", adminLogin);

router.post(
  "/admin/api/v1/product/create",
  upload.single("image"),
  createProduct
);
router.get("/admin/api/v1/products/get/all", getAllProducts);
router.put("/admin/api/v1/product/update/:id", updateProduct);
router.delete("/admin/api/v1/product/delete/:id", deleteProduct);
router.post("/admin/api/v1/order/create", createOrder);
router.get("/admin/api/v1/orders/get/all", getAllOrders);
router.put("/admin/api/v1/order/update/:id", updateOrder);
router.delete("/admin/api/v1/order/delete/:id", deleteOrder);
router.post("/admin/api/v1/comment/create", createComment);
router.get(
  "/admin/api/v1/comments/get/by/productId/:productId",
  getCommentsByProductId
);
router.get("/admin/api/v1/comments/get/all", getAllComments);

module.exports = { router };
