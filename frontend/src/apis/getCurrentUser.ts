import { API_URL } from "./config";

export async function getCurrentUser() {
    
    const response = await fetch(`${API_URL}/users/`)
    return response.json()
}