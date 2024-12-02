/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UsersService } from '../users.service';

declare var paypal: any;

@Component({
  selector: 'app-user',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  userData: User[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = [
    'email',
    'subscribe',
    'status',
    'enabled',
    'created'
  ];

  constructor(private userSvc: UsersService) {}
 
 initPayPalButton(email:string) {
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '';
    }
    paypal.Buttons({
    
      createSubscription: function(data:any, actions:any) {
        console.log('Aiso')
        return actions.subscription.create({
          plan_id: 'P-6V999870V9567384VMWSZU4I', // Replace with your PayPal plan ID
          custom_id: email
          
        });
      },
      onApprove: function(data:any, actions:any) {
        console.log("data:");
        console.log(data);
        console.log("subscriptionID:");
        console.log(data['subscriptionID']);
        const subscription =  actions.subscription.get();
        console.log(subscription);
       
        
        alert('Subscription approved! Please refresh the page.');
      },
      onError: function(err:any) {
          alert(err);
        // Handle errors
        console.error(err);
      }
    }).render('#paypal-button-container'); // Replace with the ID of the container where you want to render the button
  }

  ngOnInit(): void {
    this.userSvc.fetch().subscribe((data) => {
      this.userData = data;
      this.isLoading = false;
    });
  }
}
