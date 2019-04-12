import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './../entities/user.entity';
import { executeReadQuery } from './../app.util';

@Injectable()
export class UserActions {

  async cache_user(dto: any, tasks_data: Map<string, any>): Promise<void> {

    const user = getConnection().getRepository(User).findOne({
        where: {
            id: parseInt(dto.params_id, 10),
        }
    });

    // store user in tasks data cache
    tasks_data.set('user', user);
  }

  async cache_users(dto: any, tasks_data: Map<string, any>): Promise<void> {

    const start = parseInt(dto.params_start, 10);
    const end = parseInt(dto.params_end, 10);
    const filters: [any, string][] = [];
    let sorting = {};

    // filter string search with the following items:
    [
      ['name', 'user', 'name'],
      ['email', 'user', 'email'],
    ].forEach(f => {
      const filter = f as [string, string, string];
      if (dto[`params_${filter['0']}`]) {
        filters.push([dto[`params_${filter['0']}`], `${filter['1']}.${filter['2']}`]);
      }
    });

    // filter by delete status
    if (dto.params_deleted) {
      filters.push([dto.params_deleted.toLowerCase() === 'true', 'user.is_deleted']);
    }

    // sort with the following items:
    [
      ['id', 'user', 'id'],
      ['email', 'user', 'email'],
      ['name', 'user', 'name'],
      ['created_by', 'user', 'created_by'],
      ['created_date', 'user', 'created_date'],
    ].forEach(f => {
      const filter = f as [string, string, string];
      if (dto[`params_order_${filter['0']}`]) {
        sorting = Object.assign(sorting, {
          [`${filter['1']}.${filter['2']}`]: dto[`params_order_${filter['0']}`],
        });
      }
    });

    // execute query
    const query_result = await executeReadQuery('user', start, end, filters, sorting, []);

    // store users in request context
    tasks_data.set('users', query_result[0].map(u => {
      // only return what's displayed in listing table
      const user = u as User;
      delete user.jwt_secret;
      delete user.password;
      delete user.last_login;
      delete user.modified_by;
      delete user.modified_date;
      delete user.is_deleted;
      return user;
    }));
    tasks_data.set('users_count', query_result[1]);

    return Promise.resolve();
  }

  async update_user(dto: any, tasks_data: Map<string, any>): Promise<void> {

    // get user
    const user = tasks_data.get('user') as User;

    // get logged in user
    const session_user = await getConnection().getRepository(User).findOne({
      where: { id: dto.user_id },
    });

    // update properties
    user.email = dto.email ? dto.email : user.email;
    user.name = dto.name ? dto.name : user.name;
    user.password = dto.password ? await bcrypt.hash(dto.password, 10) : user.password;
    user.is_deleted = dto.is_deleted ? dto.is_deleted : user.is_deleted;

    // update metadata
    user.modified_by = session_user.name;
    user.modified_date = new Date();

    // save update
    await getConnection().getRepository(User).save(user);

    // store user in request context
    tasks_data.set('user', user);

    return Promise.resolve();
  }

  async update_user_to_deleted(dto: any, tasks_data: Map<string, any>): Promise<void> {

    // get user
    const user = tasks_data.get('user') as User;

    // get logged in user
    const session_user = await getConnection().getRepository(User).findOne({
      where: { id: dto.user_id },
    });

    // update properties
    user.is_deleted = true;

    // update metadata
    user.modified_by = session_user.name;
    user.modified_date = new Date();

    // commit to database
    await getConnection().getRepository(User).save(user);
    return Promise.resolve();
  }

  async create_user(dto: any, tasks_data: Map<string, any>): Promise<void> {

    const user_repo = getConnection().getRepository(User);
    const user = user_repo.create();

    // get logged in user
    const session_user = await getConnection().getRepository(User).findOne({
      where: { id: dto.user_id },
    });

    // update properties
    user.email = dto.email;
    user.name = dto.name;
    user.password = await bcrypt.hash(dto.password, 10);
    user.is_deleted = false;
    user.jwt_secret = '';
    user.last_login = new Date();
    user.is_deleted = false;

    // update metadata
    user.modified_by = session_user.name;
    user.modified_date = new Date();
    user.created_by = session_user.name;
    user.created_date = new Date();

    // save update
    await getConnection().getRepository(User).save(user);

    // store user in request context
    tasks_data.set('user', user);

    return Promise.resolve();
  }

  async batch_delete(dto: any, tasks_data: Map<string, any>): Promise<void> {

     // get logged in user
    const session_user = await getConnection().getRepository(User).findOne({
        where: { id: dto.user_id },
    });

    await getConnection().createQueryBuilder()
      .update(User)
      .set({ is_deleted: true, modified_by: session_user.name })
      .where('id IN (:...ids)', { ids: dto.ids })
      .execute();

    return Promise.resolve();
  }

}