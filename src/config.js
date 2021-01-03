const dev = {
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

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "prod-project-tracker-infra-s3-uploads4f6eb0fd-1gjeebsvbo5d2",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://capdvwx25g.execute-api.us-east-1.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_n3kKFUM3x",
    APP_CLIENT_ID: "55cust3spu7l2utshkpuqlb2fm",
    IDENTITY_POOL_ID: "us-east-1:9ffbd44e-7dab-4983-8845-541352f0c10b",
  },
};

const config = {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  // Default to dev if not set
  ...(process.env.REACT_APP_STAGE === "prod" ? prod : dev),
};

export default config;
