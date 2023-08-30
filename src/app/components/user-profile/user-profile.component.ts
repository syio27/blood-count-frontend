import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedUserDetailsService } from '../../services/shared-user-details.service'
import { Router } from '@angular/router';
import { UserDetails } from '../../interfaces/IUserDetails';
import { UserProfileService } from 'src/app/services/user.service';
import { PasswordChangeRequest } from 'src/app/interfaces/IPasswordChangeRequest';
import { NotifierService } from 'angular-notifier';
import { ISimpleGameResponse } from 'src/app/interfaces/ISimpleGameResponse';


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
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  passwordForm: FormGroup;
  emailForm: FormGroup;
  formSubmitAttempt = false;
  emailChange = false;
  userDetails: UserDetails;
  invalidPassword: boolean;
  userID: string
  allPlayedGames: ISimpleGameResponse[]


  private readonly notifier: NotifierService;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sharedUserService: SharedUserDetailsService,
    private profileService: UserProfileService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+?.-=])[0-9a-zA-Z!@#$%^&*()_+?.-=]{8,}$/)]],
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
        this.fetchLastGameHistory()
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

  fetchLastGameHistory() {
    this.sharedUserService.getUserDetails().subscribe(
      (data) => {
        this.userID = data.id
      }
    )
    this.profileService.getHistory(this.userID).subscribe(
      (data) => {
        this.allPlayedGames = this.sortByDateField(data, 'endTime');
      }
    )
  }

  onHistory() {
    this.router.navigate(['/history'])
  }

  changePassword() {
    const userId: string = this.userDetails.id;
    if (this.passwordForm.valid) {
      const passwordChangeRequest: PasswordChangeRequest = {
        oldPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword,
        newPasswordRepeat: this.passwordForm.value.confirmPassword
      };
      this.profileService.updatePassword(passwordChangeRequest, userId).subscribe(
        result => {
          if (result) {
            this.invalidPassword = false;
            this.notifier.notify('success', 'Your password has been successfully updated.');
            this.passwordForm.reset()
          }
        },
        (error) => {
          this.invalidPassword = true;
          this.notifier.notify('error', error);
        }
      )
    }
    console.log(this.invalidPassword)
    this.formSubmitAttempt = true;
  }

  sortByDateField<T>(array: T[], fieldName: string): T[] {
    return array.sort((a: any, b: any) => {
      return new Date(a[fieldName]).getTime() - new Date(b[fieldName]).getTime();
    });
  }
}