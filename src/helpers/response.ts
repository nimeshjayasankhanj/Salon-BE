export const response = (status: number, message: string, data: any = []): object => {
    return {
        status,
        message,
        data
    }
}