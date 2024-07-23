import userModel from "./userModel.js";

const UserInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("role"); // Assuming user model has a 'role' field
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { UserInfo };
