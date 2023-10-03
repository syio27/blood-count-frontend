import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedLanguageService {
    private language = new BehaviorSubject<string>("EN");
    language$ = this.language.asObservable();

    setLanguage(switchedLanguage: string) {
        this.language.next(switchedLanguage.toUpperCase());
    }
}
