import { Component, OnInit } from '@angular/core';
import { SharedGameDataService } from 'src/app/services/shared-game-data.service';
import { IGameResponse } from 'src/app/interfaces/IGameResponse';
import { CanDeactivateGuard } from 'src/app/services/can-deactivate.guard';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit, CanDeactivateGuard {
  tabelData = [];
  testData = [];
  age: number
  gender: string
  constructor(private sharedGameDataService: SharedGameDataService) { }

  ngOnInit() {
    this.fetchData();
  }

  canDeactivate() {
    return window.confirm('You are currently on the exam page. Are you sure you want to leave?');
  }

  fetchData() {
    this.sharedGameDataService.startTest$.subscribe((gameData: IGameResponse) => {
      if (gameData) {
        const { patient, bcAssessmentQuestions } = gameData;
        const bloodCount = patient.bloodCounts;
        this.gender = patient.gender
        this.age = patient.age
        this.tabelData = bloodCount;
        this.testData = bcAssessmentQuestions;
      }
    });
  }

  get displayedElements() {
    return this.testData.slice(0, 8);
  }

  get displayedElements2() {
    return this.tabelData.slice(8, 20);
  }
  Console(id, dataid) {
    console.log(id + " " + dataid)
  }
}
