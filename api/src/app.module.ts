import { Module } from '@nestjs/common';
import { AppDatabaseModule } from './app.database';
import { RegisterController } from './register/register.controller';
import { RegisterValidations } from './register/register.validations';
import { RegisterActions } from './register/register.actions';
import { LoginController } from './login/login.controller';
import { LoginValidations } from './login/login.validations';
import { LoginActions } from './login/login.actions';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    AppDatabaseModule
  ],
  controllers: [
    RegisterController,
    LoginController,
    UserController,
  ],
  providers: [
    RegisterValidations,
    RegisterActions,
    LoginValidations,
    LoginActions
  ],
})
export class AppModule {}
