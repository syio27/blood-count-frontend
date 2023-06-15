import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  remainingTime: number;
  initialTime: number = 1800;
  minutes: number;
  seconds: any;
  countdownInterval: any;
  status: string;
  isTestFinished: boolean = false;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.status = params['status'];
    });
  }

  ngOnInit() {
    this.fetchTimer();
  }

  initializeTimer() {
    const savedTime = localStorage.getItem('timerCountdown');
    if (savedTime) {
      const savedTimestamp = parseInt(savedTime, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsedTime = currentTime - savedTimestamp;
      this.remainingTime = Math.max(1800 - elapsedTime, 0);
    } else {
      this.remainingTime = 1800;
    }
  }

  startTimer() {
    this.countdownInterval = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        clearInterval(this.countdownInterval);
        this.isTestFinished = true;
        this.saveTimer();
      }

      this.updateDisplayTime();
    }, 1000);
  }

  fetchTimer() {
    if (this.status === 'start') {
      this.saveTimer();
      clearInterval(this.countdownInterval);
      this.initializeTimer();
      this.startTimer();
    } else {
      this.initializeTimer();
      this.startTimer();
    }
  }

  updateDisplayTime() {
    this.minutes = Math.floor(this.remainingTime / 60);
    if (this.remainingTime % 60 >= 10) {
      this.seconds = ':' + this.remainingTime % 60;
    } else {
      this.seconds = ':0' + this.remainingTime % 60;
    }
  }

  saveTimer() {
    localStorage.setItem('timerCountdown', Math.floor(Date.now() / 1000).toString());
    localStorage.setItem('isTestFinished', this.isTestFinished.toString());
  }

}
