import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.schema';

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    async findAll(): Promise<Todo[]> {
        return this.todoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Todo> {
        return this.todoService.findOne(id);
    }

    @Post()
    async create(@Body() body: Partial<Todo>): Promise<Todo> {
        return this.todoService.create(body);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: Partial<Todo>): Promise<Todo> {
        return this.todoService.update(id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
        return this.todoService.delete(id);
    }

    // Endpoint to mark a single todo as complete
    @Patch(':id/complete')
    async markComplete(@Param('id') id: string): Promise<Todo> {
        return this.todoService.markComplete(id);
    }

    // Endpoint to mark multiple todos as complete
    @Post('complete')
    async markMultipleComplete(@Body() body: { ids: string[] }): Promise<{ modifiedCount: number }> {
        return this.todoService.markMultipleComplete(body.ids);
    }

    // Endpoint to get a report by period (day, month, or year)
    @Get('report')
    async getReport(@Query('period') period: 'day' | 'month' | 'year'): Promise<any> {
        return this.todoService.getReport(period);
    }
}
