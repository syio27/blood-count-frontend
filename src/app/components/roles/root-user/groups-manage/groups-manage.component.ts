import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../../../services/group.service';
import { IGroupResponse } from '../../../../interfaces/IGroupResponse';

@Component({
  selector: 'app-groups-manage',
  templateUrl: './groups-manage.component.html',
  styleUrls: ['./groups-manage.component.css']
})
export class GroupsManageComponent implements OnInit {
  groups: IGroupResponse[] = [];

  currentPage = 1;
  groupsPerPage = 4;

  constructor(private groupService: GroupService) {}

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
  }

  fetchGroups(): void {
    this.groupService.fetchAllGroups().subscribe(
      (data) => {
        this.groups = [data].flatMap((subArray) => subArray).sort((a, b) => {
          if (a.groupType === 'ADMIN_GROUP') {
            return -1; 
          } else if (b.groupType === 'ADMIN_GROUP') {
            return 1;
          } else {
            return 0; 
          }
        });
      },
      (error) => {
        console.error('Failed to fetch groups:', error);
      }
    );
  }
}
