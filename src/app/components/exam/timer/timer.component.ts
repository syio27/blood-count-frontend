import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedGameDataService } from 'src/app/services/shared-game-data.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  remainingTime: number;
  minutes: number;
  seconds: string;
  countdownInterval: any;
  isTestFinished: boolean = false;

  @Output() timeUp: EventEmitter<any> = new EventEmitter();

  constructor(
    private sharedGameDataService: SharedGameDataService,
    private gameService: GameService,
  ) { }

  ngOnInit() {
    this.initializeTimer();
    this.startTimer();
  }

  initializeTimer() {
    const currentTime = Math.floor(Date.now() / 1000);
    const gameData = this.sharedGameDataService.startTest$;
    gameData.subscribe(data => {
      const startTime = Math.floor(new Date(data.startTime).getTime() / 1000);
      const estimatedEndTime = Math.floor(new Date(data.estimatedEndTime).getTime() / 1000);
      const elapsedTime = currentTime - startTime;
      this.remainingTime = Math.max(estimatedEndTime - currentTime, 0);
    });
  }

  startTimer() {
    this.countdownInterval = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 1) {
        clearInterval(this.countdownInterval);
        this.isTestFinished = true;
        this.timeUp.emit(); // Emit the event when the time is up
      }

      this.updateDisplayTime();
    }, 1000);
  }

  updateDisplayTime() {
    this.minutes = Math.floor(this.remainingTime / 60);
    const secondsValue = this.remainingTime % 60;
    this.seconds = secondsValue < 10 ? `0${secondsValue}` : `${secondsValue}`;
  }
}
