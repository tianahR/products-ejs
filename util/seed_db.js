const Product = require("../models/Product")
const User = require("../models/User")
const faker = require("@faker-js/faker").fakerEN_US
const FactoryBot = require('factory-bot');
require('dotenv').config()

const testUserPassword = faker.internet.password()
const factory = FactoryBot.factory
const factoryAdapter = new FactoryBot.MongooseAdapter()
factory.setAdapter(factoryAdapter)

//define a factory for Model Product 
factory.define('product',Product, {
    name:()=>faker.Product.name,
    price:()=>faker.Product.price,
    description:()=>faker.Product.description,
    type:()=>["T-shirt",
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
    "Others"][Math.floor(3 * Math.random())],
    size:()=>[
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
    ][Math.floor(3 * Math.random())],
    gender:()=>[
        "Male",
        "Female",       
      ][Math.floor(2 * Math.random())]
} 
)

//define a factory for Model User 
factory.define('user', User, {
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password()
})

const seed_db = async () => {
  let testUser=null;
  try {
    const mongoURL = process.env.MONGO_URI_TEST
    await Product.deleteMany({}) // deletes all products records
    await User.deleteMany({}) // and all the users
    testUser = await factory.create('user', { password: testUserPassword })
    await factory.createMany('product', 20, {createdBy: testUser._id}) // put 20 products entries in the database.
  } catch(e) {
    console.log("database error")
    console.log(e.message);
    throw(e);
  }
  return testUser;
}

module.exports = { testUserPassword, factory, seed_db }