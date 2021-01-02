const config = {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "dev-project-tracker-infra-s3-uploads4f6eb0fd-145xayp1z90zf",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://qswmjno694.execute-api.us-east-1.amazonaws.com/dev",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_DkwzvojjK",
    APP_CLIENT_ID: "2d13g8mv48el6ljnbeqgh31g3k",
    IDENTITY_POOL_ID: "us-east-1:89e72f40-7a8f-40ea-809b-211d24f59d44",
  },
};

export default config;
