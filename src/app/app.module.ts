import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material/app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { PopupComponent } from './components/header/popup/popup.component';
import { LangSwitcherComponent } from './components/header/lang-switcher/lang-switcher.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { HistoryComponent } from './pages/user-profile/history/history.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { FooterComponent } from './components/footer/footer.component';
import { WhiteBoxComponent } from './ui/white-box.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { PanelButtonComponent } from './components/header/panel-button/panel-button.component';
import { CbcTableComponent } from './pages/reference-table-page/reference-page.component';
import { ControlPanelComponent } from './pages/control-panel-pages/control-panel.component';
import { NavigationBarComponent } from './pages/control-panel-pages/components/navigation-bar/navigation-bar.component';
import { UsersComponent } from './pages/control-panel-pages/users/users.component';
import { InviteUserComponent } from './pages/control-panel-pages/invite-user/invite-user.component';
import { GroupsComponent } from './pages/control-panel-pages/groups/groups.component';
import { CaseComponent } from './pages/control-panel-pages/cases/case.component';
import { CaseTableComponent } from './pages/control-panel-pages/cases/case-table/case-table.component';
import { ExamComponent } from './pages/exam-pages/exam.component';
import { TimerComponent } from './pages/exam-pages/components/timer/timer.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { NotifierModule } from 'angular-notifier';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from './components/dialog/dialog.component';
import { LoadingComponent } from './ui/loading.component';
import { BCAssessmentComponent } from './pages/exam-pages/bc-assessment/bc-assessment.component';
import { MultipleChoiceComponent } from './pages/exam-pages/multiple-choice/multiple-choice.component';
import { SubmissionComponent } from './pages/exam-pages/submission/submission.component';
import { FinalComponent } from './pages/exam-pages/final/final.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    RegistrationComponent,
    PopupComponent,
    LangSwitcherComponent,
    UserProfileComponent,
    HistoryComponent,
    ErrorMessageComponent,
    FooterComponent,
    WhiteBoxComponent,
    PanelButtonComponent,
    CbcTableComponent,
    ControlPanelComponent,
    NavigationBarComponent,
    UsersComponent,
    InviteUserComponent,
    GroupsComponent,
    CaseComponent,
    CaseTableComponent,
    ExamComponent,
    TimerComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DialogComponent,
    LoadingComponent,
    SubmissionComponent,
    FinalComponent,
    BCAssessmentComponent,
    MultipleChoiceComponent
  ],
  imports: [
    ReactiveFormsModule,
    AppMaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatStepperModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'top',
          distance: 20
        }
      },
      behaviour: {
        autoHide: 2000
      }
    }),
    MatChipsModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [AuthService, AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }, CanDeactivateGuard],
  bootstrap: [AppComponent],

})
export class AppModule { }
