const express = require("express");
const router = express.Router();

const {
  getAllProducts, 
  createProduct,
  updateProduct,
  deleteProduct,
  newProduct,
  editProduct
} = require("../controllers/products");


router.get ("/", getAllProducts); //display all the product listings belonging to this user
router.post ("/", createProduct); //Add a new product listing
router.get ("/new", newProduct); //put up the form to create a new entry
router.get ("/edit/:id", editProduct); //get a particulat entry and show it in the edit box
router.post ("/update/:id", updateProduct); //update a particular entry
router.post ("/delete/:id", deleteProduct); //delete an entry 


module.exports = router;