import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-lang-switcher',
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.css']
})
export class LangSwitcherComponent {
  currentLang: string
  isExamPage: boolean
   
  constructor(private translate: TranslateService,
    private router: Router) {
    this.currentLang = 'en'
    translate.setDefaultLang(this.currentLang);
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is /exam
        this.isExamPage = event.url === '/exam';
      }
    });

  }

  switchLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }
}
