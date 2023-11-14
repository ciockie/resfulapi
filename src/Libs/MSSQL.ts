import * as sql from "mssql";

interface IRequestParameters {
    output?: boolean;
    [key: string]: any; // add index signature to IRequestParameters
}
import { MSSQL_CONFIG } from "@/Libs/Conf";

class MSSQLCrud {
    private pool: sql.ConnectionPool;

    constructor() {
        this.pool = new sql.ConnectionPool(MSSQL_CONFIG);
    }

    // Helper function to execute a query
    private async executeQuery<T>(
        query: string,
        params?: IRequestParameters,
    ): Promise<T | sql.IResult<T>> {
        return this.pool.connect().then((connection) => {
            const request = connection.request();
            if (params) {
                for (const key in params) {
                    if (params.hasOwnProperty(key)) {
                        request.input(key, params[key]);
                    }
                }
            }
            return request.query<T>(query).finally(() => {
                connection.close();
            });
        });
    }

    // Create a new record
    async create(
        query: string,
        params?: IRequestParameters,
    ): Promise<sql.IResult<any>> {
        return this.executeQuery(query, params);
    }

    // Read records
    async read(
        query: string,
        params?: IRequestParameters,
    ): Promise<sql.IResult<any>> {
        return this.executeQuery(query, params);
    }

    // Update a record
    async update(
        query: string,
        params?: IRequestParameters,
    ): Promise<sql.IResult<any>> {
        return this.executeQuery(query, params);
    }

    // Delete a record
    async delete(
        query: string,
        params?: IRequestParameters,
    ): Promise<sql.IResult<any>> {
        return this.executeQuery(query, params);
    }
}

export default MSSQLCrud;
