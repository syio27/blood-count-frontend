import { Component, OnInit } from '@angular/core';
import { Roles } from '../../../../enums/role.enum';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { AdminService } from 'src/app/services/administration.service';
import { SharedUserDetailsService } from 'src/app/services/shared-user-details.service';
import { NgToastService } from 'ng-angular-popup'
import { ISimpleGameResponse } from 'src/app/interfaces/ISimpleGameResponse';
import { ExportService } from 'src/app/services/export.service';
import { saveAs } from 'file-saver';
import { NotifierService } from 'angular-notifier';
import { HttpErrorResponse } from '@angular/common/http';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {
  Roles = Roles;
  openedPopup = false
  isMobile: boolean;
  currentCategory = Roles.Student;
  tableData: UserDetails[] = [];
  currentPage = 1;
  groupsPerPage = 10;
  userDetails: UserDetails;
  userHistory: ISimpleGameResponse[] = []
  currentUserEmail: string
  private readonly notifier: NotifierService;
  isBanned: boolean
  isLoading: boolean
  isBanLoading: boolean

  constructor(
    private adminService: AdminService,
    private sharedUserService: SharedUserDetailsService,
    private toast: NgToastService,
    private exportService: ExportService,
    notifierService: NotifierService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.notifier = notifierService;
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  changeCategory(role: Roles) {
    this.tableData = []
    this.currentCategory = role;
    this.fetchTableData(role);
  }

  ngOnInit() {
    this.fetchTableData(this.currentCategory);
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });

  }


  private fetchTableData(role: Roles) {
    this.isLoading = true
    if (this.isMobile) {
      this.adminService.fetchUsersByRole(role).subscribe(
        (userDetails: UserDetails[]) => {
          this.tableData = userDetails.map(item => {
            const parts = item.email.split('@');
            item.email = parts[0];
            return item;
          }).sort((a, b) => {
            if (a.groupNumber < b.groupNumber) {
              return -1;
            }
            if (a.groupNumber > b.groupNumber) {
              return 1;
            }
            return 0;
          });
          this.isLoading = false;
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
    this.adminService.fetchUsersByRole(role).subscribe(
      (userDetails: UserDetails[]) => {
        this.tableData = userDetails.sort((a, b) => {
          if (a.groupNumber < b.groupNumber) {
            return -1;
          }
          if (a.groupNumber > b.groupNumber) {
            return 1;
          }
          return 0;
        });
        this.isLoading = false
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  get totalPages(): number {
    return Math.ceil(this.tableData.length / this.groupsPerPage);
  }

  get displayedUsers(): UserDetails[] {
    const startIndex = (this.currentPage - 1) * this.groupsPerPage;
    const endIndex = startIndex + this.groupsPerPage;
    return this.tableData.slice(startIndex, endIndex);
  }


  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  banAdmin(id) {
    let foundUser;
    this.isBanLoading = true;
    this.adminService.ban(id).subscribe(
      () => {
        this.fetchTableData(this.currentCategory);
        this.isBanLoading = false;
        foundUser = this.tableData.find(user => user.id === id);
        if (foundUser.active) {
          this.notifier.notify('success', 'User has been banned');
        } else {
          this.notifier.notify('success', 'User has been unbanned');
        }
      }
    )
  }


  deleteUser(id) {
    this.adminService.deleteUserById(id).subscribe(
      () => {
        this.notifier.notify('success', 'User has been deleted');
        this.fetchTableData(this.currentCategory);
      },
      (error) => {
        this.notifier.notify('error', error.message);
      }
    )
  }
  openPopup(id, email) {
    this.adminService.getCompletedGames(id).subscribe(
      (data) => {
        this.userHistory = data
      }
    )
    this.openedPopup = true
    this.currentUserEmail = email
  }
  closePopup() {
    this.openedPopup = false
  }
  export() {
    this.exportService.exportGameStats().subscribe(data => {
      saveAs(data, `game statistics - ${new Date().toISOString()}.xlsx`);
    });
  }
}
