import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

function passwordMatchValidator(passwordForm: FormGroup) {
  const password = passwordForm.get('password').value;
  const confirmPassword = passwordForm.get('confirmPassword').value;

  if (password !== confirmPassword) {
    return { passwordMismatch: true };
  }

  return null;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  passwordForm: FormGroup;
  emailForm: FormGroup;
  formSubmitAttempt: boolean;
  emailChange = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*()_+-=])[0-9a-zA-Z!@#$%^&*()_+-=]{8,}$/)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: passwordMatchValidator
    }),
    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]]
    })
  }

  isFieldInvalid(field: string) {
    return (
      (!this.passwordForm.get(field).valid && this.passwordForm.get(field).touched) ||
      (this.passwordForm.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onHistory(){
    this.router.navigate(['/history'])
  }
  onChangeEmail(){
    this.emailChange = !this.emailChange
  }
  changeEmail(){

  }
  changePassword() {
    if (this.passwordForm.valid) {
      const data = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.password
      };
     /* this.authService.updateUser(data).subscribe((res: any) => { updateUser func
        // do something with the response
      });*/
    }
    else {
      this.formSubmitAttempt = true;
    }
  }
}
