import { Schema } from 'mongoose';
import { IImage } from './image'

import { IBasePage, defaultPageField} from './basePage'

const page: Schema = new Schema(Object.assign(defaultPageField, {
    _id: Schema.Types.ObjectId,
    resources: [
       { type: { type: String } }
    ],
    images: [
        { type: Schema.Types.ObjectId, ref: 'Image' }
    ]
}))

page.index({'$**': 'text'});

interface IPage extends IBasePage {
    images: IImage[];
}

export { 
    page,
    IPage
}