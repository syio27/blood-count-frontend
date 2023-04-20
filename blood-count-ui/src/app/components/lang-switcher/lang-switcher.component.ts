import { Component } from '@angular/core';

@Component({
  selector: 'app-lang-switcher',
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.css']
})
export class LangSwitcherComponent {
  currentLang = 'en';

  switchLang(lang: string) {
    this.currentLang = lang;
  }
}
