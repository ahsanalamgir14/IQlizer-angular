import { Injectable } from '@angular/core';
import { AddressFormModel } from 'src/app/models/address-form.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private selectedRates: any[] = [];
  private addressForm: AddressFormModel;

  setSelectedRates(rates: any[]) {
    this.selectedRates = rates;
  }

  getSelectedRates() {
    return this.selectedRates;
  }
  setSelectedAddressForm(addressForm: AddressFormModel) {
    this.addressForm = addressForm;
  }

  getSelectedAddressForm() {
    return this.addressForm;
  }
}
