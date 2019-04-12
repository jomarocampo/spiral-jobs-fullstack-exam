import { createParamDecorator } from '@nestjs/common';
import * as request_ip from 'request-ip';

export const UserName = createParamDecorator((data, req) => {
    return req.user.name;
});

export const UserID = createParamDecorator((data, req) => {
  return req.user.id;
});


export const UserRequestTime = createParamDecorator((data, req) => {
  return new Date();
});

export const IPAddress = createParamDecorator((data, req) => {
  return request_ip.getClientIp(req);
});
