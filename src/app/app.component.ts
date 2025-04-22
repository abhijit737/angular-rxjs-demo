import { Component } from '@angular/core';
import { ItemListComponent } from './components/item-list/item-list.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { ItemSummaryComponent } from './components/item-summary/item-summary.component';

@Component({
  selector: 'app-root',
  template: `
    <app-add-item></app-add-item>
    <app-item-list></app-item-list>
    <app-item-summary></app-item-summary>
  `,
  standalone: true,
  imports: [ItemListComponent, AddItemComponent, ItemSummaryComponent],
})
export class AppComponent {}