export type clientUser = {
    clientId: number,
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    projects: { projectId: number, projectName: string}
    groups: {groupId: number;}
    additionalInformation: string;
}