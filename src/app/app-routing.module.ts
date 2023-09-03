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
import { ControlPanelComponent } from './components/roles/control-panel/control-panel.component';
import { UsersTableComponent } from './components/roles/control-panel/users-table/users-table.component';
import { InviteUserComponent } from './components/roles/control-panel/invite-user/invite-user.component';
import { GroupsManageComponent } from './components/roles/control-panel/groups-manage/groups-manage.component';
import { CaseEntityComponent } from './components/roles/control-panel/case-entity/case-entity.component';
import { ExamComponent } from './components/exam/exam.component';
import { CanDeactivateGuard } from './services/can-deactivate.guard';
import { GameGuard } from './services/game.guard';
import { RoleGuard } from './services/role.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

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
        canDeactivate: [CanDeactivateGuard],
        canActivate: [GameGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'control-panel',
        component: ControlPanelComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'users'
          },
          {
            path: 'users',
            component: UsersTableComponent,
            canActivate: [RoleGuard],
            data: { expectedRoles: ['ROOT', 'SUPERVISOR', 'ADMIN'] },
          },
          {
            path: 'invite',
            component: InviteUserComponent,
            canActivate: [RoleGuard],
            data: { expectedRoles: ['ROOT', 'ADMIN'] },
          },
          {
            path: 'groups',
            component: GroupsManageComponent,
            canActivate: [RoleGuard],
            data: { expectedRoles: ['ROOT', 'ADMIN'] },
          },
          {
            path: 'cases',
            component: CaseEntityComponent,
            canActivate: [RoleGuard],
            data: { expectedRoles: ['ROOT', 'ADMIN'] },
          },
        ]
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
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'reset-password/:token',
        component: ResetPasswordComponent
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

