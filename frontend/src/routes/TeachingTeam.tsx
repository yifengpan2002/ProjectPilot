import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import "../css/teachingTeam.css";
import App from "../components/teaching/app";
import ProjectForm from "../components/teaching/projectDisplay";
import { Project } from "../components/teaching/project";
import { API_URL } from "../apis/config";

function TeachingTeam() {
  const [_, setProjectId] = useState<number>(1);
  const [project, setProject] = useState<Project[]>([
    {
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
      published: false,
      additionalInformation: [],
    },
  ]);
  const [rejectList, setRejectList] = useState<Project[]>([]);
  const [approvedList, setApprovedList] = useState<Project[]>([]);
  const [pendingList, setPendingList] = useState<Project[]>([]);
  const [currentForm, setCurrentForm] = useState<boolean>(false);

  const fetchProjects = () => {
    fetch(`${API_URL}/projects/approved`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setApprovedList(data);
      });

    fetch(`${API_URL}/projects/pending`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setPendingList(data);
      });

    fetch(`${API_URL}/projects/rejected`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setRejectList(data);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectChange = (projectId: number) => {
    setProjectId(projectId);
    setCurrentForm(!currentForm);
    fetch(`${API_URL}/projects/${projectId}`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setProject([data]);
      });
  };

  const formButton = async (
    project: Project,
    state: String,
    formData: object
  ) => {
    console.log(formData);
    switch (state) {
      case "approved":
        setPendingList((prevList) =>
          prevList.filter((item) => item.projectId !== project.projectId)
        );
        setRejectList((prevList) =>
          prevList.filter((item) => item.projectId !== project.projectId)
        );
        if (
          !approvedList.some((item) => item.projectId === project.projectId)
        ) {
          setApprovedList((prevList) => [...prevList, project]);
          try {
            const response = await fetch(`${API_URL}/projects/status`, {
              method: "PUT",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: project.projectId,
                status: "approved",
              }),
            });
            if (!response.ok) {
              throw new Error("Failed to update project status to the server");
            }
          } catch (error) {
            console.error("Error updating project status:", error);
          }
        }
        break;
      case "pending":
        setApprovedList((prevList) =>
          prevList.filter((item) => item.projectId !== project.projectId)
        );
        setRejectList((prevList) =>
          prevList.filter((item) => item.projectId !== project.projectId)
        );
        if (!pendingList.some((item) => item.projectId === project.projectId)) {
          setPendingList((prevList) => [...prevList, project]);
          try {
            const response = await fetch(`${API_URL}/projects/status`, {
              method: "PUT",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: project.projectId,
                status: "pending",
              }),
            });
            if (!response.ok) {
              throw new Error("Failed to update project status to the server");
            }
          } catch (error) {
            console.error("Error updating project status:", error);
          }
        }
        break;
      case "reject":
        setApprovedList((prevList) =>
          prevList.filter((item) => item.projectId !== project.projectId)
        );
        setPendingList((prevList) =>
          prevList.filter((item) => item.projectId !== project.projectId)
        );
        if (!rejectList.some((item) => item.projectId === project.projectId)) {
          setRejectList((prevList) => [...prevList, project]);
          const response = await fetch(`${API_URL}/projects/status`, {
            method: "PUT",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: project.projectId,
              status: "rejected",
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to update project status to the server");
          }
        }
        break;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        height: "89vh",
        bgcolor: "white",
        display: { xs: "block", md: "flex", lg: "flex" },
        alignItems: "center",
        justifyContent: "left",
        margin: "0 auto",
      }}
    >
      {/* this is drag and drop function */}
      <App
        projectId={project[0]}
        onChangeProject={handleProjectChange}
        rejectList={rejectList}
        setRejectList={setRejectList}
        approvedList={approvedList}
        setApprovedList={setApprovedList}
        pendingList={pendingList}
        setPendingList={setPendingList}
        refreshProjects={fetchProjects}
      />
      <Box
        id="form-section"
        sx={{
          bgcolor: "",
          width: "100%",
          height: "100%",
          overflow: "scroll",
          padding: "50px",
          boxSizing: "border-box",
        }}
      >
        <ProjectForm
          project={project[0]}
          state={currentForm}
          formButton={formButton}
        />
      </Box>
    </Box>
  );
}

export default TeachingTeam;
