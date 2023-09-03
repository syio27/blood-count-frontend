import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  form: FormGroup;
  formSubmitAttempt = false;
  invalidLogin: boolean;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
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

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe(
        result => {
          if (result) {
            this.invalidLogin = false;
          } else {
            this.invalidLogin = true;
          }
        }
      );
    }
    this.formSubmitAttempt = true;
  }
  changePassword(){
    
  }
}
