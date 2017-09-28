import { Component, Inject, AfterViewInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { DatabaseService, Connection } from '../database/database.service';

@Component({
    selector: 'connection-panel',
    templateUrl: './connection.component.html',
    styleUrls: ['./connection.component.css']
})
export class ConnectionPanel implements AfterViewInit {

    public loading: boolean = true;

    public initing: boolean = true;

    public error: string;

    public connection: Connection = new Connection();

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string, private database: DatabaseService) {
    }

    ngAfterViewInit(): void {
        this.http.get(this.baseUrl + 'api/Database/Info').subscribe(result => {
            console.debug(result)
            if (result.status == 200) {
                this.database.instance = result.json();
            }
        }, error => console.error(error), () => { this.loading = false, this.initing = false });
    }

    public openConnection() {
        console.log('openConnection');
        this.loading = true;
        this.http.post(
            this.baseUrl + 'api/Database/Connect',
            JSON.stringify(this.connection),
            new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) })
        ).subscribe(
            result => {
                this.database.instance = result.json()['connection'];
                this.error = result.json()['message'];
            },
            error => console.error(error),
            () => this.loading = false
            );
    }

    public closeConnection() {
        this.database.instance = undefined;
    }
}
