import { Schema, Document } from 'mongoose';

const fabric: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    cod: {
        type: String,
        required: '{PATH} is required!'
    },
    color: {
        type: String,
    },
    motif: {
        type: String,
    },
    composition: {
        type: String,
    },
    use: {
        type: String,
    },
    thumb_preview: {
        type: String
    },
    ord: {
        type: Number
    },
    active: {
        type: Boolean,
        default: true
    }, 
})

fabric.index({'$**': 'text'});

interface IFabric extends Document {
    cod: any;
    color: string;
    motif: string;
    composition: string;
    use: string;
}

export { 
    fabric,
    IFabric,
}