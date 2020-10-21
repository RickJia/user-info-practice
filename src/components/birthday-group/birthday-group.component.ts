import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserListService } from '../../services/user-list.service';
import { User } from '../user-form/user.interface';
import { getMonths } from '../birthday-group/groupByMonths.interface';

@Component({
  selector: 'app-birthday-group',
  templateUrl: './birthday-group.component.html',
  styleUrls: ['./birthday-group.component.scss']
})
export class BirthdayGroupComponent implements OnInit, OnDestroy {

  users: User[] = [];

  groupByMonths = getMonths();

  constructor(private userListService: UserListService) {
  }

  ngOnInit(): void {
    this.users = this.userListService.get();
    this.users.forEach(user => {
      const month = user.birthday.getMonth();
      this.groupByMonths[month].users.push(user);
    })
  }

  ngOnDestroy(): void { 
  }
  
}
