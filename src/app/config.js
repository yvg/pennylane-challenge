const apiToken = process.env.REACT_APP_API_TOKEN
if (!apiToken) {
  throw new Error('REACT_APP_API_TOKEN is not defined in the environment variables');
}

export const config = {
  apiToken: apiToken,
}
