# Fake whatsApp

This repository contains a fake whatsApp built by Group 1 for the Interaction Design course at ITU.

## version control -> ONLY WORK on YOUR OWN BRANCH:
create your own branch: git checkout -b feat/task-description
go to repo -> create merge request (pull request) -> confirm merge

## Installation

Our application is divided into two areas, representing the functionality of two different components; backend and client (frontend). As these components are essentially distinct applications that are hosted on separate instances, they have individual dependencies that are required in order to run.

1. Clone the repository

    ``` git clone https://github.com/ZHANGJialiHappy/fake-whatsUp.git```

2. Install dependencies for backend

    ```
    cmd
    cd backend

    ```

3. Install dependencies for client

    ```
    cmd
    cd client
    npm install
    npm start
    ```

## Running the application

Both backend and client applications will need to be initialized.

* The backend application runs on http://localhost:3000
* The client application runs on http://localhost:3001.

Create two separate terminal sessions for doing this.

1. Run the backend

    ``` cmd
    cd backend
    npm run watch
    ```

2. Run the client

    ```cmd
    cd client
    npm start
    ```