import nodeFetch from "node-fetch";

import { ChargeRequestBody, ChargeRequestResponse, PagSeguroProps } from "./types";

interface FetchHeaders {
  commom: any;
  post: any;
}

class Fetch {
  baseUrl: string;
  headers: FetchHeaders;

  constructor(baseURL: string, token: string) {
    this.headers = {} as FetchHeaders;
    this.headers.commom = {
      Authorization: `Bearer ${token}`,
    };
    this.headers.post = {
      "Content-Type": "application/json",
      "x-api-version": "4.0",
    };
    this.baseUrl = baseURL;
  }

  async get(relativePath: string) {
    const response = await nodeFetch(`${this.baseUrl}${relativePath}`, {
      method: "GET",
      headers: { ...this.headers.commom },
    }).then((response: any) => response.json());

    if (response.ok) return response.json();

    throw response;
  }

  async post(relativePath: string, body: any) {
    const response = await nodeFetch(`${this.baseUrl}${relativePath}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { ...this.headers.commom, ...this.headers.post },
    });

    console.log(`${this.baseUrl}${relativePath}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { ...this.headers.commom, ...this.headers.post },
    });

    if (response.ok) return response.json();

    throw response;
  }
}

class Requester {
  fetch: Fetch;

  constructor({ token, sandbox }: PagSeguroProps) {
    const baseURL = !!sandbox ? "https://sandbox.api.pagseguro.com" : "https://api.pagseguro.com";
    this.fetch = new Fetch(baseURL, token);
  }

  async getPublicKey() {
    try {
      const response = await this.fetch.post("/public-keys", {
        type: "card",
      });

      return response.data.public_key;
    } catch (e) {
      return false;
    }
  }

  async getCharge(charge_id: string) {
    if (!charge_id) throw new Error("No charge id was setted");

    try {
      const response = await this.fetch.get(`/charges/${charge_id}`);
      return response;
    } catch (e) {
      return false;
    }
  }

  async createCharge(charge_data: ChargeRequestBody) {
    if (!charge_data) throw new Error("No charge data was setted");

    try {
      const response = await this.fetch.post("/charges", charge_data);

      const data = {} as ChargeRequestResponse;

      data.id = response.id;
      data.status = response.status;
      data.created_at = response.created_at;
      data.paid_at = response.paid_at;

      if (response.payment_type !== "BOLETO") return response;

      data.boleto = {
        id: response.payment_method.boleto.id,
        barcode: response.payment_method.boleto.barcode,
        formatted_barcode: response.payment_method.boleto.formatted_barcode,
        links: response.links.map((link: any) => link.href),
      };

      return data;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async reversePayment(transaction_id: string, value: number) {
    if (!transaction_id) throw new Error("No target was setted");
    if (!value) throw new Error("No value was setted");

    try {
      const response = await this.fetch.post(`/charges/${transaction_id}/cancel`, {
        amount: {
          value: value,
        },
      });

      return response;
    } catch (e) {
      return false;
    }
  }
}

export default Requester;
