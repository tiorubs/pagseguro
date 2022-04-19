<h1 align="center">PagseguroJS</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/tiorubs/pagsegurojs?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/tiorubs/pagsegurojs?color=56BEB8">

</p>

<br>
## :checkered_flag: Getting Started

```bash
$ yarn add pagsegurojs
```

OR

```bash
$ npm i pagsegurojs
```

# USAGE

```typescript
import PagSeguro from "pagsegurojs";

const pagseguro = await PagSeguro({
  token:""
  sandbox:true, //OPTIONAL
});
```

## Card charge sample

```typescript
const PagSeguro = require("pagsegurojs");

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
const PagSeguro = require("pagsegurojs");

const pagseguro = new PagSeguro({
  token: "",
  sandbox: true,
});

const public_key = await pagseguro.getPublicKeys();
```

## Reversing payment

```typescript
const PagSeguro = require("pagsegurojs");

const transaction_id: string = "";
const value: number = 1000;

const pagseguro = new PagSeguro({
  token: "",
  sandbox: true,
});

const response = await pagseguro.getPublicKeys(transaction_id, value);
```
