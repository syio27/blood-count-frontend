import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-lang-switcher',
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.css']
})
export class LangSwitcherComponent {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
  }
  currentLang = 'en';

  switchLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }
}
