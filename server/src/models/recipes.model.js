import mongoose from "mongoose";
import slugify from "slugify";
import { nanoid } from "nanoid";

const RecipesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  imageUrl: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  reports: {
    type: [
      {
        message: String,
        reportedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
});

// Middleware to generate a slug before saving a new recipe
RecipesSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    const randomString = nanoid(5); // Generate a 5-character random string
    this.slug = `${slugify(this.name, {
      lower: true,
      strict: true,
    })}-${randomString}`;
  }
  next();
});

export const RecipesModel = mongoose.model("recipes", RecipesSchema);
