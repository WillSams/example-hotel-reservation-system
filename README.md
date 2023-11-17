# Hotel Reservation System

Completed as part of a weekend code challenge, simulates booking reservations in a hotel.  Please see the following `Pre-req` section before attempting to process reservations.

**Usage:**

```bash
# List all existing booked reservations
curl http://localhost:$API_PORT/graphql \
    -H 'Content-Type: application/json' \
    -d '{"query": "query { reservations { RoomId CheckinDate CheckoutDate  } }"}'

# Create a new reservation
# Note: if there is an overlap, you'll see a 
#   'Reservation dates overlap with an existing reservation' error message
# To see the aforementioned error, run this mutation a multiple times
curl http://localhost:$API_PORT/graphql \
    -H 'Content-Type: application/json' \
    -d '{ "query": "mutation { createReservation( input: { roomId: \"91754a14-4885-4200-a052-e4042431ffb8\", checkinDate: \"2020-12-31\", checkoutDate: \"2021a-01-02\", totalCharge: 111 }) { Id RoomId CheckinDate CheckoutDate TotalCharge } }" }'

# List Available Rooms for a given date range
curl http://localhost:$API_PORT/graphql \
    -H 'Content-Type: application/json' \
    -d '{"query": "query { availableRooms( startDate: \"2023-12-31\", endDate: \"2024-01-02\" numBeds: 1, allowSmoking: false) { Id NumBeds AllowSmoking DailyRate CleaningFee } }" }'
```

## Pre-requisites

Although Apple Mac links are also provided, the instructions below are more reliable for Debian-based distros (Ubuntu, Linux Mint, etc.) but they can also work under [Windows using the Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/about).  The following tools need to be installed:

- [Direnv](https://direnv.net) to load environment variables needed for this project.  Simply executing `sudo apt install direnv` in your terminal (command line) should work in most cases.
- [Docker](https://www.docker.com) to simplify usage of our Postgres SQL RDBMS dependency for development & testing.  If on Debian-based distro, see instructions below if Docker is not already installed.
- [NodeJS](https://nodejs.org/en/download/).
- [nvm](https://github.com/nvm-sh/nvm) - Used to manage NodeJS versions.

## Install Node Packages

Execute the following within your terminal:

```bash
nvm use             # To eliminate any issues, install/use the version listed in .nvmrc. 
npm i               # install the packages needed for project 
```

## Create the database

Finally, let's create and seed the databases and our Reservations and Rooms tables:

```bash
# Create the databases and seed them
cd src/db
NODE_ENV=development | ./create_db.sh && npm run refresh
NODE_ENV=test | ./create_db.sh && npm run refresh
```

## Running the script

Start the GraphQL API by running in the background `npm run dev &`.

Execute `npm run process_requests` to book the reservations listed in `requests.json`.  Each request are processed in the order provided as if they were real-time requests.  The following rules are observed:

- When a room is reserved, it cannot be reserved by another guest on overlapping dates.
- Whenever there are multiple available rooms for a request, the room with the lower final price is assigned.
- Whenever a request is made for a single room, a double bed room may be assigned (if no single is available?).
- Smokers are not placed in non-smoking rooms.
- Non-smokers are not placed in allowed smoking rooms.
- Final price for reservations are determined by daily price * num of days requested, plus the cleaning fee.

Verification can be achieved by matching the [`answers.json`](./src/answers.json) to the output of the following API request:

```bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{ "query":"query { reservations { Id RoomId CheckinDate CheckoutDate TotalCharge } }" }' \
http://localhost:4000/graphql
```

Alternatively, [Apollo's GraphQL Studio](https://studio.apollographql.com) can be accessed in your web browser via `http://localhost:4000/graphql`.
