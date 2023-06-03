import { Component } from '@angular/core';

@Component({
  selector: 'app-groups-manage',
  templateUrl: './groups-manage.component.html',
  styleUrls: ['./groups-manage.component.css']
})
export class GroupsManageComponent {
  groups = []; 

  currentPage = 1;
  groupsPerPage = 4;

  get totalPages(): number {
    return Math.ceil(this.groups.length / this.groupsPerPage);
  }

  get displayedGroups(): any[] {
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
    this.populateGroups();
  }

  populateGroups(): void {
    this.groups = [
      { number: 1, totalStudents: 20 },
      { number: 2, totalStudents: 15 },
      { number: 3, totalStudents: 18 },
      { number: 4, totalStudents: 12 },
      { number: 5, totalStudents: 25 },
      { number: 6, totalStudents: 16 },
      { number: 7, totalStudents: 22 },
      { number: 8, totalStudents: 19 },
      { number: 9, totalStudents: 17 },
      { number: 10, totalStudents: 23 },
    ];
  }
}
