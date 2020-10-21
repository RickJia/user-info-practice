import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from './user.interface';
import { UserListService } from '../../services/user-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;
  userData: User[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userListService: UserListService,
  ) { 
    this.userForm = this.fb.group({
      name: '',
      birthday: ''
    });
  }

  ngOnInit(): void {
    this.userForm.valueChanges.subscribe(val => console.log(this.userForm));
  }

  calcuateAge(birthday: Date) {
    var today = new Date();
    var birthDate = new Date(birthday);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  isValid() {
    const birthday = this.userForm.get('birthday').value;
    if (!birthday) {
      return false;
    }
    return this.calcuateAge(birthday) >= 0;    
  }

  onSubmit() {
    if(!this.isValid()) {
      alert('Age error');
      return;
    }

    const age = this.calcuateAge(this.userForm.get('birthday').value);
    const user = {...this.userForm.value, age: age};
    this.userData.push(user);
    this.userData.sort((a, b) => a.age - b.age);
    this.userListService.put(this.userData);
    this.userForm.reset();
  }

  onRedirect() {
    this.router.navigate(['group']);
  }

}
