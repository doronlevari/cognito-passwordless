const lambda = require('../index.js');

const TEST_EMAIL = 'doronlevari@gmail.com';
const CONFIRMATION_CODE = '570386';

describe("test Lambda", () => {
    it("should SEND", async () => {
        const event = {
            httpMethod: 'POST',
            body: '{"type":"SEND","email":"'+TEST_EMAIL+'"}'
        }
        
        const { statusCode, body, headers } = await lambda.handler(event);

        expect(statusCode).toEqual(200);
        console.log(body);
        console.log(headers);
    })
    // it.only("should AUTH", async () => {
    //         const event = {
    //         httpMethod: 'POST',
    //         body: '{"type":"AUTH","email":"'+TEST_EMAIL+'","confirmationCode": "'+CONFIRMATION_CODE+'"}'
    //     };

    //     const { statusCode, body, headers } = await lambda.handler(event);

    //     expect(statusCode).toEqual(200);
    //     console.log(body);
    //     console.log(headers);
    // })
});


