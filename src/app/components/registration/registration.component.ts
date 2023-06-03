import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

function passwordMatchValidator(form: FormGroup) {
  const password = form.get('password').value;
  const confirmPassword = form.get('confirmPassword').value;

  if (password !== confirmPassword) {
    return { passwordMismatch: true };
  }

  return null;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  onClick = false;
  dropdownOptions = ['Group 1', 'Group 2', 'Group 3'];
  selectedOption = '';
  form: FormGroup;
  formSubmitAttempt = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*()_+-=])[0-9a-zA-Z!@#$%^&*()_+-=]{8,}$/)]],
      confirmPassword: ['', Validators.required],
    },
      {
        validator: passwordMatchValidator
      }),
      this.form.valueChanges.subscribe(() => {
        this.formSubmitAttempt = false;
      });
  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.formSubmitAttempt && !this.form.get(field).valid)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.register(this.form.value).subscribe();
    }
    this.formSubmitAttempt = true;
  }

  toggleClick() {
    this.onClick = !this.onClick;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.onClick = false;
  }
}
