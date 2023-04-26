import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

function passwordMatchValidator(form: FormGroup) {
  const password = form.get('password').value;
  const confirmPassword = form.get('confirmPassword').value;

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
  form: FormGroup;
  formSubmitAttempt: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*()_+-=])[0-9a-zA-Z!@#$%^&*()_+-=]{8,}$/)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: passwordMatchValidator
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onHistory(){
    this.router.navigate(['/history'])
  }

  changePassword() {
    if (this.form.valid) {
      const data = {
        currentPassword: this.form.value.currentPassword,
        newPassword: this.form.value.password
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
