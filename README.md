# txTracker

Track your wallet's interactions on chains/protocols that will potentially airdrop their tokens. txTracker is a fork from `zkFlow`.

## Features

- View number of interactions, volume and gas spent for a given address.
- View token balances for a specific address.
- Track time statistics about your interactions (see Arbitrum airdrop criteria).

## Getting Started

To get `txTracker` up and running locally on your machine, follow these steps:

### Prerequisites

- Node.js: Make sure you have Node.js installed. You can download it from [here](https://nodejs.org/).

### Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```sh
   cd txtracker
   ```

3. Install project dependencies:

   ```sh
   npm install
   ```

### Running the Application

1. Start the development server:

   ```sh
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173` to view the Linea Explorer.

### Building for Production

To build the application for production, run:

```sh
npm run build
```

This command will generate optimized and minified production-ready files in the `build` directory.

## Disclaimer

I am not a web developer, and have heavily based what I did on `zkFlow`. Credit goes to them for the squeletton and design of the web app. 

## Contributing

I come from a different background, I expect to have made a lot of design/architecture mistakes. Never used TS before, with that in mind, **contributions** to `txTracker` are not only welcome, they're heavily encouraged! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push to your forked repository.
4. Create a pull request to the main repository.

## License

This project is licensed under the [MIT License](LICENSE).