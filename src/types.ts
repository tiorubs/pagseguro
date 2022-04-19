export type PagSeguroProps = {
  token: string;
  sandbox?: boolean;
};

export type PaymentType = "BOLETO" | "CREDIT_CARD";

export type PaymentMethodProps = {
  type: PaymentType;
  installments: number;
  capture: boolean;
  card?: CreditCardProps;
  boleto?: BoletoProps;
};

export type CreditCardProps =
  | {
      number: string;
      exp_month: string;
      exp_year: string;
      security_code: string;
      holder: {
        name: string;
      };
    }
  | {
      encrypted: string;
    };

export type HolderProps = {
  name: string;
  tax_id: string;
  email: string;
  address: {
    street: string;
    number: string;
    locality: string;
    city: string;
    region: string;
    region_code: string;
    postal_code: string;
    country: string;
  };
};

export type BoletoProps = {
  due_date: string;
  holder: HolderProps;
};

export type ChargeRequestBody = {
  reference_id: string;
  description: string;
  amount: {
    value: number;
    currency: string;
  };
  payment_method: PaymentMethodProps;
  card?: CreditCardProps;
  boleto?: BoletoProps;
  notification_urls: string[];
};

export type ChargeRequestResponse = {
  id: string;
  status: string;
  created_at: string;
  paid_at: string;
  boleto?: {
    id: string;
    barcode: string;
    formatted_barcode: string;
    links: string[];
  };
};
