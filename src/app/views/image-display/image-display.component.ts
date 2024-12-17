import { Label } from './../../models/label.model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import { AddressFormModel } from 'src/app/models/address-form.model';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.css']
})
export class ImageDisplayComponent implements OnInit {
  label: Label[] = [];
  USPSLabel: Label[] = [];
  fedexLabel: Label[] = [];
  gifBase64: string = '';
  pngBase64: string = '';
  base64Jpg: string = '';
  selectedRates: any[] = [];
  addressForm: AddressFormModel;
  isLoading: boolean = true;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private dataService: DataService) { }

  // ngOnInit(): void {
  //   this.route.queryParams.subscribe((params: any) => {
  //     if (params['rates']) {
  //       this.selectedRates = JSON.parse(params['rates']);
  //     }
  //     console.log('Received Selected Rates:', this.selectedRates);
  //   });
  // }

  ngOnInit(): void {
    this.selectedRates = this.dataService.getSelectedRates();
    this.addressForm = this.dataService.getSelectedAddressForm();
    console.log('Received Selected Rates:', this.selectedRates);
    console.log('Received addressForm:', this.addressForm);

    if(this.selectedRates.length > 0) {
      if(this.selectedRates[0].carrier === 'UPS') {
        console.log('calling UPS: label ');
        this.getGifBase64LabelUps();
      } else if (this.selectedRates[0].carrier === 'USPS') {
        console.log('calling USPS: label ');
        this.getJpgBase64LabelUsps();
      } else if (this.selectedRates[0].carrier === 'FedEx') {
        console.log('calling FedEx: label ');
        this.getPngBase64LabelFedEx();
      } else {
        console.log('No Data found')
        this.isLoading = false;
      }
    } else {
      this.isLoading = false;
    }
  }

  async getGifBase64LabelUps(): Promise<void> {
    this.isLoading = true;
    const requestData = {
      trans_id: "your_transaction_id",
      transaction_src: "testing",
      shipper: {
        Name: this.addressForm.fromName,
        AttentionName: "ShipperZs Attn Name",
        TaxIdentificationNumber: "123456",
        Phone: {
          Number: this.addressForm.fromPhone,
          Extension: " "
        },
        ShipperNumber: "K61C80",
        FaxNumber: "8002222222",
        Address: {
          AddressLine: [this.addressForm.fromStreet1],
          City: this.addressForm.fromCity,
          StateProvinceCode: this.addressForm.fromState,
          PostalCode: this.addressForm.fromZip,
          CountryCode: this.addressForm.fromCountry
        }
      },
      ship_to: {
        Name: this.addressForm.toName,
        AttentionName: "1160b_74",
        Phone: { Number: this.addressForm.toPhone },
        Address: {
          AddressLine: [this.addressForm.toStreet1],
          City: this.addressForm.toCity,
          StateProvinceCode: this.addressForm.toState,
          PostalCode: this.addressForm.toZip,
          CountryCode: this.addressForm.toCountry
        },
        Residential: " "
      },
      ship_from: {
        Name: this.addressForm.fromName,
        AttentionName: "1160b_74",
        Phone: { Number: this.addressForm.fromPhone },
        FaxNumber: "1234567890",
        Address: {
          AddressLine: [this.addressForm.fromStreet1],
          City: this.addressForm.fromCity,
          StateProvinceCode: this.addressForm.fromState,
          PostalCode: this.addressForm.fromZip,
          CountryCode: this.addressForm.fromCountry
        }
      },
      package: {
        Description: " ",
        Packaging: { Code: "02", Description: "Nails" },
        Dimensions: {
          UnitOfMeasurement: { Code: "IN", Description: "Inches" },
          Length: this.addressForm.parcelLength,
          Width: this.addressForm.parcelWidth,
          Height: this.addressForm.parcelHeight
        },
        PackageWeight: {
          UnitOfMeasurement: { Code: "LBS", Description: "Pounds" },
          Weight: this.addressForm.parcelWeight
        }
      },
      label_specification: {
        LabelImageFormat: {
          Code: "GIF",
          Description: "GIF"
        },
        HTTPUserAgent: "Mozilla/4.5"
      }
    };

    try {
      const response: any = await this.http.post(
        `${environment.host}/dev/label`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).toPromise();

      this.gifBase64 = response?.body?.base64Image || '';
      console.log('GIF Base64 value:', this.gifBase64);
    } catch (error) {
      console.error('Error fetching GIF label:', error);
      alert('An error occurred while fetching the GIF label.');
    }
    this.isLoading = false;
  }

  async getPngBase64LabelFedEx(): Promise<void> {
    this.isLoading = true;
    const requestData = {
      trans_id: "your_transaction_id",
      transaction_src: "testing",
      shipper: {
        Name: this.addressForm.fromName,
        TaxIdentificationNumber: "123456",
        Phone: {
          Number: this.addressForm.fromPhone,
          Extension: " "
        },
        FaxNumber: "8002222222",
        Address: {
          AddressLine: [this.addressForm.fromStreet1],
          City: this.addressForm.fromCity,
          StateProvinceCode: this.addressForm.fromState,
          PostalCode: this.addressForm.fromZip,
          CountryCode: this.addressForm.fromCountry
        }
      },
      ship_to: {
        Name: this.addressForm.toName,
        Phone: { Number: this.addressForm.toPhone },
        Address: {
          AddressLine: [this.addressForm.toStreet1],
          City: this.addressForm.toCity,
          StateProvinceCode: this.addressForm.toState,
          PostalCode: this.addressForm.toZip,
          CountryCode: this.addressForm.toCountry
        },
        Residential: " "
      },
      ship_from: {
        Name: this.addressForm.fromName,
        Phone: { Number: this.addressForm.fromPhone },
        Address: {
          AddressLine: [this.addressForm.fromStreet1],
          City: this.addressForm.fromCity,
          StateProvinceCode: this.addressForm.fromState,
          PostalCode: this.addressForm.fromZip,
          CountryCode: this.addressForm.fromCountry
        }
      },
      package: {
        Description: " ",
        Packaging: { Code: "02", Description: "Nails" },
        Dimensions: {
          UnitOfMeasurement: { Code: "IN", Description: "Inches" },
          Length: this.addressForm.parcelLength,
          Width: this.addressForm.parcelWidth,
          Height: this.addressForm.parcelHeight
        },
        PackageWeight: {
          UnitOfMeasurement: { Code: "LBS", Description: "Pounds" },
          Weight: this.addressForm.parcelWeight
        }
      },
      label_specification: {
        imageType: "PNG",
        labelStockType: "PAPER_4X6"
      }
    };

    try {
      const response: any = await this.http.post(
        `${environment.host}/dev/labelfedex`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).toPromise();

      this.pngBase64 = response?.body?.base64Image || '';
      console.log('PNG Base64 value:', this.pngBase64);
    } catch (error) {
      console.error('Error fetching PNG label:', error);
      alert('An error occurred while fetching the PNG label.');
    }
    this.isLoading = false;
  }

  async getJpgBase64LabelUsps(): Promise<void> {
    this.isLoading = true;
    const requestData = {
      trans_id: "your_transaction_id",
      transaction_src: "testing",
      shipper: {
        Name: this.addressForm.fromName,
        AttentionName: "ShipperZs Attn Name",
        TaxIdentificationNumber: "123456",
        Phone: {
          Number: this.addressForm.fromPhone,
          Extension: " "
        },
        ShipperNumber: "K61C80",
        FaxNumber: "8002222222",
        Address: {
          AddressLine: [this.addressForm.fromStreet1],
          City: this.addressForm.fromCity,
          StateProvinceCode: this.addressForm.fromState,
          PostalCode: this.addressForm.fromZip,
          CountryCode: this.addressForm.fromCountry
        }
      },
      ship_to: {
        Name: this.addressForm.toName,
        AttentionName: "1160b_74",
        Phone: { Number: this.addressForm.toPhone },
        Address: {
          AddressLine: [this.addressForm.toStreet1],
          City: this.addressForm.toCity,
          StateProvinceCode: this.addressForm.toState,
          PostalCode: this.addressForm.toZip,
          CountryCode: this.addressForm.toCountry
        },
        Residential: " "
      },
      ship_from: {
        Name: this.addressForm.fromName,
        AttentionName: "1160b_74",
        Phone: { Number: this.addressForm.fromPhone },
        FaxNumber: "1234567890",
        Address: {
          AddressLine: [this.addressForm.fromStreet1],
          City: this.addressForm.fromCity,
          StateProvinceCode: this.addressForm.fromState,
          PostalCode: this.addressForm.fromZip,
          CountryCode: this.addressForm.fromCountry
        }
      },
      package: {
        Description: " ",
        Packaging: { Code: "02", Description: "Nails" },
        Dimensions: {
          UnitOfMeasurement: { Code: "IN", Description: "Inches" },
          Length: this.addressForm.parcelLength,
          Width: this.addressForm.parcelWidth,
          Height: this.addressForm.parcelHeight
        },
        PackageWeight: {
          UnitOfMeasurement: { Code: "LBS", Description: "Pounds" },
          Weight: this.addressForm.parcelWeight
        }
      },
      label_specification: {
        imageType: "JPG",
        labelType: "4X5LABEL",
        receiptOption: "NONE"
      }
    };

    try {
      const response: any = await this.http.post(
        `${environment.host}/dev/labelusps`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).toPromise();

      this.base64Jpg = response?.body?.base64Image || '';
      console.log('JPG Base64 value:', this.base64Jpg);
    } catch (error) {
      console.error('Error fetching JPG label:', error);
      alert('An error occurred while fetching the JPG label.');
    }
    this.isLoading = false;
  }

  printUps() {
    if (this.gifBase64) {
      // Create an image element to hold the label
      const printWindow = window.open('', '', 'height=500,width=800');
      const imgElement = `<img src="data:image/gif;base64,${this.gifBase64}" alt="UPS Label" />`;
      if(printWindow) {
        printWindow.document.write(imgElement);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      alert('No label available for printing.');
    }
  }

  saveUps() {
    if (this.gifBase64) {
      const link = document.createElement('a');
      link.href = `data:image/gif;base64,${this.gifBase64}`;
      link.download = 'UPS_Label.gif';  // You can change the file name as needed
      link.click();
    } else {
      alert('No label available to save.');
    }
  }
  printFedEx() {
    if (this.pngBase64) {
      // Create an image element to hold the label
      const printWindow = window.open('', '', 'height=500,width=800');
      const imgElement = `<img src="data:image/png;base64,${this.pngBase64}" alt="Fedex Label" />`;
      if(printWindow) {
        printWindow.document.write(imgElement);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      alert('No label available for printing.');
    }
  }

  saveFedEx() {
    if (this.pngBase64) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${this.pngBase64}`;
      link.download = 'UPS_Label.png';
      link.click();
    } else {
      alert('No label available to save.');
    }
  }
  printUsps() {
    if (this.base64Jpg) {
      // Create an image element to hold the label
      const printWindow = window.open('', '', 'height=500,width=800');
      const imgElement = `<img src="data:image/jpg;base64,${this.base64Jpg}" alt="USPS Label" />`;
      if(printWindow) {
        printWindow.document.write(imgElement);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      alert('No label available for printing.');
    }
  }

  saveUsps() {
    if (this.base64Jpg) {
      const link = document.createElement('a');
      link.href = `data:image/jpg;base64,${this.base64Jpg}`;
      link.download = 'UPS_Label.jpg';
      link.click();
    } else {
      alert('No label available to save.');
    }
  }
}
