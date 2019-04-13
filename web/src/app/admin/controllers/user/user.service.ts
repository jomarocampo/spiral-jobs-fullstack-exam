import { Injectable } from '@angular/core';
import * as axios from 'axios';
import { environment } from '../../../../environments/environment';
import { UserListPayloadDef, UserListDataResponseDef } from './user.interfaces';
import { AuthService } from 'src/app/public/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(
      private authService: AuthService
  ) { }

  async search(payload?: UserListPayloadDef): Promise<UserListDataResponseDef> {

    const response = await axios.default.get(`${environment.api_url}/admin/user`, {
        headers: {
          'Authorization': `Bearer ${this.authService.get_token()}`,
        },
        params: {
            s: payload.pagination_start,
            e: payload.pagination_end,
            d: payload.is_deleted,
            n: payload.filter_by === 'name' ? payload.filter_value : '',
            ea: payload.filter_by === 'email' ? payload.filter_value : '',
            order_id: payload.order_id ? payload.order_id : '',
            order_n: payload.order_name ? payload.order_name : '',
            order_e: payload.order_email ? payload.order_email : '',
            order_cb: payload.order_created_by ? payload.order_created_by : '',
            order_c: payload.order_created_date ? payload.order_created_date : '',
        }
    }).catch(e => {
      return { error: e.response ? e.response.data.data.error_message : 'Unable to connect to server.' };
    });

    if (response['error']) {
      return Promise.resolve({
        error: response['error'],
        result: [],
        count: 0,
      });
    } else {
      return Promise.resolve({
        error: undefined,
        result: response['data'].data.users,
        count: response['data'].data.users_count,
      });
    }
  }

  async testing(payload?: UserListPayloadDef): Promise<any> {

    return await axios.default.get(`${environment.api_url}/user`, {
        headers: {
          'Authorization': `Bearer ${this.authService.get_token()}`,
        },
        params: {
            s: payload.pagination_start,
            e: payload.pagination_end,
            d: payload.is_deleted,
            n: payload.filter_by === 'name' ? payload.filter_value : '',
            ea: payload.filter_by === 'email' ? payload.filter_value : '',
            order_id: payload.order_id ? payload.order_id : '',
            order_n: payload.order_name ? payload.order_name : '',
            order_ea: payload.order_email ? payload.order_email : '',
            order_cb: payload.order_created_by ? payload.order_created_by : '',
            order_c: payload.order_created_date ? payload.order_created_date : '',
        }
    }).catch(e => {
      return { error: e.response ? e.response.data.data.error_message : 'Unable to connect to server.' };
    });
  }
}
