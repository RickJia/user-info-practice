import { Injectable } from '@angular/core';
import { User } from 'src/components/user-form/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  users: User[] = [];

  constructor() { }

  get(): User[] {
    return this.users;
  }

  put(users: User[]) {
    this.users = users;
  }
}
