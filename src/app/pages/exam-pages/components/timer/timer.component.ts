import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IGameResponse } from 'src/app/interfaces/IGameResponse';
import { Pages } from 'src/app/enums/pages';

@Component({
  selector: 'exam-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnChanges, OnInit {
  remainingTime: number;
  minutes: number;
  seconds: string;
  countdownInterval: any;
  isTestFinished: boolean = false;

  @Input() submitted: string;
  @Input() gameData: IGameResponse;
  @Input() currentPage: Pages;
  @Input() noTimer: boolean;
  @Output() timeUp: EventEmitter<any> = new EventEmitter();

  showBorder = false;

  constructor() { }

  ngOnInit(): void {
    // Initialize the timer and start if gameData is already available on component load
    if (this.gameData) {
      this.initializeTimer();
      this.startTimer();
    }

    // Border animation logic
    this.showBorder = true;  // Start with the orange border
    setTimeout(() => {
      this.showBorder = false;  // Remove the orange border after 1 second
    }, 1300);
  }

  ngOnChanges(changes: SimpleChanges) {
    // React to changes in gameData and other inputs
    if (changes['gameData'] && changes['gameData'].currentValue) {
      this.initializeTimer();
      this.startTimer();
    }
  }

  // Timer Initialization
  initializeTimer() {
    const currentTime = Math.floor(new Date(this.gameData.currentServerTime).getTime() / 1000);
    const estimatedEndTime = Math.floor(new Date(this.gameData.estimatedEndTime).getTime() / 1000);
    this.remainingTime = Math.max(estimatedEndTime - currentTime, 0);
  }

  // Start the countdown
  startTimer() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval); // Clear any existing interval
    }

    this.countdownInterval = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        clearInterval(this.countdownInterval);
        this.isTestFinished = true;
        this.timeUp.emit();
      }

      if (this.submitted === 'COMPLETED') {
        clearInterval(this.countdownInterval);
      }

      this.updateDisplayTime();
    }, 1000);

    // Immediately update the display
    this.updateDisplayTime();
  }

  // Update the time shown in minutes and seconds
  updateDisplayTime() {
    this.minutes = Math.floor(this.remainingTime / 60);
    const secondsValue = this.remainingTime % 60;
    this.seconds = secondsValue < 10 ? `0${secondsValue}` : `${secondsValue}`;
  }

  // Assessment Text (based on currentPage)
  get assessmentText(): string {
    switch (this.currentPage) {
      case Pages.ONE:
        return 'Blood Count Assessment';
      case Pages.TWO:
        return 'Diagnosis Multiple Set of Questions';
      case Pages.THREE:
        return 'Submission';
      case Pages.FOUR:
        return 'Finish';
      default:
        return '';
    }
  }
}
