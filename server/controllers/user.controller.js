import User from "../models/user.model.js";


/**
 * GET /api/users
 * Admin only. Supports:
 *   ?page=1&limit=9
 *   &status=all|verified|unverified
 *   &role=all|teacher|student|admin
 *   &search=foo
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 9));
    const status = req.query.status || "all";
    const role = req.query.role || "all";
    const search = (req.query.search || "").trim();

    // Build query
    const query = {};

    if (status === "verified") query.isVerified = true;
    else if (status === "unverified") query.isVerified = false;


    if (role !== "all") query.role = role;

    if (search) {
      // Escape regex special chars to avoid breaking the query
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { fullName: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -emailVerificationToken -resetPasswordToken -emailVerificationTokenExpiresAt -resetPasswordExpiresAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        data: {
            users,
            total,
            page,
            pages: Math.ceil(total / limit) || 1,
            limit,
        }
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    next(error)
  }
};

/**
 * GET /api/users/:id
 * Admin only. Single user detail.
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -emailVerificationToken -resetPasswordToken")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

/**
 * PATCH /api/users/:id/role
 * Admin only. Change a user's role.
 */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["teacher", "student", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password -emailVerificationToken -resetPasswordToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("updateUserRole error:", err);
    res.status(500).json({ message: "Failed to update role" });
  }
};

/**
 * DELETE /api/users/:id
 * Admin only.
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};