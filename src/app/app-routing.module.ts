import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserFormComponent } from 'src/components/user-form/user-form.component';
import { BirthdayGroupComponent } from 'src/components/birthday-group/birthday-group.component';

const routes: Routes = [
  { 
    path: '', 
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
