import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModal } from "../Models/User.js";
import { generateRandomAvatar } from "../utils/avatarGenerator.js";
import { Subscription } from "../Models/Subscription.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import path from "path";
import { SavingPlan } from "../Models/Savings.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTPMail, welcomeMessage } from "../utils/emailService.js";
import dotenv from "dotenv";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const exists = await userModal.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const nameExists = await userModal.findOne({ name });
    if (nameExists) {
      return res.status(400).json({ message: "Name already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePicture = req.body.profilePicture || generateRandomAvatar();

    const user = new userModal({
      name,
      email,
      password: hashedPassword,
      profilePicture,
      role,
    });

    const createdUser = await user.save();

    if (role === "user") {
      const subscription = new Subscription({
        user: createdUser._id,
        plan: "free",
      });

      await subscription.save();
    }

    const entries = Array.from({ length: 365 }, (_, i) => ({
      day: i + 1,
      amount: i + 1,
      saved: false,
      savedAt: null,
    }));

    const savingPlan = new SavingPlan({
      user: createdUser._id,
      entries,
    });

    await savingPlan.save();

    await welcomeMessage(email, "Welcome to Piggy365", name);

    res
      .status(201)
      .json({ status: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { emailorName, password } = req.body;
    const user = await userModal.findOne({
      $or: [{ email: emailorName }, { name: emailorName }],
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is Not Match" });
    }

    const subscription = await Subscription.findOne({ user: user._id });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        subscription: subscription,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      status: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        subscription,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const savingPlan = await SavingPlan.findOne({ user: userId });

    if (!savingPlan) {
      return res.status(404).json({ message: "Saving plan not found" });
    }

    const pendingEntries = savingPlan.entries.filter((entry) => !entry.saved);
    const totalDaysPending = pendingEntries.length;

    const { entries, ...savingsWithoutEntries } = savingPlan.toObject();

    res.status(200).json({
      status: true,
      message: "Dashboard data fetched successfully",
      data: {
        savings: {
          ...savingsWithoutEntries, // include all savings data except entries
          totalDaysPending, // add totalDaysPending here
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { name, email, phone } = req.body;
    const user = await userModal.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Email validation
    if (email && email !== user.email) {
      const emailUsed = await userModal.findOne({ email });
      if (emailUsed && emailUsed._id.toString() !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;

    // Handle profile picture update
    if (req.file) {
      // Check if the old profile picture exists, then delete it
      if (user.profilePicture) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          "profilepics",
          path.basename(user.profilePicture)
        );

        try {
          await fs.promises.access(oldImagePath, fs.constants.F_OK);
          await fs.promises.unlink(oldImagePath);
        } catch (err) {
          console.error("Failed to delete old image:", err);
        }
      }

      // Add new profile picture
      updates.profilePicture = `/uploads/profilepics/${req.file.filename}`;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Update the user
    const updatedUser = await userModal.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "User updated successfully",
        updatedUser,
      });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModal.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const subscription = await Subscription.findOne({ user: user._id });

    res.status(200).json({
      status: true,
      message: "User fetched successfully",
      user: {
        ...user._doc,
        subscription,
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModal.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.profilePicture) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "profilepics",
        path.basename(user.profilePicture)
      );

      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Failed to delete image:", err);
        });
      }
      // } else {
      //   console.log("Image not found:", imagePath);
      // }
    }

    await Subscription.deleteMany({ user: id });
    await userModal.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const searchRegex = new RegExp(search, "i");

    let query = {
      role: { $ne: "admin" }, // Exclude users with role = admin
    };

    if (search.trim() !== "") {
      query.$or = [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ];

      // If search looks like a number, include phone match too
      if (/^[0-9]+$/.test(search)) {
        query.$or.push({ phone: Number(search) });
      }
    }

    const totalUsers = await userModal.countDocuments(query);
    const users = await userModal
      .find(query)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const userIds = users.map((user) => user._id);
    const subscriptions = await Subscription.find({ user: { $in: userIds } });

    const userWithSubscriptions = users.map((user) => {
      const userSubs = subscriptions.filter(
        (sub) => sub.user.toString() === user._id.toString()
      );
      return {
        ...user._doc,
        subscription: userSubs.length > 0 ? userSubs[0] : null,
      };
    });

    res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      users: userWithSubscriptions,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendOtpForPasswordUpdate = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await userModal.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = { code: otp, expiresAt };
    await user.save();

    await sendOTPMail(email, "Piggy365 - Password Change OTP", otp);

    res.status(200).json({ status: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await userModal.findOne({
      "otp.code": otp,
      "otp.expiresAt": { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ Generate a short-lived token just for password reset
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "10m" }
    );

    // ✅ Store token and expiration in DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    user.otp = undefined; // Optional: clear OTP
    await user.save();

    res.status(200).json({
      status: true,
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, token } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ✅ Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await userModal.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.otp = undefined; // Optional: clear OTP
    await user.save();

    res
      .status(200)
      .json({ status: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};
