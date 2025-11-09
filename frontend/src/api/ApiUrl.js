const NodeEnv = 'productions'

const localhostURl = 'http://localhost:8443/api/user'

const DeploymentUrl = 'https://api-snapbasket.cloudcoderhub.in/api/user'

export const BaseUrl = NodeEnv === 'production' ? DeploymentUrl : localhostURl