import { CognitoUserPool } from 'amazon-cognito-identity-js';

  const poolData = {
    UserPoolId: 'us-west-2_9715tagYZ',
    ClientId: '1oibnsb7927ev2mpa0hj3rsgqa'
  };

export default new CognitoUserPool(poolData);
