import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { SharedGameSubmittedService } from './shared-game-submitted.service';


export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}


@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(
    private sharedGameSubmittedService: SharedGameSubmittedService
  ) { }

  canDeactivate(component: CanComponentDeactivate) {
    let submitted: string;
    this.sharedGameSubmittedService.gameStatus$.subscribe(
      data => {
        submitted = data;
      }
    )
    if (submitted != 'IN_PROGRESS') {
      return true
    }
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
