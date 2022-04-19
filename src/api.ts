import axios from "axios";

import { ChargeRequestBody, ChargeRequestResponse, PagSeguroProps } from "./types";

class Requester {
  constructor({ token, sandbox }: PagSeguroProps) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.defaults.headers.post["Content-Type"] = "application/json";
    axios.defaults.headers.post["x-api-version"] = "4.0";
    axios.defaults.baseURL = !!sandbox
      ? "https://sandbox.api.pagseguro.com/"
      : "https://api.pagseguro.com/";
  }

  async getPublicKey() {
    try {
      const response = await axios.post("/public-keys", {
        type: "card",
      });

      return response.data.public_key;
    } catch (e) {
      console.log(e, e.response);
      return false;
    }
  }

  async getCharge(charge_id: string) {
    if (!charge_id) throw new Error("No charge id was setted");

    try {
      const { data } = await axios.get(`/charges/${charge_id}`);
      return data;
    } catch (e) {
      return e.response.data;
    }
  }

  async createCharge(charge_data: ChargeRequestBody) {
    if (!charge_data) throw new Error("No charge data was setted");

    try {
      const { data: response } = await axios.post("/charges", charge_data);

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
      return e.response.data;
    }
  }

  async reversePayment(transaction_id: string, value: number) {
    if (!transaction_id) throw new Error("No target was setted");
    if (!value) throw new Error("No value was setted");

    try {
      const response = await axios.post(`/charges/${transaction_id}/cancel`, {
        amount: {
          value: value,
        },
      });

      return response.data;
    } catch (e) {
      return e.response.data;
    }
  }
}

export default Requester;
