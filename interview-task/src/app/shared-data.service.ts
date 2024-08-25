import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  
  private filterCriteriaSource = new BehaviorSubject<string[]>([]);
  currentFilterCriteria = this.filterCriteriaSource.asObservable();

  private selectedValue = new BehaviorSubject<string[]>([]);
  selectedValueCriteria = this.selectedValue.asObservable();

  updateFilterCriteria(criteria: string[]) {
    console.log('fgfd', criteria)
    this.filterCriteriaSource.next(criteria);
  }

  sharedvalue(criteria: string[]) {
    console.log('select', criteria)
    this.selectedValue.next(criteria);
  }
}
