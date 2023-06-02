import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-status-button',
  templateUrl: './status-button.component.html',
  styleUrls: ['./status-button.component.css']
})
export class StatusButtonComponent {
  constructor(
    private router: Router
  ) { }
  onRoot() {
    this.router.navigate(['/root'])
  }
}
