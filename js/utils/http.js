const BASE_URL = "https://jsonplaceholder.typicode.com/todos";

export const GET = async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    try {
        if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            throw new Error("Response failed!");
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}