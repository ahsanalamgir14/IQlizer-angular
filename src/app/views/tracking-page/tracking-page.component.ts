import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import axios from 'axios';


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
  isLoading: boolean = true;
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
          this.upsData = response.body.shipmentDetails.trackingEvents;
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

  // getUspsShipment(params: any) {
  //   const url = `${environment.host}/dev/trackerUSPS`;
  
  //   axios({
  //     method: 'get',
  //     url: url,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     params: params,
  //   })
  //     .then((response) => {
  //       console.log('API Response:', response.data);
  
  //       if (response.data && response.data.shipmentDetails) {
  //         this.uspsData = response.data.shipmentDetails.trackingEvents;
  //         this.uspsEventsByDate();
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching tracking data:', error);
  //       console.log('Unable to fetch tracking details. Please try again later.');
  //       this.isLoading = false;
  //     })
  //     .finally(() => {
  //       this.isLoading = false;
  //     });
  // }
  
  getUspsShipment(body: any) {
    const url = 'https://8xhibt3xrf.execute-api.us-east-2.amazonaws.com/dev/trackerUSPS';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Create a custom GET request with a body
    const req = new HttpRequest('GET', url, body, { headers });

    // Send the request
    this.http.request(req).subscribe(
      (response: any) => {
        if (response.body) {
          console.log('API Response:', response.body);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
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
    if (this.trackingId.startsWith('1Z')) {
      console.log('Tracking via UPS');
      this.showUps = true;
      this.showUsps = false;
      this.showFedex = false;
      this.getUpsShipment(this.createParams());
    } else if (this.trackingId.startsWith('9')) {
      console.log('Tracking via FedEx');
      this.showUps = false;
      this.showUsps = false;
      this.showFedex = true;
      this.getFedexShipment(this.createParams());
    } else {
      console.log('Tracking via USPS');
      this.showUps = false;
      this.showUsps = true;
      this.showFedex = false;
      this.getUspsShipment(this.createParams());
    }
  }
  
  createParams() {
    return {
      "tracking_number": this.trackingId,
      "locale": 'en_US',
      "return_signature": 'false',
      "return_milestones": 'false',
      "return_pod": 'false',
      "transId": '12345',
      "transactionSrc": 'testing',
    };
  }
  
}
