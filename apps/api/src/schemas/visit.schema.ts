import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VisitDocument = HydratedDocument<Visit>;

export type VisitVia =
  | 'typed'
  | 'link'
  | 'history'
  | 'search'
  | 'back'
  | 'forward';

@Schema({ timestamps: { createdAt: 'visitedAt', updatedAt: false } })
export class Visit {
  @Prop({ required: true, trim: true })
  person: string;

  @Prop({ required: true, lowercase: true, trim: true })
  address: string;

  @Prop({
    required: true,
    enum: ['typed', 'link', 'history', 'search', 'back', 'forward'],
  })
  via: VisitVia;

  @Prop({ required: true, default: Date.now })
  visitedAt: Date;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
VisitSchema.index({ person: 1, visitedAt: -1 });
VisitSchema.index({ address: 1 });

