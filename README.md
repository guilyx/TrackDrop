# TrackDrop
[![build](https://github.com/guilyx/TrackDrop/actions/workflows/build.yml/badge.svg)](https://github.com/guilyx/TrackDrop/actions/workflows/build.yml)
![vercel](https://vercelbadge.vercel.app/api/guilyx/trackdrop)
[![codecov](https://codecov.io/gh/guilyx/trackdrop/branch/master/graph/badge.svg)](https://codecov.io/gh/guilyx/trackdrop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Track your wallet's interactions on chains/protocols that will potentially airdrop their tokens. TrackDrop is a fork from `zkFlow`.

## Features

- View number of interactions, volume and gas spent for a given address.
- View token balances for a specific address.
- Track time statistics about your interactions (see Arbitrum airdrop criteria).

## Getting Started

To get `TrackDrop` up and running locally on your machine, follow these steps:

### Running the TxTracker Docker Container

The TxTracker Docker container allows you to run the application in an isolated environment.
Follow these steps to build and run the Docker container:

### Prerequisites

Before you begin, make sure you have the following software installed on your system:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)

### Build the Docker Image

1. Clone the repository:

   ```sh
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```sh
   cd TrackDrop
   ```

3. Run the following command to build the Docker image using the provided Dockerfile:

   ```bash
   docker-compose -f docker/docker-compose.yml build
   ```

   This command will use the `Dockerfile` located in the `docker` directory to build the Docker image named `txtracker`.

### Run the Docker Container

1. After successfully building the Docker image, you can run the Docker container using the following command:

   ```bash
   docker-compose -f docker/docker-compose.yml up
   ```

2. Once the container is up and running, you can access the TxTracker application by opening a web browser and navigating to `http://localhost:5173/tx-tracker`.

### Stopping and Removing the Container

When you're done using the TxTracker application, you can stop and remove the Docker container:

1. Run the following command to stop and remove the Docker container:

   ```bash
   docker-compose -f docker/docker-compose.yml down
   ```

2. Open your browser and navigate to `http://localhost:5173` to view the TrackDrop web app.

### Additional Notes

- If you want to make changes to the application code, you can do so in your local project directory, and the changes will be reflected in the running Docker container.
- The Docker container exposes the application on port 8080. You can modify the `docker-compose.yml` file to change the port mapping if needed.

---

With these instructions, you should be able to build and run the TxTracker Docker container on your system. If you encounter any issues, refer to the Docker documentation or seek assistance from your development team.

## Disclaimer

I am not a web developer, and have heavily based what I did on `zkFlow`. Credit goes to them for the squeletton and design of the web app. 

## Contributing

I come from a different background, I expect to have made a lot of design/architecture mistakes. Never used TS before, with that in mind, **contributions** to `TrackDrop` are not only welcome, they're heavily encouraged! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push to your forked repository.
4. Create a pull request to the main repository.

## License

This project is licensed under the [MIT License](LICENSE).
