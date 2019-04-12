import { Injectable } from '@nestjs/common';
import * as randomstring from 'randomstring';
import * as jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { User } from './../entities//user.entity';

@Injectable()
export class LoginActions {

  async cache_user_by_email(dto: any, tasks_data: Map<string, any>): Promise<void> {

    const user = await getConnection().getRepository(User).findOne({
        where: {
          email: dto.email,
          is_deleted: false,
        },
      });

    // cache users
    tasks_data.set('user', user);
  }

  async login_user(dto: any, tasks_data: Map<string, any>): Promise<void> {

    // generate jwt secret for user
    const jwt_secret = randomstring.generate({
      length: 12,
      charset: 'alphanumeric',
    });

    // get user from request context
    const user: User = tasks_data.get('user');

    // token payload
    const token_payload = await this.generate_token_data(user);

    // generate user token to be returned to user
    const token = jwt.sign(token_payload, jwt_secret, { expiresIn: 86400 });

    // update user data
    user.jwt_secret = jwt_secret;
    user.last_login = new Date();
    await getConnection().getRepository(User).save(user);

    // store token in request context
    tasks_data.set('token', token);

    return Promise.resolve();
  }

  private async generate_token_data(user: User) {
    // final payload data
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

}