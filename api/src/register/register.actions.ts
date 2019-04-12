import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { User } from './../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterActions {

  async create(dto: any, tasks_data: Map<string, any>): Promise<void> {

    const user_repo = getConnection().getRepository(User);
    const user = user_repo.create();

    // update properties
    user.name = dto.name;
    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, 10);
    user.is_deleted = false;
    user.jwt_secret = '';
    user.last_login = new Date();
    user.is_deleted = false;

    // update metadata
    user.modified_date = new Date();
    user.created_date = new Date();

    // save update
    await getConnection().getRepository(User).save(user);

    // store user in request context
    tasks_data.set('user', user);

    return Promise.resolve();
  }

}