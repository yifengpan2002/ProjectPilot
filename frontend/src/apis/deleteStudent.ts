import { API_URL } from "./config";

export async function deleteStudent(groupId: string) {
    const response = fetch(`${API_URL}/students/${groupId}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
        },
    })
    return response
}