import { Controller} from '@nestjs/common';

@Controller('admin/user')
export class UserController {

  constructor(
    private readonly assertions: UserValidations,
    private readonly actions: UserActions,
  ) { }

  @Get()
  @UseGuards(Authentication)
  async list(
    @IPAddress() ip_address,
    @UserRequestTime() request_time,
    @UserName() user_name,
    @Query('s') params_start,
    @Query('e') params_end,
    @Query('n') params_name,
    @Query('ea') params_email,
    @Query('d') params_deleted,
    @Query('order_id') params_order_id,
    @Query('order_e') params_order_email,
    @Query('order_n') params_order_name,
    @Query('order_cb') params_order_created_by,
    @Query('order_c') params_order_created_date,
  ) {

    /*
    * LIST ALL USERS
    * -> STEPS:
    *  1.) validate filter range values
    *  2.) validate sorting parameters
    *  3.) get all users using filters and sort options
    */
    const result = await executeTasks([
      this.assertions.assert_filter_range,
      this.assertions.assert_sort_params,
      this.actions.cache_users,
    ], {
      params_start,
      params_end,
      params_name,
      params_email,
      params_deleted,
      params_order_id,
      params_order_email,
      params_order_name,
      params_order_created_by,
      params_order_created_date,
      user_name,
      ip_address,
    });

    return {
      data: {
        users: result.get('users'),
        users_count: result.get('users_count'),
      },
    };
  }

  @Post('id')
  // @UseGuards(Authentication)
  async id_create(
    @Body(new ValidationPipe()) dto: UserCreateDto,
    @IPAddress() ip_address,
    @UserRequestTime() request_time,
    @UserName() user_name,
  ) {

    /*
    * CREATE USER
    * -> STEPS:
    *  1.) validate email availability
    *  2.) create user
    */
    const result = await executeTasks([
      this.assertions.assert_user_role_exists,
      this.assertions.assert_email_is_valid_format,
      this.assertions.assert_email_is_available_sans_id_check,
      this.actions.create_user,
    ], Object.assign(dto, {
        user_name,
        ip_address,
      },
    ));

    const user = result.get('user');
    delete user.password;
    delete user.jwt_secret;
    return {
      data: user,
    };
  }

  @Get('id/:id')
  // @UseGuards(Authentication)
  async id(
    @IPAddress() ip_address,
    @UserRequestTime() request_time,
    @UserName() user_name,
    @Param('id') params_id,
  ) {

    /*
    * GET USER DETAIL
    * -> STEPS:
    *  1.) validate id parameter
    *  2.) get user
    */
    const result = await executeTasks([
      this.assertions.assert_id_numeric,
      this.actions.cache_user,
    ], {
        params_id,
        ip_address,
      });

    const user = result.get('user');
    delete user.password;
    delete user.jwt_secret;

    return {
      data: user,
    };
  }

  @Patch('id/:id')
  // @UseGuards(Authentication)
  async id_patch(
    @Body(new ValidationPipe()) dto: UserUpdateDto,
    @IPAddress() ip_address,
    @UserRequestTime() request_time,
    @UserName() user_name,
    @Param('id') params_id,
  ) {

    /*
    * UPDATE USER DETAIL
    * -> STEPS:
    *  1.) validate id parameter
    *  2.) get user by id
    *  3.) check if user exists
    *  4.) validate email availability
    *  5.) update user
    */
    const result = await executeTasks([
      this.assertions.assert_user_role_exists,
      this.assertions.assert_id_numeric,
      this.actions.cache_user,
      this.assertions.assert_user_exists,
      this.assertions.assert_email_is_valid_format,
      this.assertions.assert_email_is_available,
      this.actions.update_user,
    ], Object.assign(dto, {
        params_id,
        user_name,
        ip_address,
      }));

    const user = result.get('user');
    delete user.password;
    delete user.jwt_secret;

    return {
      data: user,
    };
  }

  @Delete('data/id/:id')
  // @UseGuards(Authentication)
  async id_delete(
    @IPAddress() ip_address,
    @UserRequestTime() request_time,
    @UserName() user_name,
    @Param('id') params_id,
  ) {

    /*
    * DELETE USER
    * -> STEPS:
    *  1.) validate id parameter
    *  2.) update user deleted status
    */
    await executeTasks([
      this.assertions.assert_id_numeric,
      this.actions.cache_user,
      this.actions.update_user_to_deleted,
    ], {
        params_id,
        user_name,
        ip_address,
      });

    return {
      data: {
        result: 'ok',
      },
    };
  }

  @Post('batch_delete')
  // @UseGuards(Authentication)
  async batch_delete(
    @Body(new ValidationPipe()) dto: UserBatchDeleteDto,
    @IPAddress() ip_address,
    @UserRequestTime() request_time,
    @UserName() user_name,
  ) {

    /*
    * BATCH DELETE
    * -> STEPS:
    *  1.) delete items from dto.ids
    */
    const result = await executeTasks([
      this.actions.batch_delete,
    ], Object.assign(dto, {
      user_name,
      ip_address,
    }));

    return {
      data: {
        result: 'ok',
      },
    };
  }

}