import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './todo.schema';

@Injectable()
export class TodoService {
    private readonly logger = new Logger(TodoService.name);

    constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) { }

    async findAll(): Promise<Todo[]> {
        this.logger.log('Fetching all todos');
        return this.todoModel.find().exec();
    }

    async findOne(id: string): Promise<Todo> {
        const todo = await this.todoModel.findById(id).exec();
        if (!todo) {
            this.logger.warn(`Todo not found with id: ${id}`);
            throw new NotFoundException('ToDo not found');
        }
        this.logger.log(`Fetched todo with id: ${id}`);
        return todo;
    }

    async create(data: Partial<Todo>): Promise<Todo> {
        const todo = new this.todoModel(data);
        const saved = await todo.save();
        this.logger.log(`Created todo: ${saved._id}`);
        return saved;
    }

    async update(id: string, data: Partial<Todo>): Promise<Todo> {
        const updated = await this.todoModel.findByIdAndUpdate(id, data, { new: true });
        if (!updated) {
            this.logger.warn(`Attempt to update non-existing todo: ${id}`);
            throw new NotFoundException('ToDo not found');
        }
        this.logger.log(`Updated todo: ${id}`);
        return updated;
    }

    async delete(id: string): Promise<{ deleted: boolean }> {
        const result = await this.todoModel.findByIdAndDelete(id);
        const success = !!result;
        if (success) {
            this.logger.warn(`Deleted todo: ${id}`);
        } else {
            this.logger.warn(`Attempt to delete non-existing todo: ${id}`);
        }
        return { deleted: success };
    }

    async markComplete(id: string): Promise<Todo> {
        const updated = await this.todoModel.findByIdAndUpdate(
            id,
            { completed: true },
            { new: true },
        );
        if (!updated) {
            this.logger.warn(`Attempt to mark non-existing todo complete: ${id}`);
            throw new NotFoundException('ToDo not found');
        }
        this.logger.log(`Marked todo as complete: ${id}`);
        return updated;
    }

    async markMultipleComplete(ids: string[]): Promise<{ modifiedCount: number }> {
        const res = await this.todoModel.updateMany(
            { _id: { $in: ids } },
            { $set: { completed: true } },
        );
        this.logger.log(`Marked ${res.modifiedCount} todos as complete`);
        return { modifiedCount: res.modifiedCount };
    }

    async getReport(period: 'day' | 'month' | 'year'): Promise<any> {
        const now = new Date();
        let startDate: Date;

        if (period === 'day') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (period === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (period === 'year') {
            startDate = new Date(now.getFullYear(), 0, 1);
        } else {
            throw new Error('Invalid period');
        }

        const completedCount = await this.todoModel.countDocuments({
            createdAt: { $gte: startDate },
            completed: true,
        });

        const notCompletedCount = await this.todoModel.countDocuments({
            createdAt: { $gte: startDate },
            completed: false,
        });

        const lateCount = await this.todoModel.countDocuments({
            createdAt: { $gte: startDate },
            completed: false,
            deadline: { $exists: true, $lt: now },
        });

        const report = {
            period,
            startDate,
            completed: completedCount,
            notCompleted: notCompletedCount,
            late: lateCount,
        };

        this.logger.debug(`Generated report: ${JSON.stringify(report)}`);
        return report;
    }
}
