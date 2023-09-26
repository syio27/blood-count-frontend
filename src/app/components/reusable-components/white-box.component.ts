import { Component } from '@angular/core';

@Component({
  selector: 'app-white-box',
  template: `
    <div class="w-full bg-white rounded-md shadow-sm">
      <div class="p-7 md:p-12 lg:p-20 px-4">
        <ng-content></ng-content>
      </div>
    </div>`
})
export class WhiteBoxComponent {

}
