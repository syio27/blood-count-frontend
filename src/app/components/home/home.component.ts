import { Component, OnInit, ViewChild } from '@angular/core';
import { CaseService } from 'src/app/services/case.service';
import { ICaseResponse } from 'src/app/interfaces/ICaseResponse';
import { TimerComponent } from '../exam/timer/timer.component';
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(TimerComponent) timerComponent: TimerComponent;

  onClick = false;
  dropdownOptions: string[] = [];
  selectedOption = null;
  isTestFinished = localStorage.getItem('isTestFinished')

  constructor(private caseService: CaseService,
    private router: Router) { }

  toggleClick() {
    this.onClick = !this.onClick;
  }

  ngOnInit() {
    this.fetchCase();
  }

  fetchCase() {
    this.caseService.getAllCasesWithAbnormalities().subscribe((cases) => {
      this.dropdownOptions = [cases].flatMap((subArray) => subArray).map((cases) => cases.anemiaType);
    });
    this.isTestFinished = localStorage.getItem('isTestFinished')
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.onClick = false;
  }

  startTest(id) {
    if (id == 1) {
      var navigationExtras: NavigationExtras = {
        queryParams: {
          "status": "start",
        }
      };
    } else if (id == 2) {
      var navigationExtras: NavigationExtras = {
        queryParams: {
          "status": "continue",
        }
      }
    }
    console.log(this.isTestFinished)
    this.router.navigate(["/exam"], navigationExtras);
  }
}
