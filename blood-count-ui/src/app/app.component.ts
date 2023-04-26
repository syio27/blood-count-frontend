import { Component } from '@angular/core';


interface AppState { 
  message: string
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'blood-count-ui';
  
}
