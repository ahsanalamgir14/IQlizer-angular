import { Label } from './../../models/label.model';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.css']
})
export class ImageDisplayComponent {
  label: Label[] = [];
  USPSLabel: Label[] = [];
  fedexLabel: Label[] = [];
  gifBase64: string = '';
  pngBase64: string = '';
  base64Jpg: string = '';

  constructor(private http: HttpClient) {}

  async getGifBase64Label(): Promise<void> {
    const requestData = {
      trans_id: "your_transaction_id",
      transaction_src: "testing",
      shipper: {
        Name: "ShipperName",
        AttentionName: "ShipperZs Attn Name",
        TaxIdentificationNumber: "123456",
        Phone: {
          Number: "1115554758",
          Extension: " "
        },
        ShipperNumber: "K61C80",
        FaxNumber: "8002222222",
        Address: {
          AddressLine: ["2311 York Rd"],
          City: "Timonium",
          StateProvinceCode: "MD",
          PostalCode: "21093",
          CountryCode: "US"
        }
      },
      ship_to: {
        Name: "Happy Dog Pet Supply",
        AttentionName: "1160b_74",
        Phone: { Number: "9225377171" },
        Address: {
          AddressLine: ["123 Main St"],
          City: "timonium",
          StateProvinceCode: "MD",
          PostalCode: "21030",
          CountryCode: "US"
        },
        Residential: " "
      },
      ship_from: {
        Name: "T and T Designs",
        AttentionName: "1160b_74",
        Phone: { Number: "1234567890" },
        FaxNumber: "1234567890",
        Address: {
          AddressLine: ["2311 York Rd"],
          City: "Alpharetta",
          StateProvinceCode: "GA",
          PostalCode: "30005",
          CountryCode: "US"
        }
      },
      package: {
        Description: " ",
        Packaging: { Code: "02", Description: "Nails" },
        Dimensions: {
          UnitOfMeasurement: { Code: "IN", Description: "Inches" },
          Length: "10",
          Width: "30",
          Height: "45"
        },
        PackageWeight: {
          UnitOfMeasurement: { Code: "LBS", Description: "Pounds" },
          Weight: "5"
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
        'https://8xhibt3xrf.execute-api.us-east-2.amazonaws.com/dev/label',
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
  }

  async getPngBase64Label(): Promise<void> {
    const requestData = {
      trans_id: "your_transaction_id",
      transaction_src: "testing",
      shipper: {
        Name: "ShipperName",
        TaxIdentificationNumber: "123456",
        Phone: {
          Number: "1115554758",
          Extension: " "
        },
        FaxNumber: "8002222222",
        Address: {
          AddressLine: ["2311 York Rd"],
          City: "Timonium",
          StateProvinceCode: "MD",
          PostalCode: "21093",
          CountryCode: "US"
        }
      },
      ship_to: {
        Name: "Happy Dog Pet Supply",
        Phone: { Number: "9225377171" },
        Address: {
          AddressLine: ["123 Main St"],
          City: "timonium",
          StateProvinceCode: "MD",
          PostalCode: "21030",
          CountryCode: "US"
        },
        Residential: " "
      },
      ship_from: {
        Name: "T and T Designs",
        Phone: { Number: "1234567890" },
        Address: {
          AddressLine: ["2311 York Rd"],
          City: "Alpharetta",
          StateProvinceCode: "GA",
          PostalCode: "30005",
          CountryCode: "US"
        }
      },
      package: {
        Description: " ",
        Packaging: { Code: "02", Description: "Nails" },
        Dimensions: {
          UnitOfMeasurement: { Code: "IN", Description: "Inches" },
          Length: "10",
          Width: "30",
          Height: "45"
        },
        PackageWeight: {
          UnitOfMeasurement: { Code: "LBS", Description: "Pounds" },
          Weight: "5"
        }
      },
      label_specification: {
        imageType: "PNG",
        labelStockType: "PAPER_4X6"
      }
    };

    try {
      const response: any = await this.http.post(
        'https://8xhibt3xrf.execute-api.us-east-2.amazonaws.com/dev/labelfedex',
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
  }

  async getJpgBase64Label(): Promise<void> {
    const requestData = {
      trans_id: "your_transaction_id",
      transaction_src: "testing",
      shipper: {
        Name: "ShipperName",
        AttentionName: "ShipperZs Attn Name",
        TaxIdentificationNumber: "123456",
        Phone: {
          Number: "1115554758",
          Extension: " "
        },
        ShipperNumber: "K61C80",
        FaxNumber: "8002222222",
        Address: {
          AddressLine: ["2311 York Rd"],
          City: "Timonium",
          StateProvinceCode: "MD",
          PostalCode: "21093",
          CountryCode: "US"
        }
      },
      ship_to: {
        Name: "Happy Dog Pet Supply",
        AttentionName: "1160b_74",
        Phone: { Number: "9225377171" },
        Address: {
          AddressLine: ["2311 York Rd"],
          City: "St. Louis",
          StateProvinceCode: "MD",
          PostalCode: "63104",
          CountryCode: "US"
        },
        Residential: " "
      },
      ship_from: {
        Name: "T and T Designs",
        AttentionName: "1160b_74",
        Phone: { Number: "1234567890" },
        FaxNumber: "1234567890",
        Address: {
          AddressLine: ["2150 Kinsley Lane"],
          City: "Tallahassee",
          StateProvinceCode: "FL",
          PostalCode: "32308",
          CountryCode: "US"
        }
      },
      package: {
        Description: " ",
        Packaging: { Code: "02", Description: "Nails" },
        Dimensions: {
          UnitOfMeasurement: { Code: "IN", Description: "Inches" },
          Length: "10",
          Width: "30",
          Height: "45"
        },
        PackageWeight: {
          UnitOfMeasurement: { Code: "LBS", Description: "Pounds" },
          Weight: "5"
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
        'https://8xhibt3xrf.execute-api.us-east-2.amazonaws.com/dev/labelusps',
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
  }
}
