import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { IGroupResponse } from 'src/app/interfaces/IGroupResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateGroupRequest } from 'src/app/interfaces/ICreateGroupRequest';
import { GroupType } from 'src/app/enums/groupType.enum';
import { AdminService } from 'src/app/services/administration.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup'
import { SharedUserDetailsService } from 'src/app/shared/shared-user-details.service';
import { UserDetails } from 'src/app/interfaces/IUserDetails';
import { ISimpleGameResponse } from 'src/app/interfaces/ISimpleGameResponse';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groups: IGroupResponse[] = [];
  userDetails: UserDetails;
  form: FormGroup;
  currentPage = 1;
  groupsPerPage = 4;
  openedPopup = false
  groupTypeDropdownOpen = false;
  selectedGroupTypeOption = null;
  groupTypeDropdownOptions = Object.values(GroupType);
  groupParticipants: UserDetails[] = []
  selectedGroup: IGroupResponse;
  currentUserEmail: string
  currentUserID: string
  currentGroup: string
  openedPopup2 = false
  userHistory: ISimpleGameResponse[] = []
  isLoading: boolean
  openedPopup3: boolean
  onClick: boolean;
  selectedOption = '';
  groupDropdownOptions: string[] = [];

  private readonly notifier: NotifierService;

  constructor(
    private groupService: GroupService,
    private fb: FormBuilder,
    private adminService: AdminService,
    private toast: NgToastService,
    private sharedUserService: SharedUserDetailsService,
    notifierService: NotifierService
  ) {
    this.form = this.fb.group({
      'groupName': ['', Validators.required],
    });
    this.notifier = notifierService;
  }

  createGroup(): void {
    if (this.form.valid && this.selectedGroupTypeOption) {
      const groupName = this.form.get('groupName').value;
      const groupType = this.selectedGroupTypeOption;
      const groupRequest: ICreateGroupRequest = {
        groupNumber: groupName,
        groupType: groupType
      };

      this.groupService.createNewGroup(groupRequest).subscribe(
        () => {
          this.form.reset();
          this.selectedGroupTypeOption = null;
          this.notifier.notify('success', 'Group has been created');
          this.fetchGroups();
        },
        (error: HttpErrorResponse) => {
          this.notifier.notify('error', error.message);
        }
      );
    }
  }

  toggleGroupTypeDropdown(): void {
    this.groupTypeDropdownOpen = !this.groupTypeDropdownOpen;
  }

  selectGroupTypeOption(option: GroupType): void {
    this.selectedGroupTypeOption = option;
    this.groupTypeDropdownOpen = false;
  }

  get totalPages(): number {
    return Math.ceil(this.groups.length / this.groupsPerPage);
  }

  get displayedGroups(): IGroupResponse[] {
    const startIndex = (this.currentPage - 1) * this.groupsPerPage;
    const endIndex = startIndex + this.groupsPerPage;
    return this.groups.slice(startIndex, endIndex);
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

  ngOnInit(): void {
    this.fetchGroups();
    this.groupParticipants;
    this.sharedUserService.getUserDetails().subscribe(userDetails => {
      this.userDetails = userDetails;
    });
  }

  fetchGroups(): void {
    this.isLoading = true
    this.groupService.fetchAllGroups().subscribe(
      (data) => {
        this.groups = [data].flatMap((subArray) => subArray).sort((a, b) => {
          if (a.groupType === GroupType.ADMIN_GROUP) {
            return -1;
          } else if (b.groupType === GroupType.ADMIN_GROUP) {
            return 1;
          } else {
            return 0;
          }
        });
        this.groupDropdownOptions = [data].flatMap((subArray) => subArray).map(group => group.groupNumber);
        this.isLoading = false
      },
      (error) => {
        console.error('Failed to fetch groups:', error);
      }
    );
  }

  openPopup(item) {
    this.isLoading = true
    this.adminService.fetchGroupParticipants(item).subscribe(
      (data) => {
        this.groupParticipants = data
        this.isLoading = false
      }
    )
    this.openedPopup = true
    this.currentGroup = item
  }

  closePopup() {
    this.openedPopup = false
  }

  deleteGroup(group) {
    this.groupService.deleteGroup(group.groupNumber).subscribe(
      () => {
        this.notifier.notify('success', 'Group has been deleted');
        this.openedPopup = false
        this.fetchGroups()
      },
      (error: HttpErrorResponse) => {
        this.notifier.notify('error', error.message);
      }
    )
  }

  deleteUserFromGroup(groupNumber, id) {
    this.groupService.deleteUserFromGroup(groupNumber, id).subscribe(
      () => {
        this.notifier.notify('success', 'User has been deleted from Group');
        this.openPopup(groupNumber)
        this.fetchGroups()
      },
      (error: HttpErrorResponse) => {
        this.notifier.notify('error', error.message);
      }
    )
  }

  clearGroup(group) {
    this.groupService.clearGroup(group.groupNumber).subscribe(
      () => {
        this.notifier.notify('success', 'Group has been cleared');
        this.openPopup(group.groupNumber)
        this.fetchGroups()
      },
      (error: HttpErrorResponse) => {
        this.notifier.notify('error', error.message);
      }
    )
  }

  openPopup2(id, email) {
    this.isLoading = true
    this.adminService.getCompletedGames(id).subscribe(
      (data) => {
        this.userHistory = data
        this.isLoading = false
      }
    )
    this.openedPopup2 = true
    this.currentUserEmail = email
  }

  closePopup2() {
    this.openedPopup2 = false
  }


  openPopup3(id, email) {
    this.openedPopup3 = true
    this.currentUserEmail = email
    this.currentUserID = id
  }

  closePopup3() {
    this.openedPopup3 = false
  }

  toggleClick() {
    this.onClick = !this.onClick;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.onClick = false;
  }

  onSubmit() {
    this.adminService.changeUserGroup(this.currentUserID, this.selectedOption).subscribe(
      () => {
        this.notifier.notify('success', 'User assigned to the selected group');
        this.closePopup3()
        this.openPopup(this.currentGroup)
        this.fetchGroups()
      },
      (error: HttpErrorResponse) => {
        this.notifier.notify('error', error.message);
      }
    )

  }

  get visiblePages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 3) {
      return this.pages;
    }

    const visiblePageCount = 1; // Number of visible pages around the current page
    let startPage = Math.max(currentPage - visiblePageCount, 1);
    let endPage = Math.min(currentPage + visiblePageCount, totalPages);

    if (startPage === 1) {
      endPage = startPage + visiblePageCount * 2;
    } else if (endPage === totalPages) {
      startPage = endPage - visiblePageCount * 2;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }
}
