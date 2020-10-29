export interface Config {
    discord: {token: string, prefix: string};
    owners: string[];
}

const config : Config = require(`./confs/${process.env.NODE_ENV !== 'production' ? 'dev' : 'prod'}.config.json`);
export default config;
