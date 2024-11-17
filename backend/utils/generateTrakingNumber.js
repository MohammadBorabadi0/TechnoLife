// Generate a random 5-digit tracking number
export const generateTrackingNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
};
