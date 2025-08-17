# Bank Transactions Tracker App

A full-stack personal finance app designed to help individuals manage
their money better. Users can create accounts, import transactions (via
bank statements or CSV files), and view basic analytics such as **total
inflow** and **total outflow**.

🚧 **Note:** This project is still in progress. The next major feature
will be **more advanced analytics**.

------------------------------------------------------------------------

## Features

-   🔑 **User Accounts** -- Secure authentication via **Firebase**.
-   🏦 **User Bank Accounts** -- Each user can manage bank accounts,
    which hold imported bank transactions.
-   📂 **Transaction Import** -- Upload bank statements or CSV files to
    quickly add your financial data.
-   📊 **Basic Analytics** -- Track your inflows and outflows at a
    glance.
-   📈 **(Coming soon)** -- Advanced analytics and insights to help
    improve financial decision-making.

------------------------------------------------------------------------

## Tech Stack

**Frontend:**
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [Redux Toolkit Query (RTK
Query)](https://redux-toolkit.js.org/rtk-query/overview) for API calls
and caching

**Backend:**
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/) (via Docker Compose)
- [Sequelize](https://sequelize.org/) ORM for database models and
migrations

**Authentication & Services:**\
- [Firebase](https://firebase.google.com/) -- used for authentication
(potential for additional features like Firestore, Storage, Hosting in
future)

------------------------------------------------------------------------

## Project Structure

    repo-root/
    ├── client/        # React frontend
    ├── api/           # Node.js + Express backend
    ├── docker-compose.yml   # MySQL container setup
    ├── .env.example         # Root env file for docker-compose

------------------------------------------------------------------------

## Getting Started

### Prerequisites

-   Node.js \>= 16
-   Docker & Docker Compose
-   A Firebase project (for authentication)

### Installation

1.  **Clone the repository**

    ``` bash
    git clone https://github.com/chrisjoohn/bank-transactions-tracker.git
    cd bank-transactions-tracker
    ```

2.  **Setup environment variables**

    -   Root (`.env`) → used by `docker-compose`. Copy the provided
        example:

        ``` bash
        cp .env.example .env
        ```

    -   API (`/api/.env`) → configure database connection. Copy and
        edit:

        ``` bash
        cp api/.env.example api/.env
        ```

        Example values:

        ``` env
        DB_PASSWORD=db_password
        DB_DATABASE=db_database
        DB_USERNAME=db_username
        DB_HOST=db_host
        ```

    -   Client (`/client/.env`) → Firebase config. Copy and edit:

        ``` bash
        cp client/.env.example client/.env
        ```

        Example values:

        ``` env
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        ```

3.  **Start the database with Docker**\
    From the project root:

    ``` bash
    docker-compose up -d
    ```

4.  **Install dependencies**

    -   Backend

        ``` bash
        cd api
        npm install
        ```

    -   Frontend

        ``` bash
        cd client
        npm install
        ```

5.  **Run database migrations (Sequelize)**\
    From the `/api` directory:

    ``` bash
    npx sequelize-cli db:migrate
    ```

6.  **Run the app**

    -   Start backend

        ``` bash
        cd api
        npm run dev
        ```

    -   Start frontend

        ``` bash
        cd client
        npm run dev
        ```

------------------------------------------------------------------------

## Roadmap

-   [x] User authentication via Firebase\
-   [x] User bank accounts with linked transactions\
-   [x] Transaction import (CSV/bank statements)\
-   [x] Basic analytics (inflow/outflow)\
-   [ ] Advanced analytics (spending categories, trends, forecasts,
    etc.)\
-   [ ] Expand Firebase usage (Firestore, Storage, Hosting)

------------------------------------------------------------------------

## Contributing

Contributions are welcome! Please open an issue or submit a pull
request.

------------------------------------------------------------------------

## License

This project is licensed under the [MIT License](LICENSE).
