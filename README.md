# Solana Lottery dApp

The Solana Lottery dApp is a decentralized application built on the Solana blockchain that enables users to participate in lottery-style games in a transparent and trustless manner.

## Features

- Ticket Generation: Users can purchase lottery tickets using SOL, the native cryptocurrency of the Solana blockchain.
- Random Number Generation: The dApp utilizes secure random number generation algorithms to determine the winning numbers for each lottery draw.
- Ticket Validation: Participants can verify the authenticity and ownership of their lottery tickets on the blockchain.
- Automatic Payouts: Winners receive their prize directly in their Solana wallet after the lottery draw.

## Prerequisites

- Node.js and npm: Make sure you have Node.js and npm installed on your machine.
- Solana Tool Suite: Install the Solana Command-Line Tool Suite to interact with the Solana blockchain.
- Metamask or Sollet: Set up a wallet with Metamask browser extension or Sollet.io to connect to the Solana network.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/ayushi-ras/solana-lottery-dapp.git
   ```

2. Navigate to the project directory:

   ```
   cd solana-lottery-dapp
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Set up your Solana wallet:

   - If you're using Metamask, connect it to the Solana network.
   - If you're using Sollet, create a new wallet or import an existing one.

5. Update the configuration:

   Open the `config.js` file and set the required parameters such as contract address, fee payer, and network configuration.

6. Build and deploy the smart contract:

   ```
   solana program deploy dist/lottery_program.so
   ```

7. Start the dApp:

   ```
   npm dev start
   or
   yarn dev
   ```

8. Access the dApp:

   Open your browser and navigate to `http://localhost:3000` to access the Solana Lottery dApp.

## Contributing

Contributions are welcome! If you have any suggestions, bug fixes, or new features to propose, please submit an issue or create a pull request.

## License

This project is licensed under the [MIT License](LICENSE).[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Acknowledgments

- [Solana Documentation](https://docs.solana.com/)
- [Solana Labs](https://solana.com/)
