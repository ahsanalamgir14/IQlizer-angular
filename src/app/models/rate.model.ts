export class Rate {
  object: string;
  mode: string;
  service: string;
  carrier: string;
  rate: any;
  currency: string;
  retail_rate: string;
  retail_currency: string;
  list_rate: string;
  list_currency: string;
  billing_type?: string;
  delivery_days: string | number | null;
  delivery_date: string | null;
  delivery_date_guaranteed: boolean;
  est_delivery_days: string | number | null;
  carrier_account_id: string;
  selected?: boolean; // Optional property to track selection
}