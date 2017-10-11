import { Injectable, Inject } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

@Injectable()
export class DatabaseService {
    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {

    }
    public instance?: InstanceConnection;

    public database: string;

    public table: string;

    public columns: Subject<Column[]> = new Subject();

    currentDb(): any {
        if (!this.database || !this.instance) {
            return null;
        }
        return this.instance.instance.databases.find(db => { return db['name'] == this.database });
    }

    query(sql: string): Observable<Response> {
        console.log(sql);
        return this.http.post(
            this.baseUrl + 'api/Database/Query',
            JSON.stringify({
                database: this.database,
                sql: sql
            }),
            new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) })
        );
    }
}

export interface InstanceConnection {
    instance: Instance;
}
export interface Instance {
    databases: any[];
}

export class Connection {
    constructor(
        public host: string = 'localhost',
        public port: number = 3306,
        public username: string = 'root',
        public password: string = 'root',
        public database: string = ''
    ) { }
}
export interface Column {
    field: string;
    type: string;
    key: string;
    extra: string;
    comment: string;
}