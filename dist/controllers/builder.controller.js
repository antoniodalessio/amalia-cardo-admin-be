"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assemble_1 = __importDefault(require("./../assemble"));
const ftp_1 = __importDefault(require("./../utils/ftp"));
const models_1 = require("../models");
var fs = require('fs');
const SeoHelper_1 = __importDefault(require("../helpers/SeoHelper"));
const array_1 = require("../utils/array");
class BuilderController {
    constructor() {
        this.fileToUpload = [];
        this.initAssemble();
        this.clientFtp = new ftp_1.default(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
        this.seoHelper = new SeoHelper_1.default();
    }
    initAssemble() {
        return __awaiter(this, void 0, void 0, function* () {
            this.assemble = new assemble_1.default({
                templatesPath: process.env.TEMPLATES_PATH,
                partialsPath: `${process.env.TEMPLATES_PATH}/partials/`,
                defaultLayout: `${process.env.TEMPLATES_PATH}/layout/default.hbs`,
                defaultFolder: `${process.env.SITE_PATH}`
            });
        });
    }
    buildSitemapXml() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = (yield models_1.Category.find()).map((item) => item ? item.toObject() : null);
            const products = (yield models_1.Product.find().populate('images')).map((item) => item ? item.toObject() : null);
            const pages = (yield models_1.Page.find()).map((item) => item ? item.toObject() : null);
            const resources = categories.concat(products).concat(pages);
            const data = {
                resources: resources.filter((resource) => resource.template != 'index' && resource.template != '404'),
                baseUrl: process.env.SITE_URL,
                slug: 'sitemap'
            };
            yield this.assemble.renderSimple('sitemap', data, "xml");
            yield this.clientFtp.upload(`${process.env.SITE_PATH}sitemap.xml`, `${process.env.FTP_FOLDER}sitemap.xml`, 755);
        });
    }
    getSubcategories(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.Category.find({ parent: id }).sort('ord')).map((item) => item ? item.toObject() : null);
        });
    }
    getProductsOfCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.Product.find({ category: id }).sort('ord').populate('images')).map((item) => item ? item.toObject() : null);
        });
    }
    getProductsFromSubCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = (yield models_1.Category.find({ parent: id }).sort('ord')).map((item) => item ? item.toObject() : null);
            let products = [];
            for (const category of categories) {
                products = products.concat((yield models_1.Product.find({ category: category._id }).populate('images')).map((item) => item ? item.toObject() : null));
            }
            return array_1.shuffle(products);
        });
    }
    addResources(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page.hasOwnProperty('resources') && page.resources.length > 0) {
                let resources = {};
                for (const resource of page.resources) {
                    if (resource.type == 'category') {
                        // find main category
                        const parentCategory = yield models_1.Category.findOne({ parent: null });
                        const _id = parentCategory.toObject()._id;
                        // get subcategory of main category
                        const categories = (yield models_1.Category.find({ parent: _id }).sort('ord')).map((item) => item ? item.toObject() : null);
                        for (const category of categories) {
                            const products = (yield models_1.Product.find({ category: category._id }).populate('images')).map((item) => item ? item.toObject() : null);
                            if (products.length > 0) {
                                const subcategoryProduct = yield this.getProductsFromSubCategory(category._id);
                                category.products = array_1.shuffle(products.concat(subcategoryProduct));
                            }
                            else {
                                // load products randomly? from subcategory 
                                category.products = yield this.getProductsFromSubCategory(category._id);
                            }
                        }
                        resources.categories = categories;
                    }
                    if (resource.type == 'review') {
                        const reviews = (yield models_1.Review.find(resource.filter).sort('_id')).map((item) => item ? item.toObject() : null);
                        resources.reviews = reviews;
                    }
                    if (resource.type == 'fabric') {
                        const fabrics = (yield models_1.Fabric.find(resource.filter).sort('_id')).map((item) => item ? item.toObject() : null);
                        resources.fabrics = fabrics;
                    }
                }
                page.resources = resources;
            }
            return page;
        });
    }
    buildStaticPages() {
        return __awaiter(this, void 0, void 0, function* () {
            const pages = (yield models_1.Page.find()).map((item) => item ? item.toObject() : null);
            const pags = [];
            for (let page of pages) {
                page = yield this.addResources(page);
                page.pageImage = `${process.env.SITE_URL}/images/logo.png`;
                pags.push(page);
            }
            return pags;
        });
    }
    uploadStaticPages(pages, unpublished) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let page of pages) {
                if (!unpublished || !page.published) {
                    yield this.assemble.render(page.template, page);
                    this.fileToUpload.push(page.slug);
                    yield models_1.Page.updateOne({ _id: page._id }, { published: true });
                }
            }
        });
    }
    buildBreadCrumb(cat, array = []) {
        return __awaiter(this, void 0, void 0, function* () {
            array.push({
                slug: cat.slug,
                label: cat.category_name
            });
            if (!cat.parent) {
                return array;
            }
            else {
                const parentCat = (yield models_1.Category.findOne({ _id: cat.parent })).toObject();
                return yield this.buildBreadCrumb(parentCat, array);
            }
        });
    }
    buildCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            let categories = yield models_1.Category.find().sort('ord');
            let cats = [];
            for (const category of categories) {
                let cat = category.toObject();
                cat.products = yield this.getProductsOfCategory(category._id);
                cat.pageImage = `${process.env.SITE_URL}${process.env.IMAGES_PATH}${cat.thumb_preview}_normal.jpg`;
                cat.products.forEach((product) => {
                    product.thumb = product.hasOwnProperty("images") && product.images.length > 0 ? product.images[0].uri : null;
                });
                cat.breadcrumb = (yield this.buildBreadCrumb(cat)).reverse();
                //if(category.hasSubcategory) {
                cat.categories = yield this.getSubcategories(category._id);
                //}
                cats.push(cat);
            }
            return cats;
        });
    }
    uploadCategories(categories, unpublished) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const cat of categories) {
                if (!unpublished || !cat.published) {
                    cat.hasSubcategory ? yield this.assemble.render("categories", cat) : yield this.assemble.render("category", cat);
                    this.fileToUpload.push(cat.slug);
                    yield models_1.Category.updateOne({ _id: cat._id }, { published: true });
                }
            }
        });
    }
    renderFabrics(product) {
        return __awaiter(this, void 0, void 0, function* () {
            if (product.fabrics) {
                const fabrics = {
                    internal: product.fabrics.internal.map((item) => item && typeof item.toObject == 'function' ? item.toObject() : null),
                    external: product.fabrics.external.map((item) => item && typeof item.toObject == 'function' ? item.toObject() : null),
                };
                const tmpData = {
                    slug: product.slug + '_fabrics',
                    fabrics
                };
                yield this.assemble.renderSimple('fabrics-popup', tmpData);
            }
        });
    }
    buildProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            let products = yield models_1.Product.find().populate({ path: 'images', options: { sort: { 'ord': 1 } } }).populate('fabrics.internal fabrics.external category');
            let prods = [];
            for (const product of products) {
                let prod = product.toObject();
                prod.resources = [{ type: 'review', filter: { product: prod._id } }];
                prod = yield this.addResources(prod);
                prod.pageImage = `${process.env.SITE_URL}${process.env.IMAGES_PATH}${prod.images[0].uri}_normal.jpg`;
                const category = (yield models_1.Category.findOne({ _id: prod.category })).toObject();
                prod.breadcrumb = (yield this.buildBreadCrumb(category)).reverse();
                prod.breadcrumb.push({ slug: prod.slug, label: prod.title });
                prod.fabrics = product.fabrics;
                prods.push(prod);
            }
            return prods;
        });
    }
    uploadProducts(products, unpublished) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const product of products) {
                if (!unpublished || !product.published) {
                    if (product.fabrics.internal.length || product.fabrics.external.length) {
                        yield this.renderFabrics(product);
                        this.fileToUpload.push(`${product.slug}_fabrics`);
                    }
                    yield this.assemble.render("product", product);
                    this.fileToUpload.push(product.slug);
                    yield models_1.Product.updateOne({ _id: product._id }, { published: true });
                }
            }
        });
    }
    build(unpublished) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.uploadCategories(yield this.buildCategories(), unpublished);
            yield this.uploadProducts(yield this.buildProducts(), unpublished);
            yield this.uploadStaticPages(yield this.buildStaticPages(), unpublished);
        });
    }
    upload() {
        return __awaiter(this, void 0, void 0, function* () {
            let filesUploaded = [];
            for (const file of this.fileToUpload) {
                yield this.clientFtp.upload(`${process.env.SITE_PATH}${file}.html`, `${process.env.FTP_FOLDER}${file}.html`, 755);
                filesUploaded.push(`${file}`);
            }
            this.fileToUpload = [];
            return { filesUploaded };
        });
    }
    clearFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            let filesToRemove = yield fs.readdirSync(`${process.env.SITE_PATH}`).filter((file) => {
                return file.match(/.html/ig);
            });
            for (const file of filesToRemove) {
                yield fs.unlinkSync(`${process.env.SITE_PATH}${file}`);
            }
        });
    }
    renderBySlug(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const allPages = [yield this.buildCategories(), yield this.buildStaticPages(), yield this.buildProducts()].reduce((acc, curr) => {
                return acc.concat(curr);
            });
            for (let page of allPages) {
                page = yield this.addResources(page);
            }
            name = name.replace(".html", "");
            const page = allPages.filter(resource => resource.slug == name);
            console.log(page[0].template);
            const result = yield this.assemble.renderPage(page[0]);
            return result;
        });
    }
    publish(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let unpublished = false;
            if (req.query.hasOwnProperty('unpublished')) {
                unpublished = true;
            }
            yield this.build(unpublished);
            let result = yield this.upload();
            if (process.env.ENV == 'prod') {
                yield this.clearFolder();
            }
            yield this.buildSitemapXml();
            yield this.seoHelper.uploadHtaccess();
            yield this.seoHelper.downloadHtaccess();
            res.status(200).json(result);
        });
    }
}
exports.default = BuilderController;
//# sourceMappingURL=builder.controller.js.map