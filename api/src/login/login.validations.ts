import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { BadRequestException } from '../app.exceptions';
import { LoginExceptions } from './login.exceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginValidations {

  async validate_user_is_valid(dto: any, tasks_data: Map<string, any>): Promise<void> {

    const user = tasks_data.get('user') as User;

    // check if user exists
    if (!user) {
      throw new BadRequestException(LoginExceptions.UserNotExisting, {});
    }

    // check if user is not deleted
    if (user.is_deleted) {
      throw new BadRequestException(LoginExceptions.UserArchived, {});
    }

    return Promise.resolve();
  }

  async validate_user_password_matches(dto: any, tasks_data: Map<string, any>): Promise<void> {

    // get user from request cache
    const user = tasks_data.get('user');

    const match = await bcrypt.compare(dto.password, user.password);
    // check if password matches user's password from db
    if (!match) {
      throw new BadRequestException(LoginExceptions.UserPasswordError, {});
    }

    return Promise.resolve();
  }

}