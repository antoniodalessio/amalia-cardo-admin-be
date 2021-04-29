import { Schema, Document } from 'mongoose';

const customer: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    firstname: {
        type: String
    },
    lastname: { 
        type: String, 
    },
    address: {
        type: String
    },
    email: {
        type: String
    },
    cell: {
        type: String,
    },
    info: {
        type: String,
    },
    ord: {
        type: Number
    }
})

customer.index({'$**': 'text'});

interface ICustomer extends Document {
    firstname: string;
    lastname: string;
    address: string;
    cell: string;
    ord: number;
}

export { 
    customer,
    ICustomer
}