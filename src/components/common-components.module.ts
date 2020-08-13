import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UserFormComponent } from './user-form/user-form.component';
import { BirthdayGroupComponent } from 'src/components/birthday-group/birthday-group.component';

import { ConfigService } from 'src/services/config.service';
import { UserListService } from 'src/services/user-list.service';

@NgModule({
  declarations: [
    UserFormComponent,
    BirthdayGroupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  exports: [
    UserFormComponent,
    BirthdayGroupComponent,
  ],
  providers: [
    ConfigService,
    UserListService,
  ]
})
export class CommonComponentsModule { }
