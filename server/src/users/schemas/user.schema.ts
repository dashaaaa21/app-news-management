import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ enum: ['male', 'female', 'other'], default: 'other' })
    gender: string;

    @Prop({ default: '' })
    dateOfBirth: string;

    @Prop({ default: '' })
    position: string;

    @Prop({ default: '' })
    hireDate: string;

    @Prop({ default: '' })
    phone: string;

    @Prop({ default: '' })
    bio: string;

    @Prop({
        enum: ['admin', 'user', 'manager', 'administrator', 'reporter'],
        default: 'user',
    })
    role: string;

    @Prop({ default: '' })
    profilePhoto: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
