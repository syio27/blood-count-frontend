import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { IGameResponse } from 'src/app/interfaces/IGameResponse';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnChanges {
  remainingTime: number;
  minutes: number;
  seconds: string;
  countdownInterval: any;
  isTestFinished: boolean = false;

  @Input() submitted: string
  @Input() gameData: IGameResponse
  @Output() timeUp: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.initializeTimer(changes);
    this.startTimer(changes);
  }

  initializeTimer(changes: SimpleChanges) {
    if (changes['gameData'] && changes['gameData'].currentValue) {
      const currentTime = Math.floor(Date.now() / 1000);
      const estimatedEndTime = Math.floor(new Date(this.gameData.estimatedEndTime).getTime() / 1000);
      this.remainingTime = Math.max(estimatedEndTime - currentTime, 0);
      console.log(estimatedEndTime)
    }

  }

  startTimer(changes: SimpleChanges) {
    if (changes['gameData'] && changes['gameData'].currentValue) {
      this.countdownInterval = setInterval(() => {
        this.remainingTime--;

        if (this.remainingTime <= 0) {
          clearInterval(this.countdownInterval);
          this.isTestFinished = true;
          this.timeUp.emit(); // Emit the event when the time is up
        }

        if (this.submitted === 'COMPLETED') {
          clearInterval(this.countdownInterval); // Stop the timer if the test is completed 
        }

        this.updateDisplayTime();
      }, 1000);
    }
  }


  updateDisplayTime() {
    this.minutes = Math.floor(this.remainingTime / 60);
    const secondsValue = this.remainingTime % 60;
    this.seconds = secondsValue < 10 ? `0${secondsValue}` : `${secondsValue}`;
  }
}
