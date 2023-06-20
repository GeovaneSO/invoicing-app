import { User } from './user.interface';

export interface SessionRequest {
  username: string;
  password: string;
}

export interface Payload {
  sub: string;
  email: string;
}

export interface UserPayload extends User {
  sub: string;
}
