import { Rate } from './../../models/rate.model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DataService } from '../image-display/data.service';

@Component({
  selector: 'app-shipping-rates',
  templateUrl: './shipping-rates.component.html',
  styleUrls: ['./shipping-rates.component.scss']
})
export class ShippingRatesComponent implements OnInit {

  addressForm: FormGroup;
  rates: Rate[] = [];
  upsRates: Rate[] = [];
  uspsRates: Rate[] = [];
  fedexRates: Rate[] = [];
  selectedUpsRateIndex: number | null = null;
  selectedUspsRateIndex: number | null = null;
  selectedFedexRateIndex: number | null = null;
  displayedColumns: string[] = ['select', 'carrier', 'est_delivery_days', 'mode', 'rate'];
  rateSelectionForm: FormGroup;
  selectedRates: any = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private dataService: DataService) {
    this.rateSelectionForm = this.fb.group({
      rates: this.fb.array(this.rates.map(rate => this.fb.group({
        selected: [rate.selected]
      })))
    });

    this.addressForm = this.fb.group({
      // To Address
      toName: ['', Validators.required],
      toStreet1: ['', Validators.required],
      toCity: ['', Validators.required],
      toState: ['', Validators.required],
      toZip: ['', Validators.required],
      toCountry: ['', Validators.required],
      toPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      toEmail: ['', [Validators.required, Validators.email]],

      // From Address
      fromName: ['', Validators.required],
      fromStreet1: ['', Validators.required],
      fromCity: ['', Validators.required],
      fromState: ['', Validators.required],
      fromZip: ['', Validators.required],
      fromCountry: ['', Validators.required],
      fromPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      fromEmail: ['', [Validators.required, Validators.email]],

      // Parcel Info
      parcelLength: ['', Validators.required],
      parcelWidth: ['', Validators.required],
      parcelHeight: ['', Validators.required],
      parcelWeight: ['', Validators.required],
    });

    // UPS data
    // this.addressForm.setValue({
    //   // To Address
    //   toName: 'Dr. Steve Brule',
    //   toStreet1: '179 N Harbor Dr',
    //   toCity: 'Redondo Beach',
    //   toState: 'CA',
    //   toZip: '90277',
    //   toCountry: 'US',
    //   toPhone: '8573875756',
    //   toEmail: 'dr_steve_brule@gmail.com',

    //   // From Address
    //   fromName: 'EasyPost',
    //   fromStreet1: '417 Montgomery Street',
    //   fromCity: 'San Francisco',
    //   fromState: 'CA',
    //   fromZip: '94104',
    //   fromCountry: 'US',
    //   fromPhone: '4153334445',
    //   fromEmail: 'support@easypost.com',

    //   // Parcel Info
    //   parcelLength: '20.2',
    //   parcelWidth: '10.9',
    //   parcelHeight: '5',
    //   parcelWeight: '65.0',
    // });

    // Fedex
    // this.addressForm.setValue({
    //   // To Address
    //   toName: 'Dr. Steve Brule',
    //   toStreet1: '179 N Harbor Dr',
    //   toCity: 'Redondo Beach',
    //   toState: 'CA',
    //   toZip: '90277',
    //   toCountry: 'US',
    //   toPhone: '8573875756',
    //   toEmail: 'dr_steve_brule@gmail.com',

    //   // From Address
    //   fromName: 'EasyPost',
    //   fromStreet1: '417 Montgomery Street',
    //   fromCity: 'San Francisco',
    //   fromState: 'CA',
    //   fromZip: '94104',
    //   fromCountry: 'US',
    //   fromPhone: '4153334445',
    //   fromEmail: 'support@easypost.com',

    //   // Parcel Info
    //   parcelLength: '20.2',
    //   parcelWidth: '10.9',
    //   parcelHeight: '5',
    //   parcelWeight: '65.0',
    // });

    // USPS
    this.addressForm.setValue({
      // To Address
      toName: 'Dr. Steve Brule',
      toStreet1: '2311 York Rd',
      toCity: 'Timonium',
      toState: 'MD',
      toZip: '21093',
      toCountry: 'US',
      toPhone: '8573875756',
      toEmail: 'dr_steve_brule@gmail.com',

      // From Address
      fromName: 'EasyPost',
      fromStreet1: '2150 Kinsley Lane',
      fromCity: 'Tallahassee',
      fromState: 'FL',
      fromZip: '32308',
      fromCountry: 'US',
      fromPhone: '4153334445',
      fromEmail: 'support@easypost.com',

      // Parcel Info
      parcelLength: '20.2',
      parcelWidth: '10.9',
      parcelHeight: '5',
      parcelWeight: '65.0',
    });

  }

  ngOnInit(): void {
    this.onSubmit();
  }

  isAllSelected(): boolean {
    return this.rates.every(rate => rate.selected);
  }

  isSomeSelected(): boolean {
    return this.rates.some(rate => rate.selected) && !this.isAllSelected();
  }

  toggleSelectAll(isChecked: boolean): void {
    this.rates.forEach(rate => (rate.selected = isChecked));
  }

  onRateSelectionSubmit() {
    // Get the selected rates from the form and log them
    const selectedRates = this.rates.filter((rate: any) => rate.selected);
    this.selectedRates = selectedRates;
    console.log('Selected Rates:', selectedRates);
    console.log('this.addressForm.value: ', this.addressForm.value);
    this.dataService.setSelectedRates(this.selectedRates);
    this.dataService.setSelectedAddressForm(this.addressForm.value);
    const queryParams = { rates: JSON.stringify(selectedRates) };
    this.router.navigate(['/image-display']); //, { queryParams }
  }

  onRateChecked(rate: Rate) {
    console.log('Selected Rates:', rate);
    rate.selected = !rate.selected;

    console.log('Selected Rates:', rate.selected ? "Selected" : "Unselected");
  }

  async getUpsRates(requestData: any): Promise<void> {
    return this.http.post(`${environment.host}/dev/rates`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).toPromise()
      .then((response: any) => {
        this.upsRates = response.body.rates;
      })
      .catch((error: any) => {
        console.error('Error fetching UPS rates:', error);
        alert('An error occurred while fetching UPS rates.');
      });
  }

  async getUspsRates(requestData: any): Promise<void> {
    return this.http.post(`${environment.host}/dev/uspsrates`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).toPromise()
      .then((response: any) => {
        this.uspsRates = response.body.rates;
      })
      .catch((error: any) => {
        console.error('Error fetching USPS rates:', error);
        alert('An error occurred while fetching USPS rates.');
      });
  }

  async getFedexRates(requestData: any): Promise<void> {
    return this.http.post(`${environment.host}/dev/fedexrates`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).toPromise()
      .then((response: any) => {
        this.fedexRates = response.body.rates;
      })
      .catch((error: any) => {
        console.error('Error fetching FedEx rates:', error);
        alert('An error occurred while fetching FedEx rates.');
      });
  }

  async getRates(requestData: any): Promise<void> {
    await Promise.all([
      this.getUpsRates(requestData),
      this.getUspsRates(requestData),
      this.getFedexRates(requestData),
    ]);
  }

  async onSubmit() {
    // if (this.addressForm.invalid) {
    //   console.log('this.addressForm.value: ', this.addressForm.value);
    //   return;
    // }

    const formData = this.addressForm.value;

    const requestData = {
      "to_address": {
        "name": "Dr. Steve Brule",
        "street1": "179 N Harbor Dr",
        "city": "Redondo Beach",
        "state": "CA",
        "zip": "90277",
        "country": "US",
        "phone": "8573875756",
        "email": "dr_steve_brule@gmail.com"
      },
      "from_address": {
        "name": "EasyPost",
        "street1": "417 Montgomery Street",
        "street2": "5th Floor",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94104",
        "country": "US",
        "phone": "4153334445",
        "email": "support@easypost.com"
      },
      "parcel": {
        "length": "20.2",
        "width": "10.9",
        "height": "5",
        "weight": "65.0"
      }
    }

    // const requestData = {
    //   to_address: {
    //     name: formData.toName,
    //     street1: formData.toStreet1,
    //     city: formData.toCity,
    //     state: formData.toState,
    //     zip: formData.toZip,
    //     country: formData.toCountry,
    //     phone: formData.toPhone,
    //     email: formData.toEmail,
    //   },
    //   from_address: {
    //     name: formData.fromName,
    //     street1: formData.fromStreet1,
    //     city: formData.fromCity,
    //     state: formData.fromState,
    //     zip: formData.fromZip,
    //     country: formData.fromCountry,
    //     phone: formData.fromPhone,
    //     email: formData.fromEmail,
    //   },
    //   parcel: {
    //     length: formData.parcelLength,
    //     width: formData.parcelWidth,
    //     height: formData.parcelHeight,
    //     weight: formData.parcelWeight,
    //   },
    // };

    try {
      await this.getRates(requestData);
      this.rates = [...this.upsRates, ...this.uspsRates, ...this.fedexRates];
      this.rates.sort((a, b) => a.rate - b.rate);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  }

  selectUpsRate(index: number): void {
    this.selectedUpsRateIndex = index;
  }

  selectUspsRate(index: number): void {
    this.selectedUspsRateIndex = index;
  }

  selectFedexRate(index: number): void {
    this.selectedFedexRateIndex = index;
  }

  getCarrierImage(carrier: string): string {
    const carrierImages: { [key: string]: string } = {
      UPS: 'assets/images/ups.png',
      USPS: 'assets/images/usps.png',
      FedEx: 'assets/images/fedex.png',
    };
    return carrierImages[carrier] || 'assets/images/default.png';
  }
}
