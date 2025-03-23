import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Todo extends Document {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ default: false })
    completed: boolean;

    // Optional deadline field
    @Prop()
    deadline?: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
