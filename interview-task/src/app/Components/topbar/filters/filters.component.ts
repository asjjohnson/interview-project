import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/common.service';
import { SharedDataService } from 'src/app/shared-data.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  data: any;
  apiData: any;
  peopleDetails: any;
  selectedValues: any;
  isloading: boolean = true;
  choosededValues: any;
  @ViewChild('searchButton') searchButton!: ElementRef;
  constructor(private allApi: CommonService,private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    this.sharedDataService.selectedValueCriteria.subscribe(criteria => {
      console.log("selectjghjfgj",criteria);
    this.choosededValues = criteria
    });
    this.getAllApiData();
  }

  getAllApiData() {
    this.allApi.getAllApi().subscribe(
      (data) => {
        this.apiData = data;
       
      },
      (error) => {
        console.error('Error fetching data', error); // Handle the error
      }
    );
  }

  getAllDetails(value:any) {
    this.isloading=false;
    let data 

  data = this.apiData[value];
  console.log('Data:', data);
    this.allApi.getAlldetails(data).subscribe((data) => {
      this.peopleDetails = data;
      console.log(this.peopleDetails);
      this.isloading=true;
    });
  }

    selectValue(value: any,type:any): void {
    localStorage.setItem('type',type);
    this.selectedValues = value // Store value in array
    console.log('selectedValues', this.selectedValues);
  }

  onSearch() {
    this.sharedDataService.updateFilterCriteria(this.selectedValues);
  }
  goBack(){
    this.choosededValues = []
  }
}
