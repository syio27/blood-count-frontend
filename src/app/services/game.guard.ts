import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { tap, Observable, map } from 'rxjs';
import { GameService } from './game.service';
import { SharedUserDetailsService } from './shared-user-details.service';

@Injectable({
  providedIn: 'root',
})
export class GameGuard implements CanActivate {
  constructor(
    private router: Router,
    private gameService: GameService,
    private SharedUserDetailsService: SharedUserDetailsService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let userId;
    this.SharedUserDetailsService.getUserDetails().subscribe(userDetails => {
      userId = userDetails.id;
    });
    return this.gameService.checkIfAnyInProgress(userId).pipe(
      map(response => {
        const inProgress = response.inProgress;
        if (inProgress) {
          return true;
        } else {
          this.router.navigate(['']);
          return false;
        }
      })
    );
  }
}
