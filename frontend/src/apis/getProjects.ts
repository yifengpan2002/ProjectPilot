import { API_URL } from "./config";
import { Project } from "../models/Project";

export async function getProjects(): Promise<Project[] | null> {
    const response = await fetch(`${API_URL}/projects`);
    if (response.status == 404) {
        return null;
    }
    return response.json();
}