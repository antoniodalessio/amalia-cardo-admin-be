import { Schema, Document } from 'mongoose';
import { ICustomer } from './customer';
import { IProduct } from './product';

const submission: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    text: {
        type: String,
    },
    requestAt: Date,
    customer: {
        type: Schema.Types.ObjectId, ref: 'Customer'
    },
    product: {
        type: Schema.Types.ObjectId, ref: 'Product'
    }
})

submission.index({'$**': 'text'});

interface ISubmission extends Document {
    text: string;
    customer: ICustomer,
    requestAt: Date,
    product?: IProduct
}

export { 
    submission,
    ISubmission,
}