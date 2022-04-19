<h1 align="center">PagseguroJS</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/tiorubs/@tiorubs/pagseguro?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/tiorubs/@tiorubs/pagseguro?color=56BEB8">

</p>

<br>

# Getting Started

```bash
$ yarn add @tiorubs/pagseguro
```

OR

```bash
$ npm i @tiorubs/pagseguro
```

# Usage

```typescript
import PagSeguro from "@tiorubs/pagseguro";

const pagseguro = await PagSeguro({
  token:""
  sandbox:true, //OPTIONAL
});
```

## Card charge

```typescript
import PagSeguro from "@tiorubs/pagseguro";

const test_card = {
  number: "4111111111111111",
  exp_month: "12",
  exp_year: "2030",
  security_code: "123",
  holder: {
    name: "Marcos Felipe Mangueira",
  },
};

const pagseguro = new PagSeguro({
  token: "",
  sandbox: true,
});

pagseguro.setDescription("card charge sample");
pagseguro.setCard(test_card);

const charge = await pagseguro.charge(1000);
```

## Generating public keys

```typescript
import PagSeguro from "@tiorubs/pagseguro";

const pagseguro = new PagSeguro({
  token: "",
  sandbox: true,
});

const public_key = await pagseguro.getPublicKeys();
```

## Reversing payment

```typescript
import PagSeguro from "@tiorubs/pagseguro";

const transaction_id: string = "";
const value: number = 1000;

const pagseguro = new PagSeguro({
  token: "",
  sandbox: true,
});

const response = await pagseguro.reversePayment(transaction_id, value);
```
