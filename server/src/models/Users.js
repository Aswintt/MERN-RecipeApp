import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedRecipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipes",
    },
  ],
  isAdmin: { type: Boolean, default: false }, // Admin flag
  isBanned: { type: Boolean, default: false }, // Ban status
});

export const UserModel = mongoose.model("users", UserSchema);
