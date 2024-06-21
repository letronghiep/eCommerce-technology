"use strict";
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { OK, CREATED } = require("../utils/success.response");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const cartModel = require("../models/cart.model");

const getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    user_id: req.user.id,
  });

  if (!cart) throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

  return new OK({
    message: ReasonPhrases.OK,
    metadata: cart,
  }).send(res);
});

const addItemToCart = catchAsync(async (req, res, next) => {
  // const product_id = req.body.product_id;
  // const quantity = Number.parseInt(req.body.quantity) || 1;
  // const foundProduct = await Product.findOne({
  //     _id: product_id,
  // });
  // if (!foundProduct)
  //     throw new ApiError(StatusCodes.NOT_FOUND, 'Product Not Found');

  // const price = foundProduct.price;

  // let cart = await Cart.findOne({ user_id: req.user.id }).populate({
  //     path: 'items.product_id',
  //     select: 'id name price',
  // });

  // if (cart) {
  //     const indexFound = cart.items.findIndex(
  //         (item) => item.product_id._id.toString() === product_id
  //     );

  //     if (indexFound !== -1) {
  //         cart.items[indexFound].quantity =
  //             cart.items[indexFound].quantity + quantity;
  //         cart.items[indexFound].price = price;
  //         cart.items[indexFound].total =
  //             cart.items[indexFound].quantity * price;
  //     } else if (quantity > 0) {
  //         cart.items.push({
  //             product_id: product_id,
  //             quantity: quantity,
  //             price: price,
  //             total: Number.parseInt(price * quantity),
  //         });
  //     } else
  //         throw new ApiError(
  //             StatusCodes.BAD_REQUEST,
  //             ReasonPhrases.BAD_REQUEST
  //         );
  // }
  const user_id = req.user.id;
  console.log(user_id);
  const data = req.body;
  try {
    let cart = await cartModel.findOne({ user_id });
    if (!cart) {
      cart = new cartModel({
        user_id,
        items: [],
      });
    }
    data.forEach((cartItem) => {
      const { product_id, quantity, price } = cartItem;
      const itemIndex = cart.items.findIndex(
        (prod) => prod.product_id.toString() === product_id
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].total = Number(price) * quantity;
      } else {
        cart.items.push({
          product_id,
          quantity,
          price,
          total: Number(price) * quantity,
        });
      }
    });
    await cart.save();
    return new CREATED({
      message: ReasonPhrases.CREATED,
      metadata: cart,
    }).send(res);
  } catch (error) {
    console.log(error);
    throw new ApiError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST);
  }
});

const deleteItemToCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user_id: req.user.id }).populate({
    path: "items.product_id",
    select: "id name price",
  });

  if (!cart) throw new ApiError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

  const productId = req.body.productId;
  const indexFound = cart.items.findIndex(
    (item) => item.product_id._id.toString() === productId
  );

  if (indexFound !== -1) {
    cart.items.splice(indexFound, 1);
  } else
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Product code ${productId} was not found in the cart`
    );

  cart.save();
  return new OK({
    message: "Successfully deleted all products in the cart",
    metadata: cart,
  }).send(res);
});

const emptyCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user_id: req.user.id });
  if (!cart) throw new Error(error);

  cart.items = [];
  cart.total_cart = 0;
  cart.save();

  return new OK({
    message: "Successfully deleted all products in the cart",
    metadata: cart,
  }).send(res);
});

module.exports = { getCart, addItemToCart, deleteItemToCart, emptyCart };
