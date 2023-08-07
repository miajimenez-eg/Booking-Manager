# Booking Manager API

Description here

## Getting Started
### Prerequisites
List any prerequisites users need to have in order to use your API, such as Node.js, npm, a database, etc.

### Installation
1. Clone this repository
2. Install the required dependencies using the following command:
3. Set up your configuration files, such as auth.js and db.js
4. Start the server:

## Usage

### Authentication

Explain how authentication works in your API. If it requires API keys, tokens, or any specific setup, provide the necessary information here.

### Endpoints
#### GET '/'
This endpoint takes you to the home/login page.

#### Authentication
This endppoint is accessible to both authenticated and unauthenticated users.

#### GET '/bookings'
This endpoint allows you to view all bookings made by a user.

#### Authentication
This endppoint is accessible to authenticated users only.

#### GET '/bookings/:id'
This endpoint allows you to retireve details and information about a specific booking by providing its unique ID

#### Authentication
This endppoint is accessible to authenticated users only.

#### POST '/bookings'
This endpoint enables a user to create a new booking.

#### Authentication
This endppoint is accessible to authenticated users only.

#### PUT '/bookings/:id'
This endpoint can be used to update a booking by providing its unique ID.

#### Authentication
This endppoint is accessible to authenticated users only.

#### DELETE '/bookngs/:id'
This endpoint enables a user to delete a booking.

#### Authentication
This endppoint is accessible to authenticated users only.

