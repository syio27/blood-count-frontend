import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserProfileService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  formSubmitAttempt = false;
  invalidLogin: boolean;
  token: string;
  email: string;
  isLoading: boolean = false;
  isTokenValid: boolean = true;
  isPageLoading: boolean = true;

  private readonly notifier: NotifierService;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserProfileService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.isPageLoading = true;
    this.token = this.route.snapshot.paramMap.get('token');
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
    this.validateToken();
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+?.-=])[0-9a-zA-Z!@#$%^&*()_+?.-=]{8,}$/)]],
      confirmPassword: ['', Validators.required]
    });
    this.form.valueChanges.subscribe(() => {
      this.formSubmitAttempt = false;
      this.invalidLogin = false;
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  validateToken() {
    this.isPageLoading = true;
    this.userService.validateToken(this.token, this.email).subscribe(
      () => {
        this.isTokenValid = true;
        setTimeout(() => {
          this.isPageLoading = false;
        }, 950);
        console.log("token valid")
      },
      (error: HttpErrorResponse) => {
        this.isTokenValid = false;
        setTimeout(() => {
          this.isPageLoading = false;
        }, 950);
        console.log("token invalid")
      }
    );
  }

  onSubmit() {
    this.isLoading = true;
    if (this.form.valid) {
      this.userService.resetPassword(this.token, this.email, this.form.value).subscribe(
        () => {
          this.notifier.notify('success', 'Reset has been reset');
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this.notifier.notify('error', error.message);
          this.isLoading = false;
        });
    }
    this.formSubmitAttempt = true;
  }

  changePassword() {
    this.onSubmit();
  }
}
