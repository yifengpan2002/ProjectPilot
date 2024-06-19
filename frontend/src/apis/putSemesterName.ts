import { API_URL } from "./config";

export async function putSemesterName(semesterId: number) {
    const response = fetch(`${API_URL}/semesters/select`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            semesterId
        ),
    });
    return response;
}