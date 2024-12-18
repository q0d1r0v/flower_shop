const jwt = require("jsonwebtoken");
const { Admin } = require("../../models/index");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ status: "fail", message: "Access token required" });
    }
    jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      async (err, admin_data) => {
        if (err) {
          return res.status(403).json({
            status: "fail",
            message: "Access token is invalid or expired",
          });
        }
        const admin = await Admin.findOne({
          where: {
            id: admin_data.id,
          },
        });
        if (!admin) {
          return res.status(404).json({
            status: "fail",
            message: "Not found this admin!",
          });
        } else {
          req.admin = admin;
          next();
        }
      }
    );
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = { authMiddleware };
