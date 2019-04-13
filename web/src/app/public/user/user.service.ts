import { Injectable } from '@angular/core';
import * as axios from 'axios';
import { environment } from '../../../environments/environment';
import { UserLoginDef, UserRegistrationDef } from './user.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  STORAGE_KEY_ACCESS_TOKEN = 'token';

  constructor() { }

  async register(payload?: UserRegistrationDef): Promise<any> {

    return await axios.default.post(`${environment.api_url}/register`, {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      confirm_password: payload.confirm_password
    }).catch(e => {
      return { error: e.response ? e.response.data.data.error_message : 'Unable to connect to server.' };
    });
  }

  async login(request?: UserLoginDef): Promise<any> {

    const response = await axios.default.post(`${environment.api_url}/login`, {
      email: request.email,
      password: request.password,
    }).catch(e => {
      return { error: e.response ? e.response.data.data.error_message : 'Unable to connect to server.' };
    });

    if (response['error']) {
      return Promise.resolve(response);
    } else {
      const token = response['data'].data.token;
      return Promise.resolve(response);
    }
  }
}
