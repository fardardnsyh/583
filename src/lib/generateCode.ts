import { randomInt } from "crypto";

export const generateCode = () => {
    return randomInt(100000, 1000000).toString();
}