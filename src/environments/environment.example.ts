export const environment = {
  production: false,
  cognito: {
    region: 'YOUR_AWS_REGION',
    userPoolId: 'YOUR_COGNITO_USER_POOL_ID',
    clientId: 'YOUR_COGNITO_APP_CLIENT_ID',
    domain: 'https://YOUR_COGNITO_DOMAIN'
  },
  usuariosApiUrl: 'http://localhost:8081',
  reservasApiUrl: 'http://localhost:8082'
};