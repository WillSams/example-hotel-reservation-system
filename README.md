# Hotel Reservation System

Completed as part of a weekend code challenge, simulates booking reservations in a hotel.  Please see the following `Pre-req` section before attempting to process reservations.

## Pre-requisites

Although Apple Mac links are also provided, the instructions below are more reliable for Debian-based distros (Ubuntu, Linux Mint, etc.) but they can also work under [Windows using the Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/about).  The following tools need to be installed:

- [Direnv](https://direnv.net) to load environment variables needed for this project.  Simply executing `sudo apt install direnv` in your terminal (command line) should work in most cases.
- [Docker](https://www.docker.com) to simplify usage of our Postgres SQL RDBMS dependency for development & testing.  If on Debian-based distro, see instructions below if Docker is not already installed.
- [NodeJS](https://nodejs.org/en/download/).

### Installing Docker

Apple Mac instructions can be found [here](https://docs.docker.com/desktop/mac/install/).  Otherwise on Debian-based distros, in your terminal:

```bash
suod bash -c "apt update && apt upgrade -y"
sudo bash -c "add-apt-repository 'deb [arch=amd64] <https://download.docker.com/linux/ubuntu> $RELEASE stable'"
curl -fsSL <https://download.docker.com/linux/ubuntu/gpg> | sudo apt-key add -
sudo bash -c "apt update && apt install docker-ce docker-ce-cli containerd.io docker-compose -y"
sudo bash -c "groupadd docker"
sudo bash -c "usermod -aG docker $USER"
newgrp docker
```

Windows users can refer to [Docker's documentation](https://www.docker.com/docker-desktop/getting-started-for-windows).

### Optional - Installing Node Version Manager (NVM)

If you have the version of Node listed in `.nvmrc` installed via some other method, the following instructions are not necessary.  Apple Mac instructions can be found [here](https://tecadmin.net/install-nvm-macos-with-homebrew).  Otherwise, in your terminal on Debian-based distros or WSL:

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
echo 'export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc
source ~/.bashrc
```

### Install Node Packages

Execute the following within your terminal:

```bash
 # To eliminate any issues, install/use the version listed in .nvmrc.  
 # If you need to install the listed version of Node, execute `nvm install <version-listed-in-.nvmrc>`
npm use            

npm i               # Install the packages needed for the project
npm i -g knex       # Installs Knex globally
```

### Create the database

Execute the following within your terminal:

```bash
docker compose up -d
docker exec -it -u postgres hotel-db bash
```

Once the container's command prompt loads, execute `psql`.  Subsequenly in the Postgres shell, execute:

```bash
CREATE DATABASE hotel_development;
\q   # to quit the psql shell

exit # to exit the container's Bash shell
```

Finally, let's create/seed our tables and then start the GraphQL API

```bash
npm run refresh     # this will drop tables, re-create them, and then seed
npm run dev
```

## Running the script

Execute `npm run process_reservations` to book the reservations listed in `requests.json`.  Each request are processed in the order provided as if they were real-time requests.  The following rules are observed:

- When a room is reserved, it cannot be reserved by another guest on overlapping dates.
- Whenever there are multiple available rooms for a request, the room with the lower final price is assigned.
- Whenever a request is made for a single room, a double bed room may be assigned (if no single is available?).
- Smokers are not placed in non-smoking rooms.
- Non-smokers are not placed in allowed smoking rooms.
- Final price for reservations are determined by daily price * num of days requested, plus the cleaning fee.

Verification can be achieved by matching the `answers.json` to the output of the following API request:

```bash
curl -X POST \
-H "Content-Type: application/json" \
-d '{ "query":"query { reservations { Id RoomId CheckinDate CheckoutDate TotalCharge } }" }' \
http://localhost:4000/graphql
```

Alternatively, [Apollo's GraphQL Studio](https://studio.apollographql.com) can be accessed in your web browser via `http://localhost:4000/graphql`.
