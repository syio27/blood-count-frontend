import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  selectedOption: string = 'manage all';

  @Output() optionSelected = new EventEmitter<string>();
  ngOnInit() {
    setInterval(() => {
      this.optionSelected.emit(this.selectedOption);
    },);
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

}
