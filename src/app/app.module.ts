import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgToastModule } from 'ng-angular-popup'
import { AppMaterialModule } from './app-material/app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { PopupComponent } from './components/header/popup/popup.component';
import { LangSwitcherComponent } from './components/header/lang-switcher/lang-switcher.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HistoryComponent } from './components/user-profile/history/history.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { FooterComponent } from './components/footer/footer.component';
import { WhiteBoxComponent } from './components/white-box/white-box.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { PanelButtonComponent } from './components/header/panel-button/panel-button.component';
import { CbcTableComponent } from './components/cbc-table/cbc-table.component';
import { ControlPanelComponent } from './components/roles/control-panel/control-panel.component';
import { NavigationBarComponent } from './components/roles/navigation-bar/navigation-bar.component';
import { UsersTableComponent } from './components/roles/control-panel/users-table/users-table.component';
import { InviteUserComponent } from './components/roles/control-panel/invite-user/invite-user.component';
import { GroupsManageComponent } from './components/roles/control-panel/groups-manage/groups-manage.component';
import { CaseEntityComponent } from './components/roles/control-panel/case-entity/case-entity.component';
import { CaseTableComponent } from './components/roles/control-panel/case-entity/case-table/case-table.component';
import { ExamComponent } from './components/exam/exam.component';
import { TimerComponent } from './components/exam/timer/timer.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { Page2Component } from './components/exam/page2/page2.component';
import { Page1Component } from './components/exam/page1/page1.component'
import { CanDeactivateGuard } from './services/can-deactivate.guard';
import { Page3Component } from './components/exam/page3/page3.component';
import { Page4Component } from './components/exam/page4/page4.component';

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
    UsersTableComponent,
    InviteUserComponent,
    GroupsManageComponent,
    CaseEntityComponent,
    CaseTableComponent,
    ExamComponent,
    TimerComponent,
    Page2Component,
    Page1Component,
    Page3Component,
    Page4Component,
  ],
  imports: [
    ReactiveFormsModule,
    AppMaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgToastModule,
    MatStepperModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [AuthService, AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }, CanDeactivateGuard],
  bootstrap: [AppComponent],

})
export class AppModule { }
