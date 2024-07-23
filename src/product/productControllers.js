import createHttpError from "http-errors";
import productModel from "./productModel.js";

const getAllProducts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;
  try {
    const products = await productModel.find().skip(skip).limit(limit);
    const total = await productModel.countDocuments();

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
    // res.json(products);
  } catch (err) {
    return next(createHttpError(500, "Error while getting products"));
  }
};

const addProduct = async (req, res, next) => {
  const { name, stock, description } = req.body;
  const product = new productModel({ name, stock, description });
  try {
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    return next(createHttpError(400, "Error while adding product"));
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return next(createHttpError(404, "Product not found"));
    }

    const updatedProductData = {
      name: updates.name || existingProduct.name,
      stock: updates.stock || existingProduct.stock,
      description: updates.description || existingProduct.description,
    };

    const product = await productModel.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true, runValidators: true }
    );
    res.status(200).json(product);
  } catch (error) {
    return next(createHttpError(400, "Error while updating product"));
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (error) {
    return next(createHttpError(500, "Error while deleting product"));
  }
};

export { getAllProducts, addProduct, updateProduct, deleteProduct };
