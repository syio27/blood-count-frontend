import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  isLoading: boolean = true;

  constructor() {}

  ngOnInit() {
    window.onload = () => {
      this.isLoading = false;
    };
  }
}
