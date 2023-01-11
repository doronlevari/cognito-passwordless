const AWS = require("aws-sdk");
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({region: 'us-west-2'})

const UserPoolId = 'us-west-2_9715tagYZ';
const ClientId = '1oibnsb7927ev2mpa0hj3rsgqa';

const getUser = async (Username) => {
    var isUserExists;
    await cognitoIdentityServiceProvider.adminGetUser({ UserPoolId, Username }).promise()
    .then(data => {
        console.log("adminGetUser SUCC");
        console.log(data);
        isUserExists = true;
    })
    .catch(err => {
        console.log("adminGetUser ERR");
        if (err.code === "UserNotFoundException") {
            isUserExists = false;
        } else {
            console.log(err);
        }
    })
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
            console.log("adminCreateUser SUCC");
            console.log(data);
    })
    .catch(err => {
            console.log("adminCreateUser ERR");
            console.log(err);
    })
    params = {
        UserPoolId, 
        Username,
        Password: makePassword(),
        Permanent: true
    }
    await cognitoIdentityServiceProvider.adminSetUserPassword( params ).promise()
    .then(data => {
            console.log("adminSetUserPassword SUCC");
            console.log(data);
    })
    .catch(err => {
            console.log("adminSetUserPassword ERR");
            console.log(err);
    })
};


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
                const params = {};
                switch (data.type) {
                    case "SEND":
                        var isUserExists = await getUser(Username);
                        if (!isUserExists) {
                            await createUser(Username);
                        }
                        
                        await getUser(Username);
                    
                        params = {
                            ClientId, 
                            Username
                        }
                        await cognitoIdentityServiceProvider.forgotPassword( params ).promise()
                        .then(data => {
                                console.log("forgotPassword SUCC");
                                console.log(data);
                        })
                        .catch(err => {
                                console.log("forgotPassword ERR");
                                console.log(err);
                        })
                        break;
                    case "AUTH":
                        const ConfirmationCode = data.confirmationCode;
                        
                        if (!data.confirmationCode) {
                            throw new Error('No ConfirmationCode');
                        }

                        params = {
                            ClientId, 
                            Username,
                            Password: makePassword(),
                            ConfirmationCode: data.confirmationCode
                        }
                        await cognitoIdentityServiceProvider.confirmForgotPassword( params ).promise()
                        .then(data => {
                                console.log("confirmForgotPassword SUCC");
                                console.log(data);
                        })
                        .catch(err => {
                                console.log("confirmForgotPassword ERR");
                                console.log(err);
                                throw new Error(err.message);
                        })
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


// idea from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const makePassword = () => {
    return makeid(10);
}
const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

