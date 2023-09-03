import { Component, OnInit, HostListener } from '@angular/core';
import { ReferenceTableService } from '../../services/reference-table.service';
import { IReferenceTable } from '../../interfaces/IReferenceTable';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-cbc-table',
  templateUrl: './cbc-table.component.html',
  styleUrls: ['./cbc-table.component.css']
})
export class CbcTableComponent implements OnInit {
  cbcData: IReferenceTable[] = [];
  private resizeSubject = new Subject<Event>();
  showTooltip = window.innerWidth > 450;
  showTooltipInfo: boolean = false;
  isLoading: boolean

  constructor(private referenceTableService: ReferenceTableService) {
    this.resizeSubject.pipe(
      debounceTime(200)  // Adjust debounce time as needed
    ).subscribe(event => {
      this.showTooltip = window.innerWidth > 450;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeSubject.next(event);
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true
    this.referenceTableService.fetchBCReferenceTable().subscribe(
      (data) => {
        this.cbcData = [data].flatMap((subArray) => subArray);
        this.isLoading = false
      },
      (error) => {
        console.error('Failed to fetch data:', error);
      }
    );
  }

}
