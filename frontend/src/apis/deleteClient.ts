import { API_URL } from "./config";

export async function deleteClient(clientId: number ) {
    const response = fetch(`${API_URL}/clients/${clientId}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",

        },
    });
    return response;
}