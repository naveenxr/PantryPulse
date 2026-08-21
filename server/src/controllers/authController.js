const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../middleware/authMiddleware");

/**
 * Generate JWT token for authenticated user
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, dietaryPreference, householdSize } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email address",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      dietaryPreference: dietaryPreference || "Vegetarian",
      householdSize: householdSize || 2,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dietaryPreference: user.dietaryPreference,
        householdSize: user.householdSize,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("[Register Error]:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dietaryPreference: user.dietaryPreference,
        householdSize: user.householdSize,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("[Login Error]:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to authenticate user",
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { name, dietaryPreference, householdSize, avatar } = req.body || {};

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name.trim();
    if (dietaryPreference) user.dietaryPreference = dietaryPreference;
    if (householdSize) user.householdSize = householdSize;
    if (avatar) user.avatar = avatar;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dietaryPreference: user.dietaryPreference,
        householdSize: user.householdSize,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("[Update Profile Error]:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
