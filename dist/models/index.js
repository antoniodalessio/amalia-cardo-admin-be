"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.Submission = exports.Review = exports.Fabric = exports.Customer = exports.User = exports.Image = exports.Product = exports.Category = exports.Page = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("./user");
const page_1 = require("./page");
const category_1 = require("./category");
const product_1 = require("./product");
const image_1 = require("./image");
const customer_1 = require("./customer");
const fabric_1 = require("./fabric");
const review_1 = require("./review");
const submission_1 = require("./submission");
const order_1 = require("./order");
let User = mongoose_1.model('User', user_1.user);
exports.User = User;
let Page = mongoose_1.model('Page', page_1.page);
exports.Page = Page;
let Category = mongoose_1.model('Category', category_1.category);
exports.Category = Category;
let Product = mongoose_1.model('Product', product_1.product);
exports.Product = Product;
let Image = mongoose_1.model('Image', image_1.image);
exports.Image = Image;
let Customer = mongoose_1.model('Customer', customer_1.customer);
exports.Customer = Customer;
let Submission = mongoose_1.model('Submission', submission_1.submission);
exports.Submission = Submission;
let Fabric = mongoose_1.model('Fabric', fabric_1.fabric);
exports.Fabric = Fabric;
let Review = mongoose_1.model('Review', review_1.review);
exports.Review = Review;
let Order = mongoose_1.model('Order', order_1.order);
exports.Order = Order;
//# sourceMappingURL=index.js.map