# Web app that allows DAOs to easily reimburse their voters for gas fees

1. Ask for an ERC20, start block and end block
2. Create an array of object with the following structure of votes from the params in step 1:

```js
{
  address: '0x1234',
  amount: 0.1,
}
```

3. Build a transaction with all of the voters and amounts from step 2 using [disperse.app](https://disperse.app/)

## Getting Started

First, enter your Sort API key to `.env.example` and rename it to `.env`.

Then, install dependencies and run the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
