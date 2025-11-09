const NodeEnv = 'production'

const localhostURl = 'http://localhost:5173'

const DeploymentUrl = 'https://api-snaptube.cloudcoderhub.in/api/user'


export const privateAppDomain = NodeEnv === 'production' ? DeploymentUrl : localhostURl;