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
  labels: { carrier: string, base64: string, imageFormat: string }[] = [];
  USPSLabel: Label[] = [];
  fedexLabel: Label[] = [];
  gifBase64: string = '';
  pngBase64: string = '';
  base64Jpg: string = '';
  selectedRates: any[] = [];
  addressForm: AddressFormModel;
  isLoading: boolean = true;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit(): void {
    this.selectedRates = this.dataService.getSelectedRates();
    this.addressForm = this.dataService.getSelectedAddressForm();

    console.log('selectedRates.length: ', this.selectedRates.length);
    if (this.selectedRates.length > 0) {
      this.isLoading = true;

      const fetchPromises = this.selectedRates.map(rate => {
        switch (rate.carrier) {
          case 'UPS':
            return this.fetchLabel('UPS', 'label', 'GIF', rate, this.addressForm);
          case 'FedEx':
            return this.fetchLabel('FedEx', 'labelfedex', 'PNG', rate, this.addressForm);
          case 'USPS':
            return this.fetchLabel('USPS', 'labelusps', 'JPG', rate, this.addressForm);
          default:
            console.error(`Unknown carrier: ${rate.carrier}`);
            return Promise.resolve();
        }
      });

      // Wait for all fetchLabel calls to complete
      Promise.all(fetchPromises).finally(() => this.isLoading = false);
    } else {
      console.log('No data ', this.selectedRates);
      this.isLoading = false;
    }
  }

  getRequestData(rate: any) {
    switch (rate.carrier) {
      case 'UPS':
        return this.requestDataUps();
      case 'FedEx':
        return this.requestDataFedEx();
      case 'USPS':
        return this.requestDataUsps();
      default:
        console.error(`Unknown carrier: ${rate.carrier}`);
        return false;
    }
  }

  requestDataUps() {
    return {
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
  }
  requestDataFedEx() {
    return {
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
  }
  requestDataUsps() {
    return {
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
  }

  async fetchLabel(carrier: string, endpoint: string, imageFormat: string, rate: any, addressForm: AddressFormModel): Promise<void> {
    // const requestData = {
    //   trans_id: "your_transaction_id",
    //   transaction_src: "testing",
    //   shipper: {
    //     Name: this.addressForm.fromName,
    //     AttentionName: "ShipperZs Attn Name",
    //     TaxIdentificationNumber: "123456",
    //     Phone: {
    //       Number: this.addressForm.fromPhone,
    //       Extension: " "
    //     },
    //     ShipperNumber: "K61C80",
    //     FaxNumber: "8002222222",
    //     Address: {
    //       AddressLine: [this.addressForm.fromStreet1],
    //       City: this.addressForm.fromCity,
    //       StateProvinceCode: this.addressForm.fromState,
    //       PostalCode: this.addressForm.fromZip,
    //       CountryCode: this.addressForm.fromCountry
    //     }
    //   },
    //   ship_to: {
    //     Name: this.addressForm.toName,
    //     AttentionName: "1160b_74",
    //     Phone: { Number: this.addressForm.toPhone },
    //     Address: {
    //       AddressLine: [this.addressForm.toStreet1],
    //       City: this.addressForm.toCity,
    //       StateProvinceCode: this.addressForm.toState,
    //       PostalCode: this.addressForm.toZip,
    //       CountryCode: this.addressForm.toCountry
    //     },
    //     Residential: " "
    //   },
    //   ship_from: {
    //     Name: this.addressForm.fromName,
    //     AttentionName: "1160b_74",
    //     Phone: { Number: this.addressForm.fromPhone },
    //     FaxNumber: "1234567890",
    //     Address: {
    //       AddressLine: [this.addressForm.fromStreet1],
    //       City: this.addressForm.fromCity,
    //       StateProvinceCode: this.addressForm.fromState,
    //       PostalCode: this.addressForm.fromZip,
    //       CountryCode: this.addressForm.fromCountry
    //     }
    //   },
    //   package: {
    //     Description: " ",
    //     Packaging: { Code: "02", Description: "Nails" },
    //     Dimensions: {
    //       UnitOfMeasurement: { Code: "IN", Description: "Inches" },
    //       Length: this.addressForm.parcelLength,
    //       Width: this.addressForm.parcelWidth,
    //       Height: this.addressForm.parcelHeight
    //     },
    //     PackageWeight: {
    //       UnitOfMeasurement: { Code: "LBS", Description: "Pounds" },
    //       Weight: this.addressForm.parcelWeight
    //     }
    //   },
    //   label_specification: {
    //     LabelImageFormat: {
    //       Code: imageFormat,
    //       Description: imageFormat
    //     },
    //     HTTPUserAgent: "Mozilla/4.5"
    //   }
    // };

    const requestData = this.getRequestData(rate);

    try {
      const response: any = await this.http.post(`${environment.host}/dev/${endpoint}`, requestData).toPromise();
      const base64Image = response?.body?.base64Image || '';

      if (base64Image) {
        this.labels.push({ carrier, base64: base64Image, imageFormat });
      }
    } catch (error) {
      console.error(`Error fetching ${carrier} label:`, error);
    }
  }

  printLabel(label: { carrier: string, base64: string, imageFormat: string }) {
    const printWindow = window.open('', '', 'height=500,width=800');
    const imgElement = `<img src="data:image/${label.imageFormat.toLowerCase()};base64,${label.base64}" alt="${label.carrier} Label" />`;
    if (printWindow) {
      printWindow.document.write(imgElement);
      printWindow.document.close();
      printWindow.print();
    }
  }

  saveLabel(label: { carrier: string, base64: string, imageFormat: string }) {
    const link = document.createElement('a');
    link.href = `data:image/${label.imageFormat.toLowerCase()};base64,${label.base64}`;
    link.download = `${label.carrier}_Label.${label.imageFormat.toLowerCase()}`;
    link.click();
  }

  printAllLabels(): void {
    if (this.labels.length === 0) {
      alert("No labels available to print.");
      return;
    }
  
    // Create a printable window content
    const printableContent = this.labels.map(label => `
      <div style="text-align: center; margin-bottom: 20px; page-break-after: always;">
        <img src="data:image/${label.imageFormat.toLowerCase()};base64,${label.base64}" 
             alt="${label.carrier} Label" 
             class="${label.imageFormat.toLowerCase() === 'gif' ? 'rotatable' : ''}"/>
      </div>
    `).join("");
  
    // Open a new window or tab and write the content
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Labels</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
              }
              img {
                display: block;
                width: 100%; /* Full width of the page */
                height: 100vh; /* Full height of the page */
                object-fit: contain; /* Maintain aspect ratio */
              }
              .rotatable {
                transform: rotate(90deg);
                transition: transform 0.3s ease;
                object-fit: contain; /* Ensures the image stays within its container */
              }
              /* Ensures each label is printed on a new page */
              @media print {
                div {
                  page-break-after: always;
                }
                html, body {
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            ${printableContent}
            <script>
              window.onload = function () {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
  
}