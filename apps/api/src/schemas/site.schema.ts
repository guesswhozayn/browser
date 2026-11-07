import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SiteDocument = HydratedDocument<Site>;

@Schema({ timestamps: true })
export class Site {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  html: string;

  @Prop({ required: true })
  textContent: string;

  @Prop({ required: true, trim: true })
  author: string;

  updatedAt?: Date;
  createdAt?: Date;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
SiteSchema.index({ address: 1 }, { unique: true });
SiteSchema.index(
  {
    title: 'text',
    textContent: 'text',
    address: 'text',
    author: 'text',
  },
  {
    weights: {
      title: 5,
      address: 4,
      textContent: 2,
      author: 1,
    },
    name: 'site_text_index',
  },
);

