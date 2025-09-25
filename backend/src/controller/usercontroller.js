import axios from "axios";
import User from "../model/user.js";
import jwt from "jsonwebtoken";

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

    const user = await User.create({
      name,
      email,
      password,
      authProvider: "local",
      isVerified: true,
    });
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

    if (!user.password) {
      return res.status(400).json({
        message: "This account was created with social login. Please use that provider.",
      });
    }

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid email or password" });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      authProvider: user.authProvider,
      picture: user.picture,
    });
  } catch (err) {
    next(err);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.body._id; // Adjust as needed for your auth
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updateFields = {};
    const allowed = ["name", "username", "bio", "photo", "language", "timezone"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateFields[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      photo: user.photo,
      language: user.language,
      timezone: user.timezone,
    });
  } catch (err) {
    next(err);
  }
};

export const microsoftLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    const microsoftUser = await verifyMicrosoftToken(accessToken);
    let user = await User.findOne({ email: microsoftUser.email });

    if (!user) {
      user = new User({
        email: microsoftUser.email,
        name: microsoftUser.name,
        isVerified: true,
        authProvider: "microsoft",
        microsoftId: microsoftUser.id,
      });
    } else {
      if (!user.microsoftId) user.microsoftId = microsoftUser.id;
      if (!user.isVerified) user.isVerified = true;
      if (!user.password) user.authProvider = "microsoft";
    }

    await user.save();

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Missing JWT configuration",
      });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        authProvider: user.authProvider,
        picture: user.picture,
        token: token
      }
    });

  } catch (error) {
    console.error('Microsoft login error:', error);
    res.status(401).json({
      success: false,
      message: 'Microsoft authentication failed'
    });
  }
};

const verifyMicrosoftToken = async (accessToken) => {
  try {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const userData = response.data;
    
    return {
      id: userData.id,
      email: userData.mail || userData.userPrincipalName,
      name: userData.displayName,
      givenName: userData.givenName,
      surname: userData.surname
    };

  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid Microsoft token');
  }
}

