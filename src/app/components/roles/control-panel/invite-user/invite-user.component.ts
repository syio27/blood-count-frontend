import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/administration.service';
import { IInviteUserRequest } from '../../../../interfaces/IInviteUserRequest';
import { GroupService } from '../../../../services/group.service';
import { Roles } from '../../../../enums/role.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup'
import { SharedUserDetailsService } from 'src/app/services/shared-user-details.service';
import { UserDetails } from 'src/app/interfaces/IUserDetails';

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

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private groupService: GroupService,
    private toast: NgToastService,
    private sharedUserService: SharedUserDetailsService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
    });

    this.fetchGroupNumbers(); 
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });
    if(this.userDetails.role != 'ROOT'){
      this.dropdownOptions = ['STUDENT','SUPERVISOR']
    }
  }

  fetchGroupNumbers(): void {
    this.groupService.fetchAllGroups().subscribe(
      (groups) => {
        this.groupDropdownOptions = [groups].flatMap((subArray) => subArray).map(group => group.groupNumber);
      },
      (error) => {
        console.error('Failed to fetch group numbers:', error);
      }
    );
  }

  inviteUser(): void {
    if (this.form.valid) {
      const inviteRequest: IInviteUserRequest = {
        email: this.form.get('email').value,
        role: this.selectedRoleOption,
        groupNumber: this.selectedGroupOption
      };
      this.adminService.invite(inviteRequest).subscribe(
        () => {
          this.toast.success({detail:"Operation done successfully",summary:'User has been invited',duration: 2000});
          this.form.reset()
          this.selectedRoleOption = '';
          this.selectedGroupOption = '';
        },
        (error) => {
          console.error('Failed to send invitation:', error);
          this.toast.error({ detail: "Error", summary: error.message, duration: 2000 });
        }
      );
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
    console.log(this.selectedRoleOption)
  }

  selectGroupOption(option: string) {
    this.selectedGroupOption = option;
    this.groupDropdownOpen = false;
  }
}