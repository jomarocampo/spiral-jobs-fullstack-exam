import { Injectable } from '@angular/core';
import * as axios from 'axios';
import { environment } from '../../../../environments/environment';
import { LoginDef, RegistrationDef, AuthDef } from './auth.interfaces';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  STORAGE_KEY_ACCESS_TOKEN = 'token';

  constructor() { }

  get_token() {
    return sessionStorage.getItem(this.STORAGE_KEY_ACCESS_TOKEN);
  }

  is_login() {
    return this.get_token() ? true : false;
  }
  
  get_auth_data(): AuthDef {
    try{
      return jwt_decode(this.get_token());
  }
  catch(Error){
      return null;
  }
  }

  async register(payload?: RegistrationDef): Promise<any> {

    return await axios.default.post(`${environment.api_url}/register`, {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      confirm_password: payload.confirm_password
    }).catch(e => {
      return { error: e.response ? e.response.data.data.error_message : 'Unable to connect to server.' };
    });
  }

  async login(request?: LoginDef): Promise<any> {

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
      sessionStorage.setItem(this.STORAGE_KEY_ACCESS_TOKEN, token);
      return Promise.resolve(response);
    }
  }
}
