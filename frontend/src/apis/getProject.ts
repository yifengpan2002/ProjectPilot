import { API_URL } from "./config";
import { Project } from "../models/Project";

export async function getProject(projectId: number): Promise<Project | undefined>{
    const response = await fetch(`${API_URL}/projects/${projectId}`);
    if (!response.ok) {
        response.text().then(error => console.log(error));
        return;
    } else {
        return response.json();
    }
}