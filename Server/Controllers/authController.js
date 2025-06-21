const User = require("../models/User");

// ✅ Signup
exports.signup = async (req, res) => {
  const { username, password, role } = req.body;
  const requesterRole = req.headers["role"];

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const adminExists = await User.exists({ role: "admin" });

    if (adminExists && requesterRole !== "admin") {
      return res.status(403).json({ error: "Only admin can create users" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = new User({ username, password, role });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login error" });
  }
};

// ✅ Check if admin exists
exports.checkAdminExists = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" });
    res.json({ exists: !!admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check admin status" });
  }
};

// ✅ Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const requesterRole = req.headers["role"];
    if (requesterRole !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

   const users = await User.find({}, "username role password");

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


exports.deleteUser = async (req, res) => {
  const { username } = req.params;
  const requesterRole = req.headers["role"];

  if (requesterRole !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    await User.deleteOne({ username });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
