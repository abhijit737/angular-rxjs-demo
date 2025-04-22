import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item-summary',
  template: `
    <div>Total Items: {{ itemCount }}</div>
  `,
  standalone: true
})
export class ItemSummaryComponent implements OnInit {
  itemCount: number = 0;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.items$.subscribe(items => this.itemCount = items.length);
  }
}
