import { Component } from '@angular/core';

@Component({
  selector: 'app-root-user',
  templateUrl: './root-user.component.html',
  styleUrls: ['./root-user.component.css']
})
export class RootUserComponent {
  selectedOption: string;

  onOptionSelected(option: string) {
    this.selectedOption = option;
    // Handle the selected option in your component logic
  }
}
