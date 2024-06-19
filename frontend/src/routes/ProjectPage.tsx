import { Box, Typography, Grid, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import PlaceHolder from "../assets/placeholderBanner.png";
import { useEffect, useState } from "react";
import { API_URL } from "../apis/config";
interface Project {
  MVP: string;
  approved: boolean;
  availableResouces: string;
  clientId: number;
  description: string;
  futureConsideration: boolean;
  numberOfTeams: number;
  preferedSkills: string;
  projectId: number;
  requiredEquipment: string;
  selected: boolean;
  title: string;
}
const emptyProject: Project = {
  MVP: "",
  approved: false,
  availableResouces: "",
  clientId: 0,
  description: "",
  futureConsideration: false,
  numberOfTeams: 0,
  preferedSkills: "",
  projectId: 0,
  requiredEquipment: "",
  selected: false,
  title: "",
};
interface Client {
  firstName: String;
  lastName: String;
  email: String;
}

function projectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project>(emptyProject);
  const [client, setClient] = useState<Client[]>([]);
  useEffect(() => {
    const fetchProjectAndClient = async () => {
      try {
        const projectResponse = await fetch(
          `${API_URL}/projects/${projectId}`,
          {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
          }
        );
        const projectData = await projectResponse.json();
        setProject(projectData);

        const clientResponse = await fetch(
          `${API_URL}/users/${projectData.clientId}`,
          {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
          }
        );
        const clientData = await clientResponse.json();
        setClient([clientData]);
      } catch (error) {
        console.error("Error fetching project or client data:", error);
      }
    };

    fetchProjectAndClient();
  }, [projectId]);
  return (
    <Grid
      sx={{
        display: "flex",
        maxWidth: "100%",
        maxHeight: "100%",
        marginLeft: "10%",
        marginRight: "10%",
        marginTop: "10vh",
        marginBottom: "10vh",
      }}
    >
      <Grid item xs={12} md={6}>
        <Box
          component="img"
          src={PlaceHolder}
          sx={{
            height: "10%",
            width: "100%",
          }}
        ></Box>
        <Typography
          variant="h4"
          sx={{
            marginTop: "3vh",
            display: "flex",
            flexDirection: "row",
            marginLeft: "30px",
            fontFamily: "Bahnschrift",
            fontWeight: 700,
          }}
        >
          {project.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            flexDirection: "row",
            marginLeft: "30px",
            marginTop: "5px",
            fontWeight: 700,
          }}
        >
          {client.map((e) => {
            return (
              <>
                <Typography textAlign={"left"} fontSize={14}>
                  Client's Name: {e.firstName + " " + e.lastName}
                </Typography>
              </>
            );
          })}
        </Typography>

        <Divider
          sx={{
            marginTop: "20px",
          }}
        ></Divider>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              marginLeft: "30px",
              marginTop: "30px",
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              Project Deliverable
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              marginLeft: "30px",
              marginTop: "30px",
            }}
          >
            <Typography
              variant="body1"
              textAlign="left"
              sx={{
                wordWrap: "break-word",
              }}
            >
              {project.MVP}
            </Typography>
          </Box>
          <Divider
            sx={{
              marginTop: "20px",
            }}
          ></Divider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "30px",
              marginTop: "30px",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ textAlign: "left" }}
            >
              Preferred Skils
            </Typography>

            <Typography sx={{ textAlign: "left" }}>
              {project.preferedSkills}
            </Typography>
          </Box>
          <Divider
            sx={{
              marginTop: "20px",
            }}
          ></Divider>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "30px",
              marginTop: "30px",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ textAlign: "left" }}
            >
              Available Resources
            </Typography>

            <Typography sx={{ textAlign: "left" }}>
              {project.availableResouces}
            </Typography>
          </Box>
          <Divider
            sx={{
              marginTop: "20px",
            }}
          ></Divider>

          <Box
            sx={{
              display: "flex",
              marginLeft: "30px",
              marginTop: "30px",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ textAlign: "left" }}
            >
              Project Description
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "30px",
              marginTop: "30px",
            }}
          >
            <Typography
              variant="body1"
              textAlign="left"
              sx={{
                wordWrap: "break-word",
              }}
            >
              {project.description}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default projectPage;
