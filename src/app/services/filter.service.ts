import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FilterState {
  selectedCategoryId: number;
  keyword: string;
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterStateSubject = new BehaviorSubject<FilterState>({
    selectedCategoryId: 0,
    keyword: '',
    currentPage: 0
  });

  public filterState$: Observable<FilterState> = this.filterStateSubject.asObservable();

  constructor() { }

  // Update filter state
  updateFilter(filterState: Partial<FilterState>) {
    const currentState = this.filterStateSubject.value;
    const newState = { ...currentState, ...filterState };
    this.filterStateSubject.next(newState);
  }

  // Get current filter state
  getCurrentFilterState(): FilterState {
    return this.filterStateSubject.value;
  }

  // Reset filter to default
  resetFilter() {
    this.filterStateSubject.next({
      selectedCategoryId: 0,
      keyword: '',
      currentPage: 0
    });
  }

  // Set category filter
  setCategoryFilter(categoryId: number) {
    this.updateFilter({ selectedCategoryId: categoryId, currentPage: 0 });
  }

  // Set keyword filter
  setKeywordFilter(keyword: string) {
    this.updateFilter({ keyword, currentPage: 0 });
  }

  // Set page
  setPage(page: number) {
    this.updateFilter({ currentPage: page });
  }
} 