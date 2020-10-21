import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { BirthdayGroupComponent } from '../components/birthday-group/birthday-group.component';
import { FieldSecurityValidatorPageComponent } from '../components/field-security-validator-page/field-security-validator-page.component';

const routes: Routes = [
  {
    path: '',
    component: FieldSecurityValidatorPageComponent
  },
  { 
    path: 'user', 
    component: UserFormComponent,
  },
  {
    path: 'group',
    component: BirthdayGroupComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
