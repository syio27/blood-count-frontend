import { Component } from '@angular/core';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.css']
})
export class InviteUserComponent {
  onClick = false;
  dropdownOptions = ['Student', 'Teacher', 'Admin'];
  selectedOption = '';

  toggleClick() {
    this.onClick = !this.onClick;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.onClick = false;
  }
}
