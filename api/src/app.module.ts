import { Module } from '@nestjs/common';
import { AppDatabaseModule } from './app.database';
import { RegisterController } from './register/register.controller';
import { RegisterValidations } from './register/register.validations';
import { RegisterActions } from './register/register.actions';
import { LoginController } from './login/login.controller';
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
    RegisterActions
  ],
})
export class AppModule {}
