// export constants

//mssql configuration
export const MSSQL_CONFIG = {
    user: "409",
    password: "Server2019",
    server: "10.5.0.17",
    database: "x409iBase_",
    synchronize: true,
    trustServerCertificate: true,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    option: {
        encrypt: false,
    },
};

// MongoDB configuration not config yet
const MONGODB_USER = "409";
const MONGODB_PASSWORD =
    "5B4p(bPhyHZL93aF)zkMXm%8qT^c@n6IjuSN#2$CtRwf&eYx+7GvKDdUWs!JQ*rV";
const MONGODB_HOST = "10.5.0.5";
const MONGODB_PORT = "27017";
const MONGODB_AUTH_SOURCE = "409-api";
export const MONGODB_DATABASE = "409-api";

export const mongoURI = `mongodb://${MONGODB_USER}:${encodeURIComponent(
    MONGODB_PASSWORD
)}@${MONGODB_HOST}:${MONGODB_PORT}/?authMechanism=DEFAULT&authSource=${MONGODB_AUTH_SOURCE}`;

export const DB_SELECTOR_IS_MONGO = true;
