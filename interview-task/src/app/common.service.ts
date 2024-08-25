import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, of ,Observable} from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
   
  Api :any;
  constructor(private http: HttpClient) { }
  
  private dataSource = new BehaviorSubject<string>('Default Data');
  currentData = this.dataSource.asObservable();

  changeData(data: string) {
    this.dataSource.next(data);
  }
  getAllApi():Observable<any> {
    let url = "https://swapi.dev/api/";
    return this.http.get(url);
  } 
  getAlldetails(item: any){
    let url = item;
    return this.http.get(url);
  }
//   getCharacterDetails(characters: string[], species: string[]): Observable<any[]> {
//     const characterRequests = characters.map(url => this.http.get(url));
//     const speciesRequests = species.map(url => this.http.get(url));

//     return forkJoin([forkJoin(characterRequests), forkJoin(speciesRequests)]).pipe(
//         map(([charactersData, speciesData]) => {
//             const speciesMap = new Map<string, string>();
//             speciesData.forEach((species: any) => {
//                 speciesMap.set(species.url, species.name);
//             });

//             return charactersData.map((character: any) => ({
//                 name: character.name,
//                 birthYear: character.birth_year,
//                 species: character.species.map((speciesUrl: string) => speciesMap.get(speciesUrl) || 'Unknown')
//             }));
//         })
//     );
// }

getCharacterDetails(characters: string[], species: string[]): Observable<any[]> {
  // Create an observable for character requests
  const characterRequests = characters.map(url => this.http.get(url));

  // Create an observable for species requests
  const speciesRequests = species.map(url => this.http.get(url));

  // Return a forkJoin of character and species requests
  return forkJoin({
      characters: forkJoin(characterRequests),
      species: forkJoin(speciesRequests)
  }).pipe(
      map(({ characters, species }) => {
          // Create a map for species data
          const speciesMap = new Map<string, string>();
          species.forEach((speciesItem: any) => {
              speciesMap.set(speciesItem.url, speciesItem.name);
          });

          // Process character data with species names
          return characters.map((character: any) => ({
              name: character.name,
              birthYear: character.birth_year,
              species: character.species.map((speciesUrl: string) => speciesMap.get(speciesUrl) || 'Unknown')
          }));
      })
  );
}


// getPeopleDetails(characters: string[]): Observable<any[]> {
//   // Create an observable for character requests
//   const characterRequests = characters.map(url => this.http.get(url));


//   // Return a forkJoin of character and species requests
//   return forkJoin({
//       characters: forkJoin(characterRequests),
//   }).pipe(
//       map(({ characters }) => {
//           // Process character data with species names
//           return characters.map((character: any) => ({
//               name: character.name,
//               birth_year: character.birth_year,
//               films: character.films,
//               species: character.species
//           }));
//       })
//   );
// }
getPeopleDetails(characters: string[]): Observable<any[]> {
  // Create an array of observables for the character requests
  const characterRequests = characters.map(url => this.http.get<any>(url));

  // Use forkJoin to wait for all character requests to complete
  return forkJoin(characterRequests);
}

// getFilmsDetails(films: string[]): Observable<any[]> {
//   // Create an array of observables for the film requests
//   const filmRequests = films.map(url => this.http.get<any>(url));

//   // Use forkJoin to wait for all film requests to complete
//   return forkJoin(filmRequests).pipe(
//     map((filmsArray: any[]) => {
//       // Process the film data
//       return filmsArray.map((film: any) => ({
//         title: film.title,
//         director: film.director,
//         release_date: film.release_date,
//         characters: film.characters,
//         species: film.species
//       }));
//     })
//   );
// }

getFilmsDetails(films: string[]): Observable<any[]> {
  // Create an array of observables for the film requests
  const filmRequests = films.map(url => this.http.get<any>(url));

  // Use forkJoin to wait for all film requests to complete
  return forkJoin(filmRequests);
}

getSpeciesDetails(speciesUrls: string[]): Observable<Map<string, string>> {
  // Ensure speciesUrls is an array
  if (!Array.isArray(speciesUrls)) {
    throw new Error('Invalid input: speciesUrls should be an array');
  }

  // Create an array of observables for the species requests
  const speciesRequests = speciesUrls.map(url => this.http.get<any>(url));

  // Use forkJoin to wait for all species requests to complete
  return forkJoin(speciesRequests).pipe(
    map((speciesArray: any[]) => {
      // Create a map for species data
      const speciesMap = new Map<string, string>();
      speciesArray.forEach((speciesItem: any) => {
        if (speciesItem && speciesItem.url && speciesItem.name) {
          speciesMap.set(speciesItem.url, speciesItem.name);
        }
      });

      // Return the map of species data
      return speciesMap;
    })
  );
}



}
