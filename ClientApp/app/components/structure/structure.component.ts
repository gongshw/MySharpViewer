import { Component, Inject, AfterViewInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { DatabaseService, Column } from '../database/database.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
    selector: 'structure-panel',
    templateUrl: './structure.component.html',
    styleUrls: ['./structure.component.css']
})
export class StructurePanel {
    displayedColumns = ['field', 'type', 'key', 'extra', 'comment'];
    dataSource: ColumnsDataSource;
    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string, private database: DatabaseService) {
        this.dataSource = new ColumnsDataSource(database.columns);
    }
}

export class ColumnsDataSource extends DataSource<Column> {

    constructor(private columns: Observable<Column[]>) {
        super();
    }

    connect(): Observable<Column[]> {
        return this.columns;
    }
    disconnect(): void { }
}
