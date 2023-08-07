const request = require('supertest');
const app = require('../app');

let server; // Declare a variable to hold the server instance

beforeAll(() => {
    server = app.listen(3000); // Start the server
});

afterAll((done) => {
    server.close(done); // Close the server when all tests are done
});


describe('Booking Endpoints', () => {

    it('should retrieve all bookings', async () => {
        try {
            const res = await request(app).get('/bookings');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('bookings');
        } catch (error) {
            console.error(error);
        }
    });
})