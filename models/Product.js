const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      maxlength: [5, "Product price cannot exceed 5 characters"],
      default: 0.0,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    reviews: [{ body: String, date: Date }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    type: {
      type: String,
      enum: [
        "T-shirt",
        "Shirt",
        "Sweater",
        "Tank Top",
        "Polo Shirt",
        "Hoodie",
        "Jeans",
        "Pants",
        "Shorts",
        "Skirt",
        "Leggins",
        "Dress",
        "Jacket",
        "Coat",
        "Blazer",
        "Raincoat",       
        "Panties",
        "Briefs",
        "Bras",
        "Others"
      ],
      default: "Others",
    },
    size: {
      type: String,
      enum: [
        "2T",
        "3T",       
        "4T",
        "YS",
        "YM",
        "YL",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "1X",
        "2X",
        "3X",
        "1XL",
        "2XL"
        
      ],
      default: "M",
    },
    genre: {
      type: String,
      enum: [
        "Male",
        "Female",       
      ],
      default: "Female",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);