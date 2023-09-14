import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SharedLanguageService } from 'src/app/services/shared-lang.service';

@Component({
  selector: 'app-lang-switcher',
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.css']
})
export class LangSwitcherComponent {
  currentLang: string;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private langService: SharedLanguageService
  ) {

    this.currentLang = localStorage.getItem('currentLang') || 'en';
    translate.setDefaultLang(this.currentLang);
    translate.use(this.currentLang);
    this.langService.setLanguage(this.currentLang);
  }

  switchLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    this.langService.setLanguage(lang);

    localStorage.setItem('currentLang', lang);
  }
}
