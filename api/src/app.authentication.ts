import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { UnauthorizedException, ForbiddenException } from './app.exceptions';
import { User } from './entities/user.entity';

@Injectable()
export class Authentication implements CanActivate {

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    // check for auth headers
    if (!request.headers.authorization) {
      throw new UnauthorizedException('no auth');
    }

    // parse token from header
    const token = request.headers.authorization.replace(/^Bearer/, '').trim();

    // decode token payload
    let payload = null;
    try {
      payload = jwt.decode(token) as { [key: string]: any; };
    } catch (err) {
      throw new UnauthorizedException(err);
    }

    // parse payload
    let parsed_payload = '';
    try {
      parsed_payload = JSON.stringify(payload);
    }
    catch (e) {
      parsed_payload = `[ unable to parse: ${e} ]`;
    }

    // check if valid payload exists
    if (!payload) {
      throw new UnauthorizedException('no payload');
    }

    // make sure payload components are complete
    if (!payload.id || !payload.email || !payload.name) {
      throw new UnauthorizedException('no valid payload, payload: ' + parsed_payload);
    }

    const user = await getConnection().getRepository(User).findOne({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('no valid user found from payload, payload: ' + parsed_payload);
    }

    // verify token validity from user's jwt_secret
    try {
      jwt.verify(token, user.jwt_secret);
    } catch (err) {
      throw new UnauthorizedException('unable to verify token, err: ' + parsed_payload);
    }

    // add payload to request object for controller context
    request.user = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };

    return true;
  }
}