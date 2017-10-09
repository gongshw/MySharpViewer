import { Component } from '@angular/core';
import { DatabaseService } from '../database/database.service';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private database: DatabaseService) {

    }
}
