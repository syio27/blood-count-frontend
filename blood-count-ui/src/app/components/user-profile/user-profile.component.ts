import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedUserDetailsService } from '../../services/shared-user-details.service'
import { Router } from '@angular/router';
import { UserDetails } from '../../interfaces/userDetails';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { PasswordChangeRequest } from 'src/app/interfaces/passwordChangeRequest';
import { EmailChangeRequest } from 'src/app/interfaces/emailChangeRequest';


function passwordMatchValidator(passwordForm: FormGroup) {
  const newPassword = passwordForm.get('newPassword').value;
  const confirmPassword = passwordForm.get('confirmPassword').value;

  if (newPassword !== confirmPassword) {
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
  formSubmitAttempt = false;
  emailChange = false;
  userDetails: UserDetails;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sharedUserService: SharedUserDetailsService,
    private profileService: UserProfileService
  ) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*()_+-=])[0-9a-zA-Z!@#$%^&*()_+-=]{8,}$/)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: passwordMatchValidator
    }),
      this.emailForm = this.fb.group({
        newEmail: ['', [Validators.required, Validators.email]]
      }),
      this.passwordForm.valueChanges.subscribe(() => {
        this.formSubmitAttempt = false;
      }),
      this.emailForm.valueChanges.subscribe(() => {
        this.formSubmitAttempt = false;
      }),
      this.sharedUserService.getUserDetails().subscribe(userDetails => {
        this.userDetails = userDetails;
      });
  }

  isFieldInvalid(field: string) {
    switch (field) {
      case 'newEmail':
        return (
          (!this.emailForm.get(field).valid && this.emailForm.get(field).touched) ||
          (this.emailForm.get(field).untouched && this.formSubmitAttempt)
        );
      default:
        return (
          (!this.passwordForm.get(field).valid && this.passwordForm.get(field).touched) ||
          (this.passwordForm.get(field).untouched && this.formSubmitAttempt)
        );
    }
  }


  onHistory() {
    this.router.navigate(['/history'])
  }

  onChangeEmail() {
    this.emailChange = !this.emailChange
  }

  changeEmail() {
    const userId: string = this.userDetails.id;
    console.log("user's id -> " + userId)
    if (this.emailForm.valid) {
      console.log(this.emailForm.value)
      const emailChangeRequest: EmailChangeRequest = {
        email: this.emailForm.value.newEmail
      };
      console.log(emailChangeRequest)
      this.profileService.changeEmail(emailChangeRequest, userId).subscribe(
        result => {
          if (result) {
            // change state of valid email to true
          } else {
            // change state of valid email to false
          }
        }
      )
    }
    this.formSubmitAttempt = true;
  }

  changePassword() {
    const userId: string = this.userDetails.id;
    if (this.passwordForm.valid) {
      const passwordChangeRequest: PasswordChangeRequest = {
        oldPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword,
        newPasswordRepeat: this.passwordForm.value.confirmPassword
      };
      this.profileService.updatePassword(passwordChangeRequest, userId).subscribe()
    }
    this.formSubmitAttempt = true;
    console.log(this.userDetails)
  }
}
