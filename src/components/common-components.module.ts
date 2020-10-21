import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UserFormComponent } from './user-form/user-form.component';
import { BirthdayGroupComponent } from '../components/birthday-group/birthday-group.component';

import { ConfigService } from '../services/config.service';
import { UserListService } from '../services/user-list.service';
import { InputPatternDirective } from './input-pattern.directive';
import { FieldSecurityValidatorPageComponent } from './field-security-validator-page/field-security-validator-page.component';
import { FieldSecurityValidatorDirective } from './field-security-validator.directive';
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
  declarations: [
    UserFormComponent,
    BirthdayGroupComponent,
    InputPatternDirective,
    FieldSecurityValidatorDirective,
    FieldSecurityValidatorPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CurrencyMaskModule,
  ],
  exports: [
    UserFormComponent,
    BirthdayGroupComponent,
    FieldSecurityValidatorPageComponent,
  ],
  providers: [
    ConfigService,
    UserListService,
  ]
})
export class CommonComponentsModule { }
