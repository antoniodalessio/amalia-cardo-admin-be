import { model } from 'mongoose';

import { user, IUser } from './user'
import { page, IPage } from './page'
import { category, ICategory } from './category'
import { product, IProduct } from './product'
import { image, IImage } from './image'
import { customer, ICustomer } from './customer'
import { fabric, IFabric } from './fabric'
import { review, IReview } from './review'
import { ISubmission, submission } from './submission';
import { IOrder, order } from './order';

let User = model<IUser>('User', user)
let Page = model<IPage>('Page', page)
let Category = model<ICategory>('Category', category)
let Product = model<IProduct>('Product', product)
let Image = model<IImage>('Image', image)
let Customer = model<ICustomer>('Customer', customer)
let Submission = model<ISubmission>('Submission', submission)
let Fabric = model<IFabric>('Fabric', fabric)
let Review = model<IReview>('Review', review)
let Order = model<IOrder>('Order', order)

export {
    Page,
    Category,
    ICategory,
    Product,
    IProduct,
    Image,
    User,
    IUser,
    Customer,
    Fabric,
    IFabric,
    Review,
    IReview,
    Submission,
    ISubmission,
    Order,
    IOrder,
}