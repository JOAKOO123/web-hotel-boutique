export const environment = {
  production: false,
  cognito: {
    region: 'YOUR_AWS_REGION',
    userPoolId: 'YOUR_COGNITO_USER_POOL_ID',
    clientId: 'YOUR_COGNITO_APP_CLIENT_ID',
    domain: 'https://YOUR_COGNITO_DOMAIN'
  },
  // En desarrollo, el BFF. En la nube, la URL del API Gateway.
  bffApiUrl: 'http://localhost:8080'
};