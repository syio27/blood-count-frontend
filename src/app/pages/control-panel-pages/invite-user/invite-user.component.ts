import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IInviteUserRequest } from 'src/app/interfaces/IInviteUserRequest';
import { GroupService } from 'src/app/services/group.service';
import { Roles } from 'src/app/enums/role.enum';
import { AdminService } from 'src/app/services/administration.service';
import { SharedUserDetailsService } from 'src/app/shared/shared-user-details.service';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { NotifierService } from 'angular-notifier';
import { IGroupResponse } from 'src/app/interfaces/IGroupResponse';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent implements OnInit {
  form: FormGroup;
  userDetails: UserDetails;
  roleDropdownOpen = false;
  groupDropdownOpen = false;
  dropdownOptions: string[] = Object.values(Roles);
  groupDropdownOptions: string[] = [];
  selectedRoleOption = '';
  selectedGroupOption = '';
  private readonly notifier: NotifierService;
  isLoading: boolean = false;
  allGroups: IGroupResponse[] = [];
  formSubmitAttempt = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private groupService: GroupService,
    private sharedUserService: SharedUserDetailsService,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[\w-]+(\.[\w-]+)*@(student\.wum\.edu\.pl|wum\.edu\.pl|gmail\.com)$/)
      ]],
    });

    this.form.valueChanges.subscribe(() => {
      this.formSubmitAttempt = false;
    });

    this.fetchGroupNumbers();
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });
    if (this.userDetails.role != 'ROOT') {
      this.dropdownOptions = ['STUDENT', 'SUPERVISOR']
    }
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.formSubmitAttempt && !this.form.get(field).valid)
    );
  }

  fetchGroupNumbers(): void {
    this.groupService.fetchAllGroups().subscribe(
      (groups) => {
        this.allGroups = groups;
        this.groupDropdownOptions = [groups].flatMap((subArray) => subArray).map(group => group.groupNumber);
      },
      (error) => {
        console.error('Failed to fetch group numbers:', error);
      }
    );
  }

  inviteUser(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const inviteRequest: IInviteUserRequest = {
        email: this.form.get('email').value,
        role: this.selectedRoleOption,
        groupNumber: this.selectedGroupOption,
        inviterUserId: this.userDetails.id
      };
      this.adminService.invite(inviteRequest).subscribe(
        () => {
          this.notifier.notify('success', 'Invate email has been sent');
          this.form.reset()
          this.selectedRoleOption = '';
          this.selectedGroupOption = '';
          this.isLoading = false;
        },
        (error) => {
          this.notifier.notify('error', error.message);
          this.isLoading = false;
        }
      );
    }
    this.formSubmitAttempt = true;
  }

  updateGroupDropdownOptions(selectedRole: string): void {
    if (selectedRole === 'SUPERVISOR' || selectedRole === 'ADMIN') {
      this.groupDropdownOptions = this.allGroups.filter(group => group.groupType === 'ADMIN_GROUP').map(group => group.groupNumber);
    } else if (selectedRole === 'STUDENT') {
      this.groupDropdownOptions = this.allGroups.filter(group => group.groupType === 'STUDENT_GROUP').map(group => group.groupNumber);
    } else {
      this.groupDropdownOptions = [];
    }
  }

  toggleRoleDropdown() {
    this.roleDropdownOpen = !this.roleDropdownOpen;
  }

  toggleGroupDropdown() {
    this.groupDropdownOpen = !this.groupDropdownOpen;
  }

  selectRoleOption(option: string) {
    this.selectedRoleOption = option;
    this.roleDropdownOpen = false;
    this.updateGroupDropdownOptions(this.selectedRoleOption);
  }

  selectGroupOption(option: string) {
    this.selectedGroupOption = option;
    this.groupDropdownOpen = false;
  }
}
