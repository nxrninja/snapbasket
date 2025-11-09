const LocalHostRefreshTokenOption = {
  httpOnly: true,
  secure: false,
  sameSite: 'Lax',
  path: '/',
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
};

const DeploymentRefreshTokenOption = {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',
  domain: 'snapbasket.cloudcoderhub.in',
  path: '/',
  expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
};

const LocalHostAccessTokenOption = {
  httpOnly: true,
  secure: false,
  sameSite: 'Lax',
  path: '/',
  expires: new Date(Date.now() + 1 * 60 * 60 * 1000)
};

const DeploymentAccessTokenOption = {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',
  domain: 'snapbasket.cloudcoderhub.in',
  path: '/',
  expires: new Date(Date.now() + 6 * 60 * 60 * 1000)
};

const RefreshtokenOption = process.env.NODE_ENV === 'production'
  ? DeploymentRefreshTokenOption
  : LocalHostRefreshTokenOption;

const AccesstokenOption = process.env.NODE_ENV === 'production'
  ? DeploymentAccessTokenOption
  : LocalHostAccessTokenOption;

export { RefreshtokenOption, AccesstokenOption };