import { Document } from 'mongoose';

const defaultPageField = {
  meta: {
      title: {
          type: String, 
      },
      description: {
          type: String, 
      },
      keywords: {
          type: String, 
      }
  },
  template: {
    type: String
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true,
    required: '{PATH} is required!'
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  body: {
    type: String
  },
  subtitle: {
    type: String
  },
  subbody: {
    type: String
  },
  ord: {
    type: Number
  },
  published: {
    type: Boolean
  },
  icon: {
    type: String
  }
};

interface IBasePage extends Document {
  meta: any;
  title: string;
  description: string;
  body: string;
  subtitle: string;
  subbody: string;
  slug: string;
  ord: number;
  published: boolean;
  icon: string;
}

export { defaultPageField, IBasePage }