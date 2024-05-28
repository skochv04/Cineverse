export const handleServerError = async (response) => {
    if (!response.ok) {
        const errorDetails = await response.json();
        const userFriendlyMessage = errorDetails.error || 'An unexpected error occurred';
        throw new Error(userFriendlyMessage);
    }
    return response;
};
