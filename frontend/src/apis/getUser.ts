import { API_URL } from "./config";

export async function getStudent(groupId: number) {
    const response = await fetch(`${API_URL}/users/${groupId}`);
    if (!response.ok) {
        response.text()
        .then(error => console.log(error))
        return;
    }
    return response.json();
}

export async function getAdmin(adminId: number) {
    const response = await fetch(`${API_URL}/users/${adminId}`);
    if (!response.ok) {
        response.text()
        .then(error => console.log(error))
        return;
    }
    return response.json();
}


export async function getClient(clientId: number) {
    const response = await fetch(`${API_URL}/users/${clientId}`);
    if (!response.ok) {
        response.text()
        .then(error => console.log(error))
        return;
    }
    return response.json();
}