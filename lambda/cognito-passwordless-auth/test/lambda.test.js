const lambda = require('../index.js');

const TEST_EMAIL = 'doronlevari@gmail.com';

describe.only("Sum numbers", () => {
    it("should sum two numbers correctly", () => {
        const sum = 1 + 2;
        const expectedResult = 3;
        expect(sum).toEqual(expectedResult);
    })
});

describe("test Lambda", () => {
    it("should SEND", async () => {
        const event = {
            httpMethod: 'POST',
            body: {
                type: 'SEND',
                email: TEST_EMAIL
            }
        }
        
        const { statusCode, body, headers } = lambda.handler(event);

        console.log(statusCode);
        console.log(body);
        console.log(headers);
        
        // expect(token).not.toBeNull();
        // expect(token).not.toBeUndefined();
    })
    it("should AUTH", async () => {
        const event = {
            httpMethod: 'POST',
            body: {
                type: 'AUTH',
                email: TEST_EMAIL,
                confirmationCode: 11111
            }
        };

        const { statusCode, body, headers } = lambda.handler(event);

        console.log(statusCode);
        console.log(body);
        console.log(headers);
        
        // expect(token).not.toBeNull();
        // expect(token).not.toBeUndefined();
    })
});


