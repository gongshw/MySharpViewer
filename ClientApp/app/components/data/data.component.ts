import { Component, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { MdPaginator } from '@angular/material';
import { DatabaseService, Column } from '../database/database.service';
import { DataSource } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

@Component({
    selector: 'data-panel',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.css']
})
export class DataPanel implements AfterViewInit {
    displayedColumns: string[] = [];
    availableOperators: string[] = ["=", "!=", "IN", "LIKE"];
    dataSource = new RowsDataSource();;

    fieldFilter: FieldFilter = new FieldFilter();
    fieldFilterSubject = new Subject<FieldFilter>();


    @ViewChild('paginator') paginator: MdPaginator;

    constructor(public http: Http, @Inject('BASE_URL') private baseUrl: string, private database: DatabaseService) { }

    ngAfterViewInit(): void {
        Observable.merge(this.fieldFilterSubject, this.paginator.page, this.database.columns).flatMap(() => {
            let limit = this.paginator.pageSize;
            let offset = limit * this.paginator.pageIndex;
            let sql = `select * from ${this.database.table} ${this.fieldFilter.sql()} limit ${offset}, ${limit}`;
            return this.database.query(sql);
        }).flatMap(result => {
            this.displayedColumns = result.json()['meta'];
            let data = result.json()['data'];
            console.log(data)
            this.dataSource.data.next(data.map((e: any[]) => {
                return e.reduce((map, ele, index) => {
                    map[this.displayedColumns[index]] = ele;
                    return map;
                }, {})
            }));
            let sql = `select count(*) from ${this.database.table} ${this.fieldFilter.sql()}`;
            return this.database.query(sql);
        }).subscribe(result => { this.paginator.length = parseInt(result.json()['data'][0][0]); });
    }

    updateFilter() {
        this.fieldFilterSubject.next(this.fieldFilter);
    }
}

export class FieldFilter {
    constructor(public field: string = "", public operator: string = "", public value: string = "") { }

    valid(): boolean {
        return this.field != "" && this.operator != "";
    }

    sql(): string {
        return this.valid() ? `where ${this.field} ${this.operator} '${this.value}'` : "";
    }
}

class RowsDataSource extends DataSource<object> {

    public data = new Subject<object[]>();

    connect(): Observable<object[]> {
        return this.data;
    }
    disconnect(): void { }
}
