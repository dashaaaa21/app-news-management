import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsDocument = News & Document;

@Schema({ timestamps: true })
export class News {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    body: string;

    @Prop({ required: true })
    author: string;

    @Prop({ default: () => new Date().toISOString() })
    date: string;

    @Prop({ default: '' })
    image: string;

    @Prop({ default: '' })
    category: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
// updated
