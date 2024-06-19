import { Project } from "./Project";
import {clientUser} from "./clientUser"

export type createProject = {
    clientID?: clientUser['clientId'];
    title?: Project['title'];
    description?: Project['description'];
    MVP?: Project["MVP"];
    preferredSkills?: Project["preferedSkills"];
    requiredEquipment?: Project["requiredEquipment"];
    noofTeams?: Project["numberofTeams"];
    availableResource?: Project["availableResources"];
    futureConsideration?: Project["futureConsideration"]
    additionalInformation?: Project["additionalInformation"];

    


}