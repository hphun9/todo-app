import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './todo.schema';

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) { }

    async findAll(): Promise<Todo[]> {
        return this.todoModel.find().exec();
    }

    async findOne(id: string): Promise<Todo> {
        const todo = await this.todoModel.findById(id).exec();
        if (!todo) throw new NotFoundException('ToDo not found');
        return todo;
    }

    async create(data: Partial<Todo>): Promise<Todo> {
        const todo = new this.todoModel(data);
        return todo.save();
    }

    async update(id: string, data: Partial<Todo>): Promise<Todo> {
        const updated = await this.todoModel.findByIdAndUpdate(id, data, { new: true });
        if (!updated) throw new NotFoundException('ToDo not found');
        return updated;
    }

    async delete(id: string): Promise<{ deleted: boolean }> {
        const result = await this.todoModel.findByIdAndDelete(id);
        return { deleted: !!result };
    }

    // Mark a single To-Do as complete
    async markComplete(id: string): Promise<Todo> {
        const updated = await this.todoModel.findByIdAndUpdate(
            id,
            { completed: true },
            { new: true },
        );
        if (!updated) throw new NotFoundException('ToDo not found');
        return updated;
    }

    // Mark multiple To-Dos as complete
    async markMultipleComplete(ids: string[]): Promise<{ modifiedCount: number }> {
        const res = await this.todoModel.updateMany(
            { _id: { $in: ids } },
            { $set: { completed: true } },
        );
        return { modifiedCount: res.modifiedCount };
    }

    // Reporting: Count tasks by status in a given period
    async getReport(period: 'day' | 'month' | 'year'): Promise<any> {
        // Use current date to filter
        const now = new Date();
        let startDate: Date;

        // Determine start date based on the requested period
        if (period === 'day') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (period === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (period === 'year') {
            startDate = new Date(now.getFullYear(), 0, 1);
        } else {
            throw new Error('Invalid period');
        }

        // Count completed tasks added after the startDate
        const completedCount = await this.todoModel.countDocuments({
            createdAt: { $gte: startDate },
            completed: true,
        });

        // Count not completed tasks added after the startDate
        const notCompletedCount = await this.todoModel.countDocuments({
            createdAt: { $gte: startDate },
            completed: false,
        });

        // Late tasks: deadline exists, is before now and task is not complete
        const lateCount = await this.todoModel.countDocuments({
            createdAt: { $gte: startDate },
            completed: false,
            deadline: { $exists: true, $lt: now },
        });

        return {
            period,
            startDate,
            completed: completedCount,
            notCompleted: notCompletedCount,
            late: lateCount,
        };
    }
}
