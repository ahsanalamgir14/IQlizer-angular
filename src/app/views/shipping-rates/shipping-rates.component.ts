import { Rate } from './../../models/rate.model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import * as demoData from './rates-demo.json';

@Component({
  selector: 'app-shipping-rates',
  templateUrl: './shipping-rates.component.html',
  styleUrls: ['./shipping-rates.component.scss']
})
export class ShippingRatesComponent implements OnInit {

  addressForm: FormGroup;
  // rates: Rate[] = demoData;
  rates: Rate[] = [];
  upsRates: Rate[] = [];
  uspsRates: Rate[] = [];
  fedexRates: Rate[] = [];
  selectedUpsRateIndex: number | null = null;
  selectedUspsRateIndex: number | null = null;
  selectedFedexRateIndex: number | null = null;
  displayedColumns: string[] = ['carrier', 'est_delivery_days', 'mode', 'rate'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
  }

  ngOnInit(): void {
    this.onSubmit();
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
    if (this.addressForm.invalid) {
      console.log('this.addressForm.value: ', this.addressForm.value);
      return;
    }

    const formData = this.addressForm.value;

    const requestData = {
      to_address: {
        name: formData.toName,
        street1: formData.toStreet1,
        city: formData.toCity,
        state: formData.toState,
        zip: formData.toZip,
        country: formData.toCountry,
        phone: formData.toPhone,
        email: formData.toEmail,
      },
      from_address: {
        name: formData.fromName,
        street1: formData.fromStreet1,
        city: formData.fromCity,
        state: formData.fromState,
        zip: formData.fromZip,
        country: formData.fromCountry,
        phone: formData.fromPhone,
        email: formData.fromEmail,
      },
      parcel: {
        length: formData.parcelLength,
        width: formData.parcelWidth,
        height: formData.parcelHeight,
        weight: formData.parcelWeight,
      },
    };

    // const requestData = {
    //   "to_address": {
    //     "name": "Dr. Steve Brule",
    //     "street1": "179 N Harbor Dr",
    //     "city": "Redondo Beach",
    //     "state": "CA",
    //     "zip": "90277",
    //     "country": "US",
    //     "phone": "8573875756",
    //     "email": "dr_steve_brule@gmail.com"
    //   },
    //   "from_address": {
    //     "name": "EasyPost",
    //     "street1": "417 Montgomery Street",
    //     "street2": "5th Floor",
    //     "city": "San Francisco",
    //     "state": "CA",
    //     "zip": "94104",
    //     "country": "US",
    //     "phone": "4153334445",
    //     "email": "support@easypost.com"
    //   },
    //   "parcel": {
    //     "length": "20.2",
    //     "width": "10.9",
    //     "height": "5",
    //     "weight": "65.0"
    //   }
    // }

    // Make the HTTP POST request
    try {
      await this.getRates(requestData);
      this.rates = [...this.upsRates, ...this.uspsRates, ...this.fedexRates];
      this.rates.sort((a, b) => a.rate - b.rate);
      console.log('Sorted Rates:', this.rates);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  }

  selectUpsRate(index: number): void {
    this.selectedUpsRateIndex = index;
    console.log('Selected Rate:', this.upsRates[index]);
  }

  selectUspsRate(index: number): void {
    this.selectedUspsRateIndex = index;
    console.log('Selected Rate:', this.uspsRates[index]);
  }

  selectFedexRate(index: number): void {
    this.selectedFedexRateIndex = index;
    console.log('Selected Rate:', this.fedexRates[index]);
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
