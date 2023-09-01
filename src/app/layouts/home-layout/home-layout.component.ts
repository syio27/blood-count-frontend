import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  isLoading: boolean = true

  constructor() { }

  ngOnInit() {
    window.onload = () => {
      setTimeout(() => {
        this.isLoading = false
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  };
}
