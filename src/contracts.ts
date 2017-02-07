/// <reference types="node" />

// The MIT License (MIT)
// 
// vs-rest-api (https://github.com/mkloubert/vs-rest-api)
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

import * as HTTP from 'http';
import * as Moment from 'moment';
import * as rapi_host from './host';
import * as URL from 'url';


/**
 * An account.
 */
export interface Account {
    /**
     * [INTERNAL USE] This is used to store global data.
     */
    __globals: { [action: string]: any };

    /**
     * One or more glob patterns with files to exclude.
     */
    exclude?: string | string[];
    /**
     * One or more glob patterns with files to include.
     */
    files?: string | string[];
    /**
     * Is account active or not.
     */
    isActive?: boolean;
}

/**
 * An API endpoint.
 */
export interface ApiEndpoint {
    /**
     * Indicates if the endpoint is currently active or not.
     */
    isActive?: boolean;
    /**
     * The options for the execution.
     */
    options?: any;
    /**
     * The path to the script with the methods to handle the API request.
     */
    script: string;
}

/**
 * An API method.
 * 
 * @param {ApiMethodArguments} args The arguments.
 * 
 * @returns {Promise<any>|void} The result.
 */
export type ApiMethod = (args: ApiMethodArguments) => Promise<any> | void;

/**
 * Arguments for an API method.
 */
export interface ApiMethodArguments extends ScriptArguments {
    /**
     * The content to use instead of 'ApiMethodArguments.response'.
     */
    content?: any;
    /**
     * The text encoding to use.
     */
    encoding: string;
    /**
     * The response headers to send.
     */
    headers: { [key: string]: any };
    /**
     * Options for the execution.
     */
    options?: any;
    /**
     * The path.
     */
    path: string;
    /**
     * The request context.
     */
    readonly request: RequestContext;
    /**
     * The response data.
     */
    response: ApiResponse;
    /**
     * Sets up the response for a 405 HTTP response.
     * 
     * @chainable
     */
    readonly sendMethodNotAllowed: () => ApiMethodArguments;
    /**
     * Sets up the response for a 404 HTTP response.
     * 
     * @chainable
     */
    readonly sendNotFound: () => ApiMethodArguments;
    /**
     * Sets the content of 'ApiMethodArguments.content'.
     * 
     * @param {any} newContent The new content to set.
     * @param {string} mime The content / mime type.
     * 
     * @chainable
     */
    readonly setContent: (newContent: any, mime?: string) => ApiMethodArguments;
    /**
     * The status code.
     */
    statusCode?: number;
    /**
     * Writes data to the response.
     * 
     * @chainable
     */
    readonly write: (data: any) => ApiMethodArguments;
}

/**
 * An API module.
 */
export interface ApiModule extends ScriptModule {
}

/**
 * An API response.
 */
export interface ApiResponse {
    /**
     * The code.
     */
    code: number;
    /**
     * The data.
     */
    data?: any;
    /**
     * The message.
     */
    msg?: string;
}

/**
 * The configuration.
 */
export interface Configuration {
    /**
     * Start HTTP on startup or not.
     */
    autoStart?: boolean;
    /**
     * One or more custom endpoints to define.
     */
    endpoints?: { [pattern: string]: ApiEndpoint },
    /**
     * Configuration for the "guest" account.
     */
    guest?: Account | boolean;
    /**
     * The custom language to use.
     */
    lang?: string;
    /**
     * Settings for live file content updates.
     */
    liveUpdate?: {
        /**
         * Is active or not.
         */
        isActive?: boolean;
    },
    /**
     * Indicates if the root endpoint should be opened in browser after host has been started or not.
     */
    openInBrowser?: boolean;
    /**
     * The TCP port the HTTP server should listen on.
     */
    port?: number;
    /**
     * The name of the realm for the authentication.
     */
    realm?: string;
    /**
     * Indicates if an info popup / notification should be displayed after a successful start / stop of the API host.
     */
    showPopupOnSuccess?: boolean;
    /**
     * Configuration for running as HTTPs server.
     */
    ssl?: {
        /**
         * The path to the ca file.
         */
        ca?: string;
        /**
         * The path to the file of the certificate.
         */
        cert?: string;
        /**
         * The path to the key file.
         */
        key?: string;
        /**
         * The required password for the key file.
         */
        passphrase?: string;
        /**
         * Request unauthorized or not.
         */
        rejectUnauthorized?: boolean;
    },
    /**
     * One or more user accounts.
     */
    users?: UserAccount | UserAccount[];
    /**
     * Settings for the client validator (script).
     */
    validator?: string | {
        /**
         * Additional options / data for the execution (if required).
         */
        options?: any;
        /**
         * The path to the validator script.
         */
        script: string;
    },
    /**
     * Show (directories) with leading '.' character or not.
     */
    withDot?: boolean;
}

