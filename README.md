# Booking Manager API

This is an API that follows a RESTful structure, where users can sign up/in and create, read, update and delete their own travel bookings.

## Getting Started
### Prerequisites
List any prerequisites users need to have in order to use your API, such as Node.js, npm, a database, etc.

### Installation
1. Clone this repository
2. Install the required dependencies using the following command: `npm install`
3. Set up your configuration files, such as auth.js and db.js
4. Start the server: `npm start run-dev`

## Usage

### Authentication

This application uses Auth0 to authenticate and authorise users. Just sign up using an email and a password that meets the requirements.

### Endpoints
### GET '/'
- This endpoint takes you to the login page.

#### Authentication
- This endpoint is accessible to both authenticated and unauthenticated users.

### GET '/bookings'
- This endpoint allows you to view all your bookings. Admin users can see all bookings.

#### Authentication
- This endpoint is accessible to authenticated users only.

### GET '/bookings/:id'
- This endpoint allows you to retrieve details and information about one of your own bookings by providing its unique ID. An admin user can see any booking by any user.

#### Authentication
- This endpoint is accessible to authenticated users only.

### POST '/bookings'
- This endpoint enables a user to create a new booking.

#### Authentication
- This endpoint is accessible to authenticated users only.

### PUT '/bookings/:id'
- This endpoint can be used to update one of your own bookings by providing its unique ID. An admin user can update any booking by any user.

#### Authentication
- This endpoint is accessible to authenticated users only.

### DELETE '/bookings/:id'
- This endpoint enables you to delete one of your own bookings. An admin user can delete any booking by any user.

#### Authentication
- This endpoint is accessible to authenticated users only.

