import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { RegisterDto } from './register.dto';
import { executeTasks } from './../app.util';
import { RegisterActions } from './register.actions';
import { RegisterValidations } from './register.validations';

@Controller('register')
export class RegisterController {

    constructor(
        private readonly actions: RegisterActions,
        private readonly validations: RegisterValidations,
    ) {}

    @Post()
    async registration(
        @Body(new ValidationPipe()) dto: RegisterDto, 
    ) {

        const result = await executeTasks([
            this.validations.validate_email_is_valid_format,
            this.validations.validate_confirm_password_is_match,
            this.validations.validate_confirm_password_is_match,
            this.actions.create,
        ], dto);

        return 'Registration Success.';
    }
}
