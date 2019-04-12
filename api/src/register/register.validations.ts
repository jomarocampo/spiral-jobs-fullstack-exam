import { Injectable } from '@nestjs/common';
import { BadRequestException } from '../app.exceptions';
import { RegisterExceptions } from './register.exceptions';
import { getConnection } from 'typeorm';
import { User } from './../entities/user.entity';

@Injectable()
export class RegisterValidations {


  async validate_email_is_valid_format(dto: any, tasks_data: Map<string, any>): Promise<void> {

    const regex = new RegExp(['^(([^<>()[\\]\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\.,;:\\s@\"]+)*)',
      '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.',
      '[0-9]{1,3}\])|(([a-zA-Z\\-0-9]+\\.)+',
      '[a-zA-Z]{2,}))$'].join(''));

    if (!regex.test(dto.email)) {
      throw new BadRequestException(RegisterExceptions.EmailInvalid, { });
    }
    return Promise.resolve();
  }

  async validate_email_is_available(dto: any, tasks_data: Map<string, any>): Promise<void> {

    const user = await getConnection().getRepository(User).findOne({
      where: {
        email: dto.email,
      },
    });

    // make sure updated email is not currently being used
    if (user && user.id !== parseInt(dto.params_id, 10)) {
      throw new BadRequestException(RegisterExceptions.EmailAlreadyUsed, { });
    }
    return Promise.resolve();
  }

  async validate_confirm_password_is_match(dto: any, tasks_data: Map<string, any>): Promise<void> {


    // make sure updated email is not currently being used
    if (dto.password !== dto.confirm_password) {
      throw new BadRequestException(RegisterExceptions.ConfirmPasswordNotMatch, { });
    }
    return Promise.resolve();
  }

}