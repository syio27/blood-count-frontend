import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent implements OnInit {
  form: FormGroup;
  roleDropdownOpen = false;
  groupDropdownOpen = false;
  dropdownOptions = ['Student', 'Teacher', 'Admin'];
  groupDropdownOptions = ['Group 1', 'Group 2', 'Group 3'];
  selectedRoleOption = '';
  selectedGroupOption = '';

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
    });
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
  }

  selectGroupOption(option: string) {
    this.selectedGroupOption = option
    this.groupDropdownOpen = false;
  }
}
