import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedUserDetailsService } from './shared-user-details.service';
import { UserDetails } from '../interfaces/IUserDetails';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(
        private router: Router,
        private sharedUserDetailsService: SharedUserDetailsService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const expectedRoles = route.data['expectedRoles'];
        let user: UserDetails;
        this.sharedUserDetailsService.getUserDetails().subscribe(data => {
            user = data;
        })

        const userRole = user.role;

        if (expectedRoles.includes(userRole)) {
            return true;
        } else {
            this.router.navigate(['']);
            return false;
        }
    }
}
