import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tracking-page',
  templateUrl: './tracking-page.component.html',
  styleUrls: ['./tracking-page.component.scss']
})
export class TrackingPageComponent implements OnInit {
  upsData = [];
  uspsData = [];
  fedExData = [];
  showUps: boolean = false;
  showUsps: boolean = false;
  showFedex: boolean = false;
  isLoading: boolean = false;
  trackingId: string = '';
  upsEvents: any[] = [];
  uspsEvents: any[] = [];
  fedExEvents: any[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Get the tracking ID from URL parameters if available
    this.route.queryParams.subscribe(params => {
      const trackingIdFromUrl = params['trackingId'];
      if (trackingIdFromUrl) {
        this.trackingId = trackingIdFromUrl; // Use the ID from the URL
        this.trackShipment(); // Automatically track shipment if ID is in the URL
      }
    });
  }

  upsEventsByDate() {
    const grouped = this.upsData.reduce((acc: any, event: any) => {
      const [rawDate, rawTime] = event.eventTimestamp.split('T');
      const formattedDate = this.formatDate(rawDate);
      const time = rawTime.slice(0, 5);
      const eventDetails = {
        eventType: event.eventType,
        time,
        details: `${event.eventCity || 'N/A'}, ${event.eventState || 'N/A'}`,
      };

      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(eventDetails);

      return acc;
    }, {});

    // Transform grouped data into an array for rendering
    this.upsEvents = Object.keys(grouped).map((date) => ({
      date,
      events: grouped[date],
    }));
  }
  uspsEventsByDate() {
    const grouped = this.uspsData.reduce((acc: any, event: any) => {
      const [rawDate, rawTime] = event.eventTimestamp.split('T');
      const formattedDate = this.formatDate(rawDate);
      const time = rawTime.slice(0, 5);
      const eventDetails = {
        eventType: event.eventType,
        time,
        details: `${event.eventCity || 'N/A'}, ${event.eventState || 'N/A'}`,
      };

      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(eventDetails);

      return acc;
    }, {});

    // Transform grouped data into an array for rendering
    this.uspsEvents = Object.keys(grouped).map((date) => ({
      date,
      events: grouped[date],
    }));
  }

  fedExEventsByDate() {
    const grouped = this.fedExData.reduce((acc: any, event: any) => {
      const [rawDate, rawTime] = event.eventTimestamp.split('T');
      const formattedDate = this.formatDate(rawDate);
      const time = rawTime.slice(0, 5);
      const eventDetails = {
        eventType: event.eventType,
        time,
        details: `${event.eventCity || 'N/A'}, ${event.eventState || 'N/A'}`,
      };

      if (!acc[formattedDate]) acc[formattedDate] = [];
      acc[formattedDate].push(eventDetails);

      return acc;
    }, {});

    // Transform grouped data into an array for rendering
    this.fedExEvents = Object.keys(grouped).map((date) => ({
      date,
      events: grouped[date],
    }));
  }

  formatDate(rawDate: string): string {
    const [year, month, day] = [
      rawDate.slice(0, 4),
      rawDate.slice(4, 6),
      rawDate.slice(6, 8),
    ];
    return `${day}-${month}-${year}`;
  }

  getUpsShipment(params: any) {
    this.http.get(`${environment.host}/dev/tracker`, { params }).subscribe(
      (response: any) => {
        console.log('API Response 1:', response);
        if(response.body) {
          this.upsData = response.body.trackingEvents;
          this.upsEventsByDate();
        }
      },
      (error) => {
        console.error('Error fetching tracking data:', error);
        console.log('Unable to fetch tracking details. Please try again later.');
      }
    );
    this.isLoading = false;
  }

  getUspsShipment(params: any) {
    this.http.get(`${environment.host}/dev/trackerUSPS`, { params }).subscribe(
      (response: any) => {
        console.log('API Response: 2', response);

        if(response.body) {
          
          console.log(response.body.shipmentDetails);
          this.uspsData = response.body.trackingEvents;
          this.uspsEventsByDate();
        }
      },
      (error) => {
        console.error('Error fetching tracking data:', error);
        console.log('Unable to fetch tracking details. Please try again later.');
      }
    );
    this.isLoading = false;
  }

  getFedexShipment(params: any) {
    this.http.get(`${environment.host}/dev/trackerfedex`, { params }).subscribe(
      (response: any) => {
        console.log('API Response: 3', response);

        if(response.body) {
          console.log('response.body: ', response.body);
          this.fedExData = response.body.trackingEvents;
          this.fedExEventsByDate();
        }
      },
      (error) => {
        console.error('Error fetching tracking data:', error);
        console.log('Unable to fetch tracking details. Please try again later.');
      }
    );
    this.isLoading = false;
  }
  getCarrierName(trackingId: string): string {
    const carrierPatterns = [
        { name: 'UPS', pattern: /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/ },
        { name: 'FedEx', pattern: /(\b96\d{20}\b)|(\b\d{15}\b)|(\b\d{12}\b)/ },
        { name: 'FedEx', pattern: /\b((98\d\d\d\d\d?\d\d\d\d|98\d\d) ?\d\d\d\d ?\d\d\d\d( ?\d\d\d)?)\b/ },
        { name: 'FedEx', pattern: /^[0-9]{15}$/ },
        { name: 'FedEx', pattern: /^\d{12}$/ },
        { name: 'USPS', pattern: /(\b\d{30}\b)|(\b91\d+\b)|(\b\d{20}\b)/ },
        { name: 'USPS', pattern: /^E\D{1}\d{9}\D{2}$|^9\d{15,21}$/ },
        { name: 'USPS', pattern: /^91[0-9]+$/ },
        { name: 'USPS', pattern: /^[A-Za-z]{2}[0-9]+US$/ },
        { name: 'USPS', pattern: /^420\d{27}$/ } // New USPS pattern for '420' prefix
    ];

    for (const { name, pattern } of carrierPatterns) {
        if (pattern.test(trackingId)) {
            console.log(`Matched Pattern: ${pattern} for Carrier: ${name}`);
            return name;
        }
    }

    console.log(`No match found for: ${trackingId}`);
    return "Unknown Carrier";
}

  trackShipment() {
    if (!this.trackingId) {
      console.log('Please enter a valid tracking ID.');
      return;
    }
  
    // Update the URL with the tracking ID
    this.router.navigate([], {
      queryParams: { trackingId: this.trackingId },
      queryParamsHandling: 'merge', // Keeps other query parameters
    });

    this.isLoading = true;
  
    // Detect the carrier based on the tracking ID format
    if (this.getCarrierName(this.trackingId) === "UPS") {
      console.log('Tracking via UPS');
      this.showUps = true;
      this.showUsps = false;
      this.showFedex = false;
      this.getUpsShipment(this.createParams());
    } else if (this.getCarrierName(this.trackingId) === "FedEx") {
      console.log('Tracking via FedEx');
      this.showUps = false;
      this.showUsps = false;
      this.showFedex = true;
      this.getFedexShipment(this.createParams());
    } else if (this.getCarrierName(this.trackingId) === "USPS") {
      console.log('Tracking via USPS');
      this.showUps = false;
      this.showUsps = true;
      this.showFedex = false;
      this.getUspsShipment(this.createParams());
    } else{
      console.log('Invalid Tracking Id');
    }
  }
  
  createParams() {
    return {
      tracking_number: this.trackingId,
      locale: 'en_US',
      return_signature: 'false',
      return_milestones: 'false',
      return_pod: 'false',
      transId: '12345',
      transactionSrc: 'testing',
    };
  }
  
}
