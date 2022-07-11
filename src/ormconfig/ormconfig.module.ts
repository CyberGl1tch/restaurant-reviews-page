import { Module } from '@nestjs/common';
import * as fs from 'fs';
@Module({})
export class OrmconfigModule {
    declare environment: string;
    declare config: any;
    declare envConfig: any;
    declare isOnPaaS: boolean;

    constructor(){
        this.environment = process.env.NODE_ENV || "production";
        this.config = require("../../ormconfiguration.json");
        this.isOnPaaS = ["production","testing","development"].includes(this.environment)

        if(!this.config[this.environment]){
            throw Error(`The application couldn't load a configuration for the ${this.environment} environment. Please check your ormconfiguration.json.`)
        }else{
            this.envConfig = {
                ...(this.isOnPaaS ? {
                    host: process.env.TYPEORM_HOST,
                    port: process.env.TYPEORM_PORT,
                    username: process.env.TYPEORM_USER,
                    password: process.env.TYPEORM_PASSWORD,
                    database: process.env.TYPEORM_DB,
                    ssl: false
                } : {}),
                ...this.config[this.environment]
            }
        }
    }

    public get(): any{
        return this.envConfig
    }
}
