import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/administration.service';
import { IInviteUserRequest } from '../../../../interfaces/IInviteUserRequest';
import { GroupService } from '../../../../services/group.service';
import { Roles } from '../../../../enums/role.enum';


@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent implements OnInit {
  form: FormGroup;
  roleDropdownOpen = false;
  groupDropdownOpen = false;
  dropdownOptions: string[] = Object.values(Roles);
  groupDropdownOptions: string[] = []; 
  selectedRoleOption = '';
  selectedGroupOption = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
    });

    this.fetchGroupNumbers(); 
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
          console.log('Invitation sent');
        },
        (error) => {
          console.error('Failed to send invitation:', error);
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
