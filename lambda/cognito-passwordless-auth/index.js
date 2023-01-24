const AWS = require("aws-sdk");
const crypto = require("crypto");
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({region: 'us-west-2'});

const UserPoolId = 'us-west-2_9715tagYZ';
const ClientId = '1oibnsb7927ev2mpa0hj3rsgqa';

exports.handler = async (event) => {
    
    var body;
    var statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };
    
    console.log('Event:', event);
    const httpMethod = event.httpMethod;
    
    try {
        switch (httpMethod) {
            case "POST":
                console.log("POST: ", event.body);
                const data = JSON.parse(event.body);
                const Username = data.email;
                var params = {};
                switch (data.type) {
                    case "SEND":
                        await ensureUser(Username);
                    
                        params = {
                            ClientId, 
                            Username
                        };
                        await cognitoIdentityServiceProvider.forgotPassword( params ).promise()
                        .then(data => {
                                console.log("forgotPassword SUCC", data);
                        })
                        .catch(err => {
                                console.log("forgotPassword ERR", err);
                        });
                        break;

                    case "AUTH":
                        const ConfirmationCode = data.confirmationCode;
                        
                        if (!ConfirmationCode) {
                            throw new Error('No ConfirmationCode');
                        }

                        const Password = makePassword();

                        params = {
                            ClientId, 
                            Username,
                            Password,
                            ConfirmationCode
                        };
                        await cognitoIdentityServiceProvider.confirmForgotPassword( params ).promise()
                        .then(data => {
                            console.log("confirmForgotPassword SUCC", data);
                        })
                        .catch(err => {
                            console.log("confirmForgotPassword ERR", err);
                            throw new Error(err.message);
                        });
                        body = Password;
                        break;
                    default:
                        console.error('Unsupported:', data.type);
                        throw new Error('Unsupported');
                }
                break;
            default:
                console.error('Unsupported:', httpMethod);
                throw new Error('Unsupported');
        }
    } catch (err) {
        console.error('err:', err);
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers
    };
};

const makePassword = () => {
    return crypto.randomBytes(20).toString('hex');
};

const ensureUser = async (Username) => {
    var isUserExists = await getUser(Username);
    if (!isUserExists) {
        await createUser(Username);
        isUserExists = await getUser(Username);
        if (!isUserExists) {
            throw new Error('Could not ensure user');
        }
    }
};

const getUser = async (Username) => {
    var isUserExists;
    await cognitoIdentityServiceProvider.adminGetUser({ UserPoolId, Username }).promise()
    .then(data => {
        console.log("adminGetUser SUCC", data);
        isUserExists = true;
    })
    .catch(err => {
        if (err.code === "UserNotFoundException") {
            console.log("adminGetUser got UserNotFoundException. Returning false");
            isUserExists = false;
        } else {
            console.log("adminGetUser ERR", err);
        }
    });
    return isUserExists;
};

const createUser = async (Username) => {
    var params = {
        UserPoolId, 
        Username,
        MessageAction: "SUPPRESS",
        UserAttributes: [
            {
                Name: 'email',
                Value: Username
            },
            {
                Name: 'email_verified', 
                Value: 'true'
            },
        ],
    };
    await cognitoIdentityServiceProvider.adminCreateUser(params).promise()
    .then(data => {
        console.log("adminCreateUser SUCC", data);
    })
    .catch(err => {
        console.log("adminCreateUser ERR", err);
    });
    params = {
        UserPoolId, 
        Username,
        Password: makePassword(),
        Permanent: true
    };
    await cognitoIdentityServiceProvider.adminSetUserPassword( params ).promise()
    .then(data => {
        console.log("adminSetUserPassword SUCC", data);
    })
    .catch(err => {
        console.log("adminSetUserPassword ERR", err);
    });
};
