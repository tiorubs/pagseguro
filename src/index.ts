import Requester from "./api";

import {
  BoletoProps,
  ChargeRequestBody,
  CreditCardProps,
  HolderProps,
  PagSeguroProps,
  PaymentType,
} from "./types";

class PagSeguro {
  credit_card?: CreditCardProps;
  boleto?: BoletoProps;
  payment_type?: PaymentType;
  reference?: string;
  installments?: number;
  description?: string;

  _requester: Requester;

  constructor(props: PagSeguroProps) {
    this._requester = new Requester(props);
  }

  async getPublicKeys() {
    return this._requester.getPublicKey();
  }

  setCard(credit_card: CreditCardProps) {
    this.payment_type = "CREDIT_CARD";
    this.credit_card = credit_card;

    this.installments = 1;

    this.boleto = undefined;
  }

  setBoleto(holder: HolderProps) {
    this.payment_type = "BOLETO";

    const date = new Date();
    date.setDate(date.getDate() + 10);

    this.boleto = {
      due_date: date.toISOString().slice(0, 10),
      holder: holder,
    };

    this.installments = 1;

    this.credit_card = undefined;
  }

  setReference(reference: string) {
    this.reference = reference;
  }

  setInstallments(installments: number | string) {
    this.installments = Number(installments);
  }

  setDescription(description: string) {
    this.description = description;
  }

  async charge(value: number) {
    if (!value) throw new Error("the value was not setted");
    if (!this.payment_type) throw new Error("the payment type was not setted");

    const data = {
      reference_id: this.reference,
      description: this.description || "",
      amount: {
        value: value,
        currency: "BRL",
      },
      payment_method: {
        type: this.payment_type,
        installments: this.installments,
        capture: true,
      },
    } as ChargeRequestBody;

    if (this.payment_type === "CREDIT_CARD") data.payment_method.card = this.credit_card;

    if (this.payment_type === "BOLETO") data.payment_method.boleto = this.boleto;

    return this._requester.charge(data);
  }

  async reversePayment(transaction_id: string, value: number) {
    return this._requester.reversePayment(transaction_id, value);
  }

  static async validateCard(card: CreditCardProps, props: PagSeguroProps) {
    const pagseguro = new PagSeguro(props);

    pagseguro.setDescription("validating credit card");
    pagseguro.setCard(card);

    const charge = await pagseguro.charge(1000);

    if (!charge.status || charge.status !== "PAID") return false;

    await pagseguro.reversePayment(charge.id, 1000);

    return true;
  }
}

export default PagSeguro;
