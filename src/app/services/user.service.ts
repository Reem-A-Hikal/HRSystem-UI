import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private editingUser: any = null;

  setEditingUser(user: any) {
    this.editingUser = user;
  }

  getEditingUser() {
    return this.editingUser;
  }

  clearEditingUser() {
    this.editingUser = null;
  }
}
