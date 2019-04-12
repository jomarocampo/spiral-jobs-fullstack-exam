import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {

  constructor(exception, payload) {

    super({
      data: exception,
      params: payload,
    }, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends HttpException {

  constructor(error) {

    super({
      data: {
        error_code: 'E-SERVER-' + HttpStatus.UNAUTHORIZED,
        error_message: 'Unauthorized request',
      },
    }, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {

  constructor(error) {

    super({
      data: {
        error_cd: HttpStatus.FORBIDDEN,
        message: 'You have no access rights for this module',
      },
    }, HttpStatus.FORBIDDEN);
  }
}

export class InternalServerException extends HttpException {

  constructor(trace: any) {

    try {
      trace = JSON.stringify(trace);
    } catch (e) { }
    super({
      data: {
        error_code: 'E-SERVER-' + HttpStatus.INTERNAL_SERVER_ERROR,
        error_message: 'Internal Server Error',
      },
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }

}
