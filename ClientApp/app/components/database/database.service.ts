import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class DatabaseService {
    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string) {

    }
    public instance?: InstanceConnection;

    public database: string;

    public table: string;

    currentDb(): any {
        if (!this.database || !this.instance) {
            return null;
        }
        return this.instance.instance.databases.find(db => { return db['name'] == this.database });
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
