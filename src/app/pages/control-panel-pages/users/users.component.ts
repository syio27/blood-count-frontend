import { Component, OnInit } from '@angular/core';
import { Roles } from 'src/app/enums/role.enum';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { AdminService } from 'src/app/services/administration.service';
import { SharedUserDetailsService } from 'src/app/shared/shared-user-details.service';
import { ISimpleGameResponse } from 'src/app/interfaces/ISimpleGameResponse';
import { ExportService } from 'src/app/services/export.service';
import { saveAs } from 'file-saver';
import { NotifierService } from 'angular-notifier';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-users-page',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
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
  activeBanId: string;

  constructor(
    private adminService: AdminService,
    private sharedUserService: SharedUserDetailsService,
    private exportService: ExportService,
    notifierService: NotifierService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.notifier = notifierService;

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
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result: BreakpointState) => {
        this.isMobile = result.matches;
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
        else {
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
      });
  }

  banAdmin(id) {
    let foundUser;
    this.isBanLoading = true;
    this.activeBanId = id;
    this.adminService.ban(id).subscribe(
      () => {
        this.fetchTableData(this.currentCategory);
        this.isBanLoading = false;
        this.activeBanId = '';
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
    this.isLoading = true
    this.adminService.getCompletedGames(id).subscribe(
      (data) => {
        this.userHistory = this.sortByDateField(data, 'endTime').reverse();
        this.isLoading = false
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

  sortByDateField<T>(array: T[], fieldName: string): T[] {
    return array.sort((a: any, b: any) => {
      return new Date(a[fieldName]).getTime() - new Date(b[fieldName]).getTime();
    });
  }
}
