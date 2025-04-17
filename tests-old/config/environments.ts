type Environment = {
  baseUrl: string;
  credentials: {
    username: string;
    password: string;
  };
};

const environments: Record<string, Environment> = {
  beta: {
    baseUrl: 'http://admin.beta.myebrana.com',
    credentials: {
      username: 'admin@ebrana.cz',
      password: 'fake value protoze repo je public'
    }
  },
  alpha: {
    baseUrl: 'http://admin.alpha.myebrana.com',
    credentials: {
      username: 'admin@ebrana.cz',
      password: 'fake value protoze repo je public'
    }
  },
  production: {
    baseUrl: 'http://admin.myebrana.com',
    credentials: {
      username: 'admin@ebrana.cz',
      password: 'fake value protoze repo je public'
    }
  },
  radosta: {
    baseUrl: 'http://admin.radosta.myebrana.com',
    credentials: {
      username: 'admin@ebrana.cz',
      password: 'fake value protoze repo je public'
    }
  }
};

export const getEnvironment = (): Environment => {
  const env = process.env.TEST_ENV || 'alpha';
  if (!(env in environments)) {
    throw new Error(`Environment "${env}" is not defined. Available environments: ${Object.keys(environments).join(', ')}`);
  }
  return environments[env];
};
