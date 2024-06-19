import { API_URL } from "./config";

export async function getSelectedSemester(){
    const response = await fetch(`${API_URL}/semesters/selected`)
    return response.json();
}