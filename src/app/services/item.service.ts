import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemsSubject = new BehaviorSubject<Item[]>([]);
  public items$ = this.itemsSubject.asObservable();
  private apiUrl = 'https://localhost:7122/api/Items';

  constructor(private http: HttpClient) {
    console.log('ItemService: Attempting to connect to API at:', this.apiUrl);
    this.fetchItems().subscribe({
      next: (items) => console.log('Successfully loaded initial items:', items),
      error: (error) => {
        console.error('Error loading initial items:', error);
        if (error.message.includes('SSL')) {
          console.log('SSL Error detected. If using Chrome, please navigate to:', this.apiUrl);
          console.log('And click "Advanced" -> "Proceed to localhost (unsafe)" to accept the certificate');
        }
      }
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error Details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message
    });

    let errorMessage = 'An error occurred';
    
    if (error.status === 0) {
      if (error.error instanceof ProgressEvent) {
        errorMessage = 'Cannot connect to the API. Please ensure that:\n1. The backend server is running\n2. You have accepted the SSL certificate by visiting ' + this.apiUrl;
      } else {
        errorMessage = 'Network error occurred. Please check your connection';
      }
    } else if (error.status === 404) {
      errorMessage = 'API endpoint not found';
    } else {
      errorMessage = `Server error: ${error.status} ${error.statusText}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  }

  fetchItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl).pipe(
      tap(items => {
        console.log('Received items from API:', items);
        this.itemsSubject.next(items);
      }),
      catchError(this.handleError)
    );
  }

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`).pipe(
      tap(item => console.log('Retrieved item:', item)),
      catchError(this.handleError)
    );
  }

  addItem(newItem: Item): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, newItem).pipe(
      tap(item => {
        console.log('Added new item:', item);
        const currentItems = this.itemsSubject.value;
        this.itemsSubject.next([...currentItems, item]);
      }),
      catchError(this.handleError)
    );
  }

  updateItem(id: number, item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${id}`, item).pipe(
      tap(updatedItem => {
        console.log('Updated item:', updatedItem);
        const currentItems = this.itemsSubject.value;
        const index = currentItems.findIndex(i => i.id === id);
        if (index !== -1) {
          const updatedItems = [...currentItems];
          updatedItems[index] = updatedItem;
          this.itemsSubject.next(updatedItems);
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log('Deleted item:', id);
        const currentItems = this.itemsSubject.value;
        const updatedItems = currentItems.filter(item => item.id !== id);
        this.itemsSubject.next(updatedItems);
      }),
      catchError(this.handleError)
    );
  }
}
