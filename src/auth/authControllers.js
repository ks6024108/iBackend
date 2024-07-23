import createHttpError from "http-errors";
import userModel from "../user/userModel.js";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

//register api
const registerController = async (req, res, next) => {
  try {
    const {
      name,
      userId,
      designation,
      department,
      contactNumber,
      extensionNumber,
      mailId,
      password,
      confirmPassword,
      role,
      adminPassword,
    } = req.body;

    //validation
    if (
      !name ||
      !userId ||
      !designation ||
      !department ||
      !contactNumber ||
      !extensionNumber ||
      !mailId ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      return next(createHttpError(500, "please provide all fields"));
    }

    if (password !== confirmPassword) {
      return next(
        createHttpError(400, "password and confirm password not match")
      );
    }

    //check user
    const existing = await userModel.findOne({ mailId });
    if (existing) {
      return next(createHttpError(500, "email already exists please login"));
    }

    //hashing password
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if trying to register as an admin
    if (role === "admin") {
      // Check if the provided admin password matches the stored one
      if (adminPassword !== config.adminpassword) {
        return res.status(403).json({ message: "Invalid admin password" });
      }
    }

    const user = await userModel.create({
      name,
      userId,
      designation,
      department,
      contactNumber,
      extensionNumber,
      mailId,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      role,
    });

    res.status(201).send({
      success: true,
      message: "successfully registered",
      user,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "error in register api"));
  }
};

//login api
const loginController = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    //validation
    if (!userId || !password) {
      return next(createHttpError(500, "please provide userId or Password"));
    }

    //check user
    const user = await userModel.findOne({ userId });
    if (!user) {
      return next(createHttpError(404, "user not found"));
    }

    //check user password |compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(500, "Incorrect Password"));
    }

    //token
    const token = JWT.sign(
      { id: user._id, role: user.role },
      config.jwtsecret,
      {
        expiresIn: "2d",
      }
    );

   
    user.password = undefined;
    user.confirmPassword = undefined;

    res.status(200).json({
      success: true,
      message: "login successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "error in login api"));
  }
};

const forgotPasswordController = async (req, res) => {
  const { mailId } = req.body;
  const user = await userModel.findOne({ mailId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = JWT.sign({ userId: user._id }, config.jwtsecret, {
    expiresIn: "1h",
  });
  const resetLink = `${config.frontendDomain}/auth/resetpassword?token=${token}`;

  res.send({ resetLink });
};
const resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = JWT.verify(token, config.jwtsecret);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userModel.findByIdAndUpdate(decoded.userId, {
      password: hashedPassword,
    });
    res.status(200).json({ message: " Password reset successful " });
  } catch (error) {
    res.status(400).json({ message: " Invalid or expired token " });
  }
};

export {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
};
