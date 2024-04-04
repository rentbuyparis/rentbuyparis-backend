module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'ab763252-fa1b-4474-ae90-4dec048d9fe4'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', '6a61c01c3779d5ad7edc3a95a5d34a06'),
  },
});
