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
  rates: Rate[] = [];
  upsRates: Rate[] = [];
  uspsRates: Rate[] = [];
  fedexRates: Rate[] = [];
  selectedUpsRateIndex: number | null = null;
  selectedUspsRateIndex: number | null = null;
  selectedFedexRateIndex: number | null = null;
  displayedColumns: string[] = ['select', 'carrier', 'est_delivery_days', 'mode', 'rate'];
  rateSelectionForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
    const selectedRates = this.rateSelectionForm.value.rates.filter((rate: any) => rate.selected);
    console.log('Selected Rates:', selectedRates);
  }
  
  onRateChecked(rate: Rate) {
    console.log('Selected Rates:');
    rate.selected = !rate.selected;

    console.log('Selected Rates:', rate.selected?"Selected":"Unselected");
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
