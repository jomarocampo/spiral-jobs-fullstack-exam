import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { BadRequestException } from './../app.exceptions';
import { UserExceptions } from './user.exceptions';
import { User } from './../entities/user.entity';
import { validateRange } from './../app.util';

@Injectable()
export class UserValidations {

    async assert_filter_range(dto: any, tasks_data: Map<string, any>): Promise<void> {

        if (validateRange(dto)) {
            throw new BadRequestException(UserExceptions.UserFilterRangeInvalid, {});
        }
        return Promise.resolve();
    }

    async assert_sort_params(dto: any, tasks_data: Map<string, any>): Promise<void> {

        const email = dto.params_order_email,
            name = dto.params_order_name,
            created_date = dto.params_order_created_date;
        if ([
            email && email.toUpperCase() !== 'ASC' && email.toUpperCase() !== 'DESC',
            name && name.toUpperCase() !== 'ASC' && name.toUpperCase() !== 'DESC',
            created_date && created_date.toUpperCase() !== 'ASC' && created_date.toUpperCase() !== 'DESC',
        ].find(v => v === true)) {

            throw new BadRequestException(UserExceptions.UserSortParamsInvalid, {});
        }
    }

    async assert_id_numeric(dto: any, tasks_data: Map<string, any>): Promise<void> {

        if (isNaN(parseInt(dto.params_id, 10))) {

            throw new BadRequestException(UserExceptions.UserIdNotNumeric, {});
        }

        return Promise.resolve();
    }

    async assert_user_role_exists(dto: any, tasks_data: Map<string, any>): Promise<void> {

        if (!dto.role) return Promise.resolve();

        if (!tasks_data.get('user_role')) {
            throw new BadRequestException(UserExceptions.UserRoleNotExisting, {});
        }
        return Promise.resolve();
    }

    async assert_user_exists(dto: any, tasks_data: Map<string, any>): Promise<void> {

        // check if user to update does exists
        if (!tasks_data.get('user')) {
            throw new BadRequestException(UserExceptions.UserNotExisting, {});
        }
        return Promise.resolve();
    }

    async assert_email_is_valid_format(dto: any, tasks_data: Map<string, any>): Promise<void> {

        const regex = new RegExp(['^(([^<>()[\\]\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\.,;:\\s@\"]+)*)',
            '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.',
            '[0-9]{1,3}\])|(([a-zA-Z\\-0-9]+\\.)+',
            '[a-zA-Z]{2,}))$'].join(''));

        if (!regex.test(dto.email)) {
            throw new BadRequestException(UserExceptions.UserEmailInvalid, {});
        }
        return Promise.resolve();
    }

    async assert_email_is_available(dto: any, tasks_data: Map<string, any>): Promise<void> {

        const user = await getConnection().getRepository(User).findOne({
            where: {
                email: dto.email,
            },
        });

        // make sure updated email is not currently being used
        if (user && user.id !== parseInt(dto.params_id, 10)) {
            throw new BadRequestException(UserExceptions.UserEmailAlreadyUsed, {});
        }
        return Promise.resolve();
    }

    async assert_email_is_available_sans_id_check(dto: any, tasks_data: Map<string, any>): Promise<void> {

        const user = await getConnection().getRepository(User).findOne({
            where: {
                email: dto.email,
            },
        });

        // make sure updated email is not currently being used
        if (user) {
            throw new BadRequestException(UserExceptions.UserEmailAlreadyUsed, {});
        }
        return Promise.resolve();
    }

}