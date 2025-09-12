import User from "../model/user.js";

export const registerUser = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    name = String(name || "").trim();
    email = String(email || "").trim().toLowerCase();
    password = String(password || "").trim();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: true,
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    email = String(email || "").trim().toLowerCase();
    password = String(password || "").trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid email or password" });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: true,
    });
  } catch (err) {
    next(err);
  }
};
