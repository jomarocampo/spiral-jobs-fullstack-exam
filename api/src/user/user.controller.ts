import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, ListAllEntities } from './user.dto';

@Controller('user')
export class UserController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return 'This action adds a new User';
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all User (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} User`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} User`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} User`;
  }
}