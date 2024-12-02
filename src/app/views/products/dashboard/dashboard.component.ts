import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

interface ChangeEvent {
  eventName: string;
  message: {
    title?: string;
    errorCode?: string;
    changedParameters?: {
      Name: string;
      Values: string[];
    }[];
    selectedSheet?: any;
  };
}

declare var QuickSightEmbedding: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  url!: string;
  header!: string;
  loading = true;
  private embeddingContext: any;
  private frameOptions: any;
  private contentOptions: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const urlParam = this.activatedRoute.snapshot.paramMap.get('url');
     this.loading = true;
    this.url = urlParam !== null ? urlParam : '';
    if (this.url.includes('embedding')) {
      this.header = "Edit Dashboard";
    } else {
      this.header = "Dashboard";
    }
    console.log('The new url is:', this.url);

    this.initializeEmbedding();
    
  }

  onGoBack() {
    this.router.navigate(['products']);
  }

  private async initializeEmbedding() {
    const { createEmbeddingContext } = QuickSightEmbedding;
    this.embeddingContext = await createEmbeddingContext({
      onChange: async (messageEvent: ChangeEvent, experienceMetadata: any) => {
        console.log('Context received a change', messageEvent, experienceMetadata);
      },
    });

    const containerElement = document.getElementById('experience-container');
    
    if (!containerElement) {
      console.error('Container element not found.');
      return;
    }

    this.contentOptions = {
      toolbarOptions: {
        reset: true,
        undoRedo: true,
      },
      onMessage: async (messageEvent: ChangeEvent, experienceMetadata: any) => {
        // Handle content options messages
        switch (messageEvent.eventName) {
          case 'default': {
            console.log("Default New dimensions:", messageEvent.eventName, messageEvent.message, experienceMetadata);
            break;
          }
        }
      },
    };

    this.frameOptions = {
      url: this.url,
      container: containerElement,
      height: '700px',
      resizeHeightOnSizeChangedEvent: true,
      withIframePlaceholder: true,
      onChange: async (messageEvent: ChangeEvent, experienceMetadata: any) => {
        // Handle frame options messages
        switch (messageEvent.eventName) {
          case 'default': {
            console.log("Default New dimensions:", messageEvent.eventName, messageEvent.message, experienceMetadata);
            break;
          }
        }
      },
    };

    if (this.url.includes('embedding')) {
      console.log('embedConsole');
      const embeddedConsoleExperience = await this.embeddingContext.embedConsole(this.frameOptions, this.contentOptions);
       this.loading = false;
    } else if (this.url.includes('embed')) {
      console.log('embedDashboard');
      const embeddedDashboardExperience = await this.embeddingContext.embedDashboard(this.frameOptions, this.contentOptions);
       this.loading = false;
    }
    
  }
}
