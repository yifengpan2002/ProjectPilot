import { API_URL } from "./config";


export async function setProjectPreference(groupID: number, preferenceIDs: number[]) {
    const response = await fetch(`${API_URL}/project-preference`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupID: groupID,
        preferenceIDs: preferenceIDs
      }),
    });
    if (!response.ok) {
        response.text()
        .then(error => console.log(error))
        return;
    }
    return response.json();
}