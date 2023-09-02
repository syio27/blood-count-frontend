import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { RegisterRequest } from 'src/app/interfaces/IRegisterRequest';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';

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
  groupDropdownOptions: string[] = [];
  selectedOption = '';
  form: FormGroup;
  formSubmitAttempt = false;

  private readonly notifier: NotifierService;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private groupService: GroupService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*()_+-=])[0-9a-zA-Z!@#$%^&*()_+-=]{8,}$/)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: passwordMatchValidator
    });

    this.form.valueChanges.subscribe(() => {
      this.formSubmitAttempt = false;
    });

    this.fetchGroupNumbers();
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.formSubmitAttempt && !this.form.get(field).valid)
    );
  }

  fetchGroupNumbers(): void {
    this.groupService.fetchAllGroupsPublic().subscribe(
      (groups) => {
        this.groupDropdownOptions = [groups].flatMap((subArray) => subArray).map(group => group.groupNumber);
      },
      (error) => {
        console.error('Failed to fetch group numbers:', error);
      }
    );
  }

  onSubmit() {
    const registerData: RegisterRequest = {
      groupNumber: this.selectedOption,
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      timezoneOffset: 0
    }
    if (this.form.valid) {
      this.authService.register(registerData).subscribe(
        result => {
          if (result) {
            this.notifier.notify('success', 'You are Successfully registered');
          }
        },
        (error: HttpErrorResponse) => {
          this.notifier.notify('error', error.message);
        }
      );
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
