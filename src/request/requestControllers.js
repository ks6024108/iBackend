import productModel from "../product/productModel.js";
import requestModel from "../request/requestModel.js";

//create req
//api request
const createRequest = async (req, res, next) => {
  const { userId, products, requestName, requestDescription } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }
    // Validate products data
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products array must be provided and non-empty" });
    }

    // Check if all requested products exist
    const productNames = products.map((product) => product.name);
    const existingProducts = await productModel.find({
      name: { $in: productNames },
    });

    if (existingProducts.length !== productNames.length) {
      return res
        .status(400)
        .json({ message: "One or more products do not exist" });
    }
    // Construct request object
    const newRequest = new requestModel({
      userId,
      requestName, // Assuming userId is stored in req.user from authMiddleware
      products,
      status: "Pending", // Default status
      requestDescription,
    });

    // Save request to database
    await newRequest.save();

    res
      .status(201)
      .json({ message: "Request created successfully", request: newRequest });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "error in requesting product" });
  }
};

//update request status (only admin)
const updateRequestStatus = async (req, res, next) => {
  const { requestName } = req.params;
  const { status } = req.body;

  try {
    const requests = await requestModel.findOneAndUpdate(
      { requestName },
      { $set: { status, updatedAt: Date.now() } },
      { new: true }
    );

    if (!requests) {
      return res.status(404).json({ message: "Request not found" });
    }

    //decrease stock
    if (requests.status === "Confirmed") {
      for (const product of requests.products) {
        const existingProduct = await productModel.findOne({
          name: product.name,
        });

        if (!existingProduct) {
          return res
            .status(404)
            .json({ message: `product ${product.name} not found` });
        }
        if (
          existingProduct.stock > product.quantity &&
          existingProduct.stock > 0
        ) {
          existingProduct.stock -= product.quantity;
        } else {
          return res
            .status(404)
            .json({ message: "sorry,products are out of stock" });
        }
        await existingProduct.save();
      }
    }
    res.json({ message: `status and stock updated` });
  } catch (error) {
    res.status(500).json({ message: "error in updating status of products" });
  }
};

//get request by status
const getRequestByStatus = async (req, res, next) => {
  const { status } = req.params;

  // Valid statuses
  const validStatuses = ["Pending", "Confirmed", "Delivered", "Returned"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const requests = await requestModel.find({ status });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

//get user requests
const getUserRequests = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const requests = await requestModel.find({ userId }).populate("products");
    res.json(requests);
  } catch (error) {
    return next(createHttpError(500, "error while getting requests"));
  }
};

const returnRequest = async (req, res, next) => {
  const { requestName, userId } = req.params;

  try {
    // Find the request
    const request = await requestModel.findOne({ requestName, userId });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    //check request is delivered or not
    if (request.status !== "Delivered") {
      return res
        .status(400)
        .json({ message: "only Delivered products can be return" });
    }

    // Update the status to 'returned'
    request.status = "Returned";

    await request.save();

    // Update the stock of the products
    const updatePromises = request.products.map(async (product) => {
      const productInDb = await productModel.findOne({ name: product.name });
      if (productInDb) {
        productInDb.stock += product.quantity;
        await productInDb.save();
      }
    });

    await Promise.all(updatePromises);

    res.json({ message: "Request returned and stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export {
  createRequest,
  updateRequestStatus,
  getRequestByStatus,
  getUserRequests,
  returnRequest,
};
