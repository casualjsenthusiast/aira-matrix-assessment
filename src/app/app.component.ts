import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Place {
  placeName: string;
}

interface District {
  districtName: string;
  places: { [key: string]: Place };
}

interface State {
  stateName: string;
  districts: { [key: string]: District };
}

interface Country {
  countryName: string;
  states: { [key: string]: State };
}

interface Result {
  [key: string]: Country;
}

interface LevelArr {
  id: string;
  parentId?: string;
  name: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'aira-matrix-assessment';

  readonly SELECT_COUNTRYNAME = 'Select countryName';
  readonly SELECT_STATENAME = 'Select stateName';
  readonly SELECT_DISTRICTNAME = 'Select districtName';
  readonly SELECT_PLACENAME = 'Select placeName';

  result: Result = {};

  firstLevelArr: LevelArr[] = [
    { id: "1", name: "India" },
    { id: "2", name: "Germany" }
  ];

  secondLevelArr: LevelArr[] = [
    { id: "s1", parentId: "2", name: "Bavaria" },
    { id: "s2", parentId: "2", name: "Berlin" },
    { id: "s3", parentId: "1", name: "Maharashtra" },
    { id: "s4", parentId: "1", name: "Tamilnadu" }
  ];

  thirdLevelArr: LevelArr[] = [
    { id: "d1", parentId: "s1", name: "Upper Bavaria" },
    { id: "d2", parentId: "s1", name: "Lower Bavaria" },
    { id: "d3", parentId: "s2", name: "Berlin-Mitte" },
    { id: "d4", parentId: "s2", name: "Kreuzberg" },
    { id: "d5", parentId: "s3", name: "Nashik" },
    { id: "d6", parentId: "s3", name: "Jalgoan" },
    { id: "d7", parentId: "s4", name: "Ariyalur" },
    { id: "d8", parentId: "s4", name: "Chennai" }
  ];

  fourthLevelArr: LevelArr[] = [
    { id: "p1", parentId: "d1", name: "Munich" },
    { id: "p2", parentId: "d1", name: "Erding" },
    { id: "p3", parentId: "d2", name: "Leipzig" },
    { id: "p4", parentId: "d2", name: "Landshut" },
    { id: "p5", parentId: "d3", name: "Passau" },
    { id: "p6", parentId: "d3", name: "Gesundbrunnen" },
    { id: "p7", parentId: "d4", name: "Frieburg" },
    { id: "p8", parentId: "d4", name: "Hamburg" },
    { id: "p9", parentId: "d6", name: "Raver" },
    { id: "p10", parentId: "d6", name: "Savda" },
    { id: "p11", parentId: "d5", name: "Ozar" },
    { id: "p12", parentId: "d5", name: "Manmad" },
    { id: "p13", parentId: "d7", name: "Thirumanur" },
    { id: "p14", parentId: "d7", name: "Sendurai" },
    { id: "p15", parentId: "d8", name: "New Chennai" },
    { id: "p16", parentId: "d8", name: "Old Chennai" }
  ];

  selectedCountryId: string | undefined;
  selectedStateId: string | undefined;
  selectedDistrictId: string | undefined;
  selectedPlaceId: string | undefined;

  ngOnInit() {
    this.result = this.buildTree(this.firstLevelArr, this.secondLevelArr, this.thirdLevelArr, this.fourthLevelArr);
  }

  get countries() {
    return Object.entries(this.result).map(entry => { return { id: entry[0], name: entry[1]['countryName'] }});
  }

  get states() {
    const selectedCountryStates = this.result[this.selectedCountryId!]?.['states'];
    if (selectedCountryStates) {
      return Object.entries(selectedCountryStates).map(entry => { return { id: entry[0], name: entry[1]['stateName'] }});
    } else {
      return [];
    }
  }

  get districts() {
    const selectedStateDistricts = this.result[this.selectedCountryId!]?.['states']?.[this.selectedStateId!]?.['districts'];
    if (selectedStateDistricts) {
      return Object.entries(selectedStateDistricts).map(entry => { return { id: entry[0], name: entry[1]['districtName'] }});
    } else {
      return [];
    }
  }

  get places() {
    const selectedDistrictPlaces = this.result[this.selectedCountryId!]?.['states']?.[this.selectedStateId!]?.['districts']?.[this.selectedDistrictId!]?.['places'];
    if (selectedDistrictPlaces) {
      return Object.entries(selectedDistrictPlaces).map(entry => { return { id: entry[0], name: entry[1]['placeName'] }});
    } else {
      return [];
    }
  }

  buildTree(firstLevelArr: LevelArr[], secondLevelArr: LevelArr[], thirdLevelArr: LevelArr[], fourthLevelArr: LevelArr[]): Result {
    const result: Result = {};

    firstLevelArr.forEach(country => {
      result[country.id] = { countryName: country.name, states: {} };
    });

    secondLevelArr.forEach(state => {
      const parent = result[state.parentId!];
      if (parent) {
        parent.states[state.id] = { stateName: state.name, districts: {} };
      }
    });

    thirdLevelArr.forEach(district => {
      Object.values(result).forEach(country => {
        const state = country.states[district.parentId!];
        if (state) {
          state.districts[district.id] = { districtName: district.name, places: {} };
        }
      });
    });

    fourthLevelArr.forEach(place => {
      Object.values(result).forEach(country => {
        Object.values(country.states).forEach(state => {
          const district = state.districts[place.parentId!];
          if (district) {
            district.places[place.id] = { placeName: place.name };
          }
        });
      });
    });

    return result;
  }

}
