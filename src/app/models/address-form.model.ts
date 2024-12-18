import { FormGroup, FormControl, Validators } from '@angular/forms';

export class AddressFormModel {
    // To Address
    toName: string;
    toStreet1: string;
    toCity: string;
    toState: string;
    toZip: string;
    toCountry: string;
    toPhone: string;
    toEmail: string;

    // From Address
    fromName: string;
    fromStreet1: string;
    fromCity: string;
    fromState: string;
    fromZip: string;
    fromCountry: string;
    fromPhone: string;
    fromEmail: string;

    // Parcel Info
    parcelLength: string;
    parcelWidth: string;
    parcelHeight: string;
    parcelWeight: string;

    constructor() {
        this.toName = '';
        this.toStreet1 = '';
        this.toCity = '';
        this.toState = '';
        this.toZip = '';
        this.toCountry = '';
        this.toPhone = '';
        this.toEmail = '';

        this.fromName = '';
        this.fromStreet1 = '';
        this.fromCity = '';
        this.fromState = '';
        this.fromZip = '';
        this.fromCountry = '';
        this.fromPhone = '';
        this.fromEmail = '';

        this.parcelLength = '';
        this.parcelWidth = '';
        this.parcelHeight = '';
        this.parcelWeight = '';
    }
}
