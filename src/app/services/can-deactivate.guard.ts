import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate) {
    let submitted = localStorage.getItem('submitted')
    if(submitted != 'IN_PROGRESS'){
      return true
    }
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
