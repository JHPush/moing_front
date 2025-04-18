import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: "ap-northeast-2_b05pYHB5i",
  ClientId: "4vq9kc6gq7oe30vmvmg5a4grlm",
};

export const userPool = new CognitoUserPool(poolData);