import { API_URL } from "./config";

export async function getSemester() {
    const response = await fetch(`${API_URL}/semesters`);
    return response.json();
}