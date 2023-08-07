import { Component } from '@angular/core';

@Component({
  selector: 'app-part2',
  templateUrl: './part2.component.html',
  styleUrls: ['./part2.component.css']
})
export class Part2Component {
  faqs = [
    {
      id: 1,
      question: 'What is your favorite color?',
      options: ['Red', 'Blue', 'Green', 'Yellow']
    },
    {
      id: 2,
      question: 'Which programming language do you prefer?',
      options: ['JavaScript', 'Python', 'Java', 'C#']
    },
    // Add more FAQs here
  ];
}
