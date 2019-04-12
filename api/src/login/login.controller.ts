import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { LoginValidations } from './login.validations';
import { LoginActions } from './login.actions';
import { executeTasks } from './../app.util';
import { LoginDto } from './login.dto';

@Controller('login')
export class LoginController {

    constructor(
        readonly validations: LoginValidations,
        readonly actions: LoginActions
    ) {}

    @Post()
    async login(
        @Body(new ValidationPipe()) dto: LoginDto,
    ) {
        const result = await executeTasks([
            this.actions.cache_user_by_email,
            this.validations.validate_user_is_valid,
            this.validations.validate_user_password_matches,
            this.actions.login_user.bind(this.actions),
        ], dto);

        return {
            data: {
                token: result.get('token')
            },
        };
    }
}
