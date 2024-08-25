import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { SharedDataService } from 'src/app/shared-data.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  constructor(private allApi: CommonService,private sharedDataService: SharedDataService){}

apiData: any;
peopleDetails: any;
receivedFilterCriteria: any;
filteredPeopleDetails: string[] = [];
currentPage: number = 1;
totalPages: number = 0;
itemsPerPage: number = 5;
isloading: boolean = true;
isShow:boolean=true;
dataItems: any[] = []; // Your data source
currentPg: number = 1;
itemsPerPageCount: number = 10; // Number of items per page
people:any
species:any;
films:any;
  ngOnInit(){
    this.isloading= true;
    this.sharedDataService.currentFilterCriteria.subscribe(criteria => {
      console.log("criteria",criteria);
      this.receivedFilterCriteria = criteria;
      this.peopleDetails = []
      let type =  localStorage.getItem('type');
      if(type =='species'){
        this.callPeople(this.receivedFilterCriteria?.people)
      }else if(type == 'vehicle'){
        this.getFlims(this.receivedFilterCriteria?.films)
      }else if(type == 'star'){
        this.getFlims(this.receivedFilterCriteria?.films)
      }
      else{
        this.getmultiplevalue( this.receivedFilterCriteria?.characters ,  this.receivedFilterCriteria?.species)
      }
    
    });
    this.getAllApiData();
    this.getAllDetails(this.currentPage);
}

getAllApiData() {
  this.allApi.getAllApi().subscribe(
    data => {
      this.apiData = data;
      this.allApi.changeData( this.apiData);
      console.log(data); 
      console.log("f", this.allApi.Api); 
      this.getAllDetails(this.currentPage);
    },
    error => {
      console.error('Error fetching data', error); 
    }
  );
}

getAllDetails(page: number) {
  this.isloading= false;
  const url = `https://swapi.dev/api/people/?page=${page}`;
  this.allApi.getAlldetails(url).subscribe((data:any) => {
    this.peopleDetails = data.results ;
    console.log("peopleDetails",this.peopleDetails);
    this.totalPages = Math.ceil(data?.count / this.itemsPerPage);
    console.log("totalPages",this.totalPages);
    this.isloading= true;
  });
}


goToPage(page: number): void {
  if (page > 0 && page <= this.totalPages) {
    this.currentPage = page;
    this.getAllDetails(this.currentPage);
  }
}

nextPage(): void {
  if (this.peopleDetails.next) {
    this.goToPage(this.currentPage + 1);
  }
}

previousPage(): void {
  if (this.peopleDetails.previous) {
    this.goToPage(this.currentPage - 1);
  }
}
getPages(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

getmultiplevalue(character: any ,speices:any): any{
  console.log('any', character);
  console.log('any', speices);
  this.isloading= false;
  this.isShow = false;
  this.allApi.getCharacterDetails(character, speices).subscribe(
    (finalData: any) => {
      this.peopleDetails = finalData ;
      console.log("peopleDetails",this.peopleDetails);
      this.totalPages = Math.ceil(finalData.length / this.itemsPerPage);
      console.log("totalPages",this.totalPages);
      this.isloading= true;
      this.isShow = true;
      this.currentPage= 1;
    },
    (error: any) => {
        console.error('Failed to fetch character data:', error);
    }
);
}

callPeople(character:any): any{
 

  this.allApi.getPeopleDetails(character).subscribe(
    (finalData: any) => {
      this.people = finalData ;
      console.log("people",this.people);
      this.peopleDetails = finalData ;
      console.log("peopleDetails",this.peopleDetails);
      console.log("totalPages",this.totalPages);
      this.isloading= true;
      this.isShow = true;
      this.currentPage= 1;
      localStorage.clear();
      // this.getSpeices(this.people?.species)
    },
    (error: any) => {
        console.error('Failed to fetch character data:', error);
    }
);
}

getSpeices(species: string[] ) {
  // Check if species is defined and is an array
  if (Array.isArray(species) && species.length > 0) {
    this.allApi.getSpeciesDetails(species).subscribe(
      (finalData: any) => {
        this.species = finalData;
        console.log("species", this.species);
      },
      (error: any) => {
        console.error('Failed to fetch species data:', error);
      }
    );
  } else {
    console.error('Invalid species array:', species);
  }
}

getFlims(films: any) {
  console.log('getFlims', films);
  this.allApi.getFilmsDetails(films).subscribe(
    (finalData: any) => {
      this.films = finalData ;
      console.log("films",this.films);
      const allCharacters = finalData.flatMap((film:any) => film.characters);
      const allSpecies = finalData.flatMap((film:any) => film.species);
      this.getmultiplevalue(allCharacters, allSpecies);
    },
    (error: any) => {
        console.error('Failed to fetch character data:', error);
    }
);
}

onclick(item:any) {
  console.log('onclick',item);
  this.sharedDataService.sharedvalue(item);
}

}
