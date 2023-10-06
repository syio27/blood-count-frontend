import { Component } from "@angular/core";

@Component({
    selector: 'app-no-data',
    template:`
    <div class="flex justify-center items-center w-full h-full">
            <div class="flex flex-col">
                <div class="flex justify-center">
                    <div class="w-24 h-24 bg-center bg-cover md:w-32 md:h-32 bg-noData"></div>
                </div>
                <div class="flex justify-center text-center text-xl font-bold select-none text-gray-500">
                    <ng-content></ng-content>
                </div>
            </div>
        </div>
    `
})

export class NoDataComponent {

}