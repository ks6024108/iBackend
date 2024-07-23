import createHttpError from "http-errors";

const AdminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({ message: "Access denied" });
    }
    next();
  } catch (error) {
    return next(createHttpError(500, "please provide  admin auth password"));
  }
};
export default AdminAuth;
