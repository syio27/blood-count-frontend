import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit, AfterViewInit {
  isLoading: boolean;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.isLoading = true;

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 1090);
  }
}
