export const En_To_Fa = (enNumber: number | string): string => {
    const enToFa: { [key: string]: string } = {
        "0": "۰",
        "1": "۱",
        "2": "۲",
        "3": "۳",
        "4": "۴",
        "5": "۵",
        "6": "۶",
        "7": "۷",
        "8": "۸",
        "9": "۹",
    };

    const enNumberStr = enNumber.toString();

    const faNumber = enNumberStr
        .split("")
        .map((digit) => enToFa[digit] || digit)
        .join("");

    return faNumber;
};
