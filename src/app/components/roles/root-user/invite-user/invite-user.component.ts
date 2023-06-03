import { Component } from '@angular/core';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent {
  roleDropdownOpen = false;
  groupDropdownOpen = false;
  dropdownOptions = ['Student', 'Teacher', 'Admin'];
  groupDropdownOptions = ['Group 1', 'Group 2','Group 3'];

  selectedRoleOption = '';
  selectedGroupOption = '';

  toggleRoleDropdown() {
    this.roleDropdownOpen = !this.roleDropdownOpen;
  }

  toggleGroupDropdown() {
    this.groupDropdownOpen = !this.groupDropdownOpen;
  }

  selectRoleOption(option: string) {
    this.selectedRoleOption = option;
    this.roleDropdownOpen = false;
  }

  selectGroupOption(option: string) {
    this.selectedGroupOption = option;
    this.groupDropdownOpen = false;
  }
}
