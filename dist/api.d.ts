export declare function setApiBase(url: string): void;
export declare function getApiBase(): string;
export declare class ApiError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
export declare function fetchApi(endpoint: string, name: string, extra?: Record<string, string>): Promise<unknown>;
export declare function fetchApiPost(endpoint: string, body: unknown): Promise<unknown>;
export declare function fetchApiRaw(endpoint: string, params?: Record<string, string>): Promise<unknown>;
export declare function validateName(input: string): string;
