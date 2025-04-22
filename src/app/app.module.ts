import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemSummaryComponent } from './components/item-summary/item-summary.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    AppComponent, // Import standalone component
    ItemListComponent, // Import standalone component
    ItemSummaryComponent // Import standalone component
  ],
  providers: []
})
export class AppModule { }
