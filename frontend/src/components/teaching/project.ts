export interface Project {
    MVP: string,
    approved: boolean,
    availableResouces: string,
    clientId: number,
    description: string,
    futureConsideration: boolean,
    numberOfTeams: number,
    preferedSkills: string,
    projectId: number,
    requiredEquipment: string,
    selected: boolean,
    title: string,
    published: boolean,
    additionalInformation: addtionalClient[]
}


interface addtionalClient {
    name: string;
    email: string;
}
