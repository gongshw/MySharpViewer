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
        this.database.database = '';
        this.database.table = '';
    }

    public updateTable(event: Event) {
        this.http.post(
            this.baseUrl + 'api/Database/Query',
            JSON.stringify({
                database: this.database.database,
                sql: "show full columns from " + this.database.table
            }),
            new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) })
        ).subscribe(
            result => {
                var struct = result.json();
                console.log(struct);
                this.database.columns.next(struct.data.map(
                    (e: any) => {
                        return {
                            field: e[0],
                            type: e[1],
                            key: e[4],
                            extra: e[6],
                            comment: e[8],
                        }
                    }
                ));
            },
            error => console.error(error),
            () => this.loading = false
            );
    }
}
