const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const registerController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: "Validation failed", details: errors.array() });
    }

    const {fullname, username, email, password } = req.body;

    const existing = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "User with that email or username already exists" });
    }

    const user = new userModel({fullname, username, email, password });
    await user.save();

    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: (() => {
        const expires = process.env.JWT_EXPIRES_IN || "7d";
        if (typeof expires === "string" && expires.endsWith("d")) {
          const days = parseInt(expires.slice(0, -1), 10);
          if (!Number.isNaN(days)) return days * 24 * 60 * 60 * 1000;
        }
        return undefined;
      })(),
    });

    res.status(201).json({
      message: "User registered",
      user: { id: user._id,fullname:user.fullname, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("register err", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: "Validation failed", details: errors.array() });
    }

    const { emailOrUsername, password } = req.body;

    const query = {
      $or: [
        {
          email:
            typeof emailOrUsername === "string"
              ? emailOrUsername.toLowerCase()
              : emailOrUsername,
        },
        { username: emailOrUsername },
      ],
    };

    const user = await userModel.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      user: { id: user._id,fullname:user.fullname, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("login err", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("getProfile err", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: "Validation failed", details: errors.array() });
    }

    const user = await userModel.findById(req.user.userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const {fullname, username, password } = req.body;

    if (username && username !== user.username) {
      const exists = await userModel.findOne({ username });
      if (exists)
        return res.status(409).json({ message: "Username already taken" });
      user.username = username;
    }
    if (password) {
      user.password = password;
    }

    await user.save();

    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({
      message: "Profile updated",
      user: { id: user._id,fullname, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("updateProfile err", err);
    res.status(500).json({ message: "Server error" });
  }
};
const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/", 
    });

    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("logout err", err);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  registerController,
  loginController,
  getProfile,
  updateProfile,
  logoutController
};