/**
 * Describes the structure of the package file of that extenstion.
 */
export interface PackageFile {
    /**
     * The display name.
     */
    displayName: string;
    /**
     * The (internal) name.
     */
    name: string;
    /**
     * The version string.
     */
    version: string;
}

/**
 * A remote client.
 */
export interface RemoteClient {
    /**
     * Its address.
     */
    address: string;
    /**
     * Its TCP port.
     */
    port: number;
}

/**
 * A request context.
 */
export interface RequestContext {
    /**
     * Data of the client.
     */
    client: RemoteClient;
    /**
     * The current configuration.
     */
    config: Configuration;
    /**
     * The GET parameters.
     */
    GET: { [key: string]: string };
    /**
     * The name of the request method.
     */
    method: string;
    /**
     * Gets the HTTP request context.
     */
    request: HTTP.IncomingMessage;
    /**
     * Gets the HTTP response context.
     */
    response: HTTP.ServerResponse;
    /**
     * The request time.
     */
    time: Moment.Moment;
    /**
     * The URL as object.
     */
    url: URL.Url;
    /**
     * The current user.
     */
    user?: User;
}

/**
 * Arguments for a method in a script module.
 */
export interface ScriptArguments {
    /**
     * Stores a permanent value for the current session.
     */
    state?: any;
}

/**
 * A script module.
 */
export interface ScriptModule {
}

/**
 * An user.
 */
export interface User {
    /**
     * Gets the underlying account.
     */
    readonly account: Account;
    /**
     * Gets the underlying request context.
     */
    readonly context: RequestContext;
    /**
     * Filters visible files.
     * 
     * @param {string|string[]} files The files to filter.
     * 
     * @returns {Promise<string[]>} The promise.
     */
    readonly filterVisibleFiles: (files: string | string[]) => Promise<string[]>;
    /**
     * Gets a variable of the user.
     * 
     * @param {string} name The name of the variable.
     * @param {T} [defaultValue] The default value.
     * 
     * @return {T} The value.
     */
    get<T>(name: string, defaultValue?: T): T;
    /**
     * Checks if a variable exists.
     * 
     * @param {string} name The name of the variable.
     * 
     * @returns {boolean} Exists or not.
     */
    readonly has: (name: string) => boolean;
    /**
     * Gets if user is a guest or not.
     */
    readonly isGuest: boolean;
    /**
     * Checks if a file is visible for that user.
     * 
     * @param {string} file The file to check.
     * 
     * @returns {Promise<boolean>} The promise.
     */
    readonly isFileVisible: (file: string) => Promise<boolean>;
    /**
     * Sets a variable for the user.
     * 
     * @param {string} name The name of the variable.
     * @param {T} value The value to set.
     * 
     * @chainable
     */
    set<T>(name: string, value: T): User;
    /**
     * Removes a variable.
     * 
     * @param {string} name The name of the variable.
     * 
     * @chainable
     */
    readonly unset: (name: string) => User;
}

/**
 * An user account.
 */
export interface UserAccount extends Account {
    /**
     * The name of the user.
     */
    name: string;
    /**
     * The password.
     */
    password: string;
}

/**
 * A function that validates a value.
 * 
 * @param {ValidatorArguments<T>} args The arguments.
 * 
 * @return {Promise<boolean>|boolean} The result.
 */
export type Validator<T> = (args: ValidatorArguments<T>) => Promise<boolean> | boolean;

/**
 * Arguments for a "validator" function.
 */
export interface ValidatorArguments<T> extends ScriptArguments {
    /**
     * Additional context data, defined by "caller".
     */
    context?: any;
    /**
     * The options for validation.
     */
    options?: any;
    /**
     * The value to check.
     */
    value: T;
}

/**
 * A validator module.
 */
export interface ValidatorModule<T> extends ScriptModule {
    /**
     * Validates a value.
     */
    validate?: Validator<T>;
}
