import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginComponent } from './components/login/login.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HistoryComponent } from './components/user-profile/history/history.component'
import { CbcTableComponent } from './components/cbc-table/cbc-table.component';
import { RootUserComponent } from './components/roles/root-user/root-user.component';
import { UsersTableComponent } from './components/roles/root-user/users-table/users-table.component';
import { InviteUserComponent } from './components/roles/root-user/invite-user/invite-user.component';
import { GroupsManageComponent } from './components/roles/root-user/groups-manage/groups-manage.component';
import { CaseEntityComponent } from './components/roles/root-user/case-entity/case-entity.component';
import { ExamComponent } from './components/exam/exam.component';
import { CanDeactivateGuard } from './services/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'profile',
        component: UserProfileComponent
      },
      {
        path: 'history',
        component: HistoryComponent
      },
      {
        path: 'table',
        component: CbcTableComponent
      },
      {
        path: 'exam',
        component: ExamComponent,
        canDeactivate: [CanDeactivateGuard]
      },
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegistrationComponent
      },
    ]
  },
  {
    path: 'root',
    component: RootUserComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users'
      },
      {
        path: 'users',
        component: UsersTableComponent
      },
      {
        path: 'invite',
        component: InviteUserComponent
      },
      {
        path: 'groups',
        component: GroupsManageComponent
      },
      {
        path: 'cases',
        component: CaseEntityComponent
      },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

