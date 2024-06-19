import { API_URL } from "./config";

export async function deleteProject(projectId: number) {
    const response = fetch(`${API_URL}/students/${projectId}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
        },
    })
    return response
}