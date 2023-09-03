import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfileService } from 'src/app/services/user.service';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  formSubmitAttempt = false;
  invalidLogin: boolean;
  isLoading: boolean = false;
  isFi

  private readonly notifier: NotifierService;

  constructor(
    private fb: FormBuilder,
    private userService: UserProfileService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
    });
    this.form.valueChanges.subscribe(() => {
      this.formSubmitAttempt = false;
    });
  }

  isFieldInvalid(field: string) {

    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.userService.forgotPassword(this.form.value).subscribe(() => {
        this.isLoading = false;
        this.notifier.notify('success', 'Reset password link sent');
      },
        (error: HttpErrorResponse) => {
          this.notifier.notify('error', error.message);
          this.isLoading = false;
        });
    }
    this.formSubmitAttempt = true;
  }
}
