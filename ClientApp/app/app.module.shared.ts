import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './components/app/app.component';
import { ConnectionPanel } from "./components/connection/connection.component";
import { StructurePanel } from "./components/structure/structure.component";
import { DataPanel } from "./components/data/data.component";

import { MatButtonModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { MatTableModule } from '@angular/material';
import {MatPaginatorModule} from '@angular/material';

@NgModule({
    declarations: [
        AppComponent, ConnectionPanel, StructurePanel, DataPanel
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        MatTabsModule,
        MatInputModule,
        MatProgressBarModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatToolbarModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule
    ]
})
export class AppModuleShared {
}
