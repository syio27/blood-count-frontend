import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIconsModule } from '@ng-icons/core';
import { iconoirTimer } from '@ng-icons/iconoir'

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
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HistoryComponent } from './components/user-profile/history/history.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { FooterComponent } from './components/footer/footer.component';
import { WhiteBoxComponent } from './components/white-box/white-box.component';

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
  ],
  imports: [
    ReactiveFormsModule,
    AppMaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgIconsModule.withIcons({ iconoirTimer })
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],

})
export class AppModule { }
