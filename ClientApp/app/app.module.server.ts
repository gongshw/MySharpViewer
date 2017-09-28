import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModuleShared } from './app.module.shared';
import { AppComponent } from './components/app/app.component';
import { DatabaseService } from './components/database/database.service';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    bootstrap: [AppComponent],
    imports: [
        ServerModule,
        AppModuleShared,
        NoopAnimationsModule
    ],
    providers: [DatabaseService]
})
export class AppModule {
}
