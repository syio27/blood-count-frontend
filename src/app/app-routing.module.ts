import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { HistoryComponent } from './pages/user-profile/history/history.component'
import { CbcTableComponent } from './pages/reference-table-page/reference-page.component';
import { ControlPanelComponent } from './pages/control-panel-pages/control-panel.component';
import { UsersComponent } from './pages/control-panel-pages/users/users.component';
import { InviteUserComponent } from './pages/control-panel-pages/invite-user/invite-user.component';
import { GroupsComponent } from './pages/control-panel-pages/groups/groups.component';
import { CaseComponent } from './pages/control-panel-pages/cases/case.component';
import { ExamComponent } from './pages/exam-pages/exam.component';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { GameGuard } from './services/game.guard';
import { RoleGuard } from './guards/role.guard';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

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
            component: UsersComponent,
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
            component: GroupsComponent,
            canActivate: [RoleGuard],
            data: { expectedRoles: ['ROOT', 'ADMIN'] },
          },
          {
            path: 'cases',
            component: CaseComponent,
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

