// export constants

//mssql configuration
export const MSSQL_CONFIG = {
    user: "",
    password: "",
    server: "",
    database: "",
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
const MONGODB_USER = "";
const MONGODB_PASSWORD = "";
const MONGODB_HOST = "";
const MONGODB_PORT = "";
const MONGODB_AUTH_SOURCE = "";
export const MONGODB_DATABASE = "";

export const mongoURI = `mongodb://${MONGODB_USER}:${encodeURIComponent(
    MONGODB_PASSWORD,
)}@${MONGODB_HOST}:${MONGODB_PORT}/?authMechanism=DEFAULT&authSource=${MONGODB_AUTH_SOURCE}`;

export const DB_SELECTOR_IS_MONGO = true;

export const channelAccessToken = "";
export const channelSecret = "";
