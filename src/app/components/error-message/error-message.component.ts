import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent {
  //registration
  @Input() isInvalidEmail: boolean
  @Input() isInvalidPassword: boolean
  @Input() isInvalidConfirmPassword: boolean
  @Input() passwordMissMatch: boolean
  //login
  @Input() enterEmail: boolean
  @Input() enterPassword: boolean
  @Input() invalidLogin: boolean
  //change Password
  @Input() invalidPassword: boolean

}
