export interface SuccessResponse<T> {
    success: true;
    message: string;
    data: T | null;
}

export interface ErrorDetail {
    type: string;
    message: string;
    path: string;
    location: string;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: ErrorDetail[];
}

export const successResponse = <T>(
    message: string,
    data: T | null = null,
): SuccessResponse<T> => {
    return {
        success: true,
        message,
        data,
    };
};

export const errorResponse = (
    message: string,
    errors?: ErrorDetail[],
): ErrorResponse => {
    return {
        success: false,
        message,
        ...(errors && { errors }),
    };
};
