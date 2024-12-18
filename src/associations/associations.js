const setupAssociations = (db) => {
  if (db.Product && db.Order && db.Comment) {
    db.Order.belongsTo(db.Product, { foreignKey: "product_id", as: "product" });
    db.Product.hasMany(db.Order, { foreignKey: "product_id", as: "orders" });

    db.Comment.belongsTo(db.Product, {
      foreignKey: "product_id",
      as: "product",
    });
    db.Product.hasMany(db.Comment, {
      foreignKey: "product_id",
      as: "comments",
    });
  } else {
    console.error("User or Profile model is undefined");
  }
};

module.exports = { setupAssociations };
