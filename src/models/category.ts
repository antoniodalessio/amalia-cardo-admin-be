import { Schema } from 'mongoose';
import { IBasePage, defaultPageField} from './basePage'

const category: Schema = new Schema(Object.assign(defaultPageField, {
    _id: Schema.Types.ObjectId,
    text: {
        type: String
    },
    category_name: {
        type: String
    },
    thumb_preview: {
        type: String
    },
    parent: {
        type: Schema.Types.ObjectId
    },
    template: { type: String, default: 'category' },
    enabled: { type: Boolean, default: true},
    hasSubcategory: {
        type: Boolean,
    }
}))

category.index({'$**': 'text'});

interface ICategory extends IBasePage {
    category_name: string;
    thumb_preview: string;
    hasSubcategory: boolean;
    parent: ICategory;
    template: string;
    enabled: boolean;
}

export { 
    category,
    ICategory,
}