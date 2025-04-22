import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-add-item',
  template: `
    <div class="add-item-container">
      <h2>Add New Item</h2>
      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
      <div *ngIf="success" class="success-message">
        Item added successfully!
      </div>
      <form (ngSubmit)="addItem()" #itemForm="ngForm" class="add-item-form">
        <div class="form-group">
          <input 
            [(ngModel)]="itemName" 
            name="name" 
            placeholder="Item Name" 
            required 
            #name="ngModel"
            class="form-input"
          >
          <div *ngIf="name.invalid && (name.dirty || name.touched)" class="error-message">
            Name is required
          </div>
        </div>
        
        <div class="form-group">
          <input 
            [(ngModel)]="itemDescription" 
            name="description" 
            placeholder="Item Description" 
            required 
            #description="ngModel"
            class="form-input"
          >
          <div *ngIf="description.invalid && (description.dirty || description.touched)" class="error-message">
            Description is required
          </div>
        </div>

        <button 
          type="submit" 
          [disabled]="!itemForm.form.valid"
          class="submit-button">
          Add Item
        </button>
      </form>
    </div>
  `,
  styles: [`
    .add-item-container {
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;
    }
    .add-item-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .form-input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .error-message {
      color: #dc3545;
      font-size: 14px;
      margin-top: 5px;
      padding: 10px;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }
    .success-message {
      color: #155724;
      font-size: 14px;
      margin-bottom: 15px;
      padding: 10px;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
    }
    .submit-button {
      padding: 10px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    .submit-button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AddItemComponent {
  itemName: string = '';
  itemDescription: string = '';
  error: string | null = null;
  success: boolean = false;

  constructor(private itemService: ItemService) {}

  addItem(): void {
    if (this.itemName && this.itemDescription) {
      this.error = null;
      this.success = false;
      
      const newItem: Item = {
        id: 0, // Will be set by the server
        name: this.itemName,
        description: this.itemDescription,
      };
      
      this.itemService.addItem(newItem).subscribe({
        next: () => {
          this.itemName = '';
          this.itemDescription = '';
          this.success = true;
          setTimeout(() => this.success = false, 3000); // Hide success message after 3 seconds
        },
        error: (err) => {
          console.error('Error adding item:', err);
          this.error = 'Failed to add item. Please try again.';
        }
      });
    }
  }
}