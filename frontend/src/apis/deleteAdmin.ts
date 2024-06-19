import { API_URL } from "./config";

export async function deleteAdmin(adminID: string) {
    const response = fetch(`${API_URL}/clients/${adminID}`,{
        method: "DELETE",
        headers: {
            "content-type": "application/json",
        },
    });
    return response;
}