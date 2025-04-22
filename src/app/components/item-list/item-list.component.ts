import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-list',
  template: `
    <div class="container">
      <h2>Item List</h2>
      <div *ngIf="error" class="error-banner">
        {{ error }}
      </div>
      <ul class="item-list">
        <li *ngFor="let item of items" class="item-card">
          <div *ngIf="editingId !== item.id" class="item-display">
            <div class="item-info">
              <strong>{{ item.name }}</strong>
              <p>{{ item.description }}</p>
            </div>
            <div class="item-actions">
              <button class="btn edit" (click)="startEdit(item)">Edit</button>
              <button class="btn delete" (click)="deleteItem(item.id)">Delete</button>
            </div>
          </div>
          <div *ngIf="editingId === item.id" class="item-edit">
            <input [(ngModel)]="editingItem.name" placeholder="Name" class="edit-input">
            <input [(ngModel)]="editingItem.description" placeholder="Description" class="edit-input">
            <div class="edit-actions">
              <button class="btn save" (click)="saveEdit()">Save</button>
              <button class="btn cancel" (click)="cancelEdit()">Cancel</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .item-list {
      list-style: none;
      padding: 0;
    }
    .item-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .item-display {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .item-info {
      flex-grow: 1;
    }
    .item-actions {
      display: flex;
      gap: 10px;
    }
    .item-edit {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .edit-input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .edit-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    .edit {
      background: #4a90e2;
      color: white;
    }
    .delete {
      background: #e74c3c;
      color: white;
    }
    .save {
      background: #2ecc71;
      color: white;
    }
    .cancel {
      background: #95a5a6;
      color: white;
    }
    .error-banner {
      background-color: #f8d7da;
      color: #721c24;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ItemListComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  editingId: number | null = null;
  editingItem: Item = { id: 0, name: '', description: '' };
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.itemService.items$.subscribe({
        next: (items) => {
          console.log('Received items in component:', items);
          this.items = items;
          this.error = null;
        },
        error: (err) => {
          console.error('Error in items subscription:', err);
          this.error = 'Error loading items';
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  startEdit(item: Item): void {
    this.editingId = item.id;
    this.editingItem = { ...item };
  }

  saveEdit(): void {
    if (this.editingId && this.editingItem) {
      this.error = null;
      this.itemService.updateItem(this.editingId, this.editingItem).subscribe({
        next: () => {
          this.cancelEdit();
        },
        error: (err) => {
          console.error('Error updating item:', err);
          this.error = 'Failed to update item';
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingItem = { id: 0, name: '', description: '' };
    this.error = null;
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.error = null;
      this.itemService.deleteItem(id).subscribe({
        error: (err) => {
          console.error('Error deleting item:', err);
          this.error = 'Failed to delete item';
        }
      });
    }
  }
}
