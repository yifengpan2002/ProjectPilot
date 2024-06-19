import {
  Typography,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingModal from "./loadingModal";
import ResultModal from "./matchingResultModal";
import { API_URL } from "../../apis/config";
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
  published: boolean;
  isChecked: boolean;
}

interface Team {
  email: string;
  firstName: string;
  groupId: number;
  lastName: string;
  projectId: number;
  projectPreferences: number[];
  semester: number;
  teamName: string;
  username: string;
  isChecked: boolean;
}

function MatchForm() {
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [project, setProjectList] = useState<Project[]>([]);
  const [checked, setChecked] = useState<boolean>(true);
  const [projectCheck, setProjectChecked] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);
  const [cost, setCost] = useState<number>(0);
  const [matchingPair, setMatchingPair] = useState<string[][]>([]);
  const [matchingPairSatisfaction, setMatchingPairSatisfaction] = useState<{
    [key: string]: string;
  }>({});
  const [time, setTime] = useState<string>("");
  const navigate = useNavigate();
  const Error = () => {
    navigate("/Error404");
  };

  useEffect(() => {
    fetch(`${API_URL}/projects`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setProjectList(
          data.map((project: Project) => ({
            ...project,
            isChecked: true,
          }))
        );
      });

    fetch(`${API_URL}/students`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setTeamList(
          data.map((team: Team) => ({
            ...team,
            isChecked: true,
          }))
        );
      });
  }, []);

  const handleAllTeamCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChecked(event.target.checked);
    const updatedTeamList = teamList.map((team) => ({
      ...team,
      isChecked: event.target.checked,
    }));
    setTeamList(updatedTeamList);
  };

  const handleTeamCheckboxChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedTeamList = [...teamList];
      updatedTeamList[index].isChecked = event.target.checked;
      setTeamList(updatedTeamList);
    };

  const handleAllProjectCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProjectChecked(event.target.checked);
    const updatedProjectList = project.map((project) => ({
      ...project,
      isChecked: event.target.checked,
    }));
    setProjectList(updatedProjectList);
  };

  const handleProjectCheckboxChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedProjectList = [...project];
      updatedProjectList[index].isChecked = event.target.checked;
      setProjectList(updatedProjectList);
    };

  const triggerAlgo = () => {
    setModalOpen(true);

    // Get checked teams and projects
    const checkTeamList = teamList
      .filter((team) => team.isChecked)
      .map((team) => team.groupId);
    const checkProjectList = project
      .filter((proj) => proj.isChecked)
      .map((proj) => proj.projectId);

    const timeInput = document.getElementById(
      "availableHours"
    ) as HTMLInputElement;
    console.log(checkProjectList);
    const data = {
      projectList: checkProjectList,
      teamList: checkTeamList,
      availableTime: timeInput.value ? parseInt(timeInput.value) : 0,
    };

    console.log(JSON.stringify(data));
    try {
      fetch(`${API_URL}/matchAllTeams`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            Error();
          }
          return response.json();
        })
        .then((data) => {
          setModalOpen(false);
          console.log(data);
          setTimeout(() => {
            setResultModalOpen(true);
          }, 100);
          setMatchingPair(data.groupProjectPairs);
          console.log(data.teamSatisfactionDict, "form");
          setMatchingPairSatisfaction(data.teamSatisfactionsDict);
          setCost(data.trueCost);
        })
        .catch((error) => {
          console.error("Fetch error: ", error);
          Error();
        });
    } catch (error) {
      console.error("Unexpected error: ", error);
      Error();
    }
  };

  return (
    <Grid
      id="matchformBox"
      marginTop="15vh"
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        maxWidth: "100%",
        marginLeft: "20%",
        marginRight: "20%",
        marginBottom: "5%",
        marginTop: "10vh",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
        }}
      >
        Project Match
      </Typography>
      <Typography variant="body1" marginTop="2vh">
        Project Match form for Team allocation. Select which Teams, Projects and
        the number of hours wanted for the algorithm to process and assign teams
        to their allocated projects. Option to deselect groups and projects if
        required.
      </Typography>

      <Typography
        variant="h5"
        sx={{
          textAlign: "left",
          marginTop: "10vh",
          position: "relative",
        }}
      >
        Groups
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleAllTeamCheckboxChange}
                />
              }
              label="All"
            />
          </MenuItem>
        </Grid>
      </Typography>
      <Divider
        sx={{
          marginTop: "20px",
        }}
      />
      <Grid
        container
        spacing={2}
        sx={{
          marginTop: "2%",
          justifyContent: "center",
          alignItems: "center",
          minWidth: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {teamList.map((e, i) => {
          return (
            <Grid item xs={12} md={6} lg={3} id="GroupSection">
              <MenuItem>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={e.isChecked}
                      onChange={handleTeamCheckboxChange(i)}
                    />
                  }
                  label={`Team ${e.groupId}: ${e.teamName}`}
                  sx={{ whiteSpace: "wrap" }}
                />
              </MenuItem>
            </Grid>
          );
        })}
      </Grid>

      <Typography
        variant="h5"
        sx={{
          marginTop: "5%",
          textAlign: "left",
          position: "relative",
        }}
      >
        Projects
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={projectCheck}
                  onChange={handleAllProjectCheckboxChange}
                />
              }
              label="All"
            />
          </MenuItem>
        </Grid>
      </Typography>
      <Divider
        sx={{
          marginTop: "20px",
        }}
      />
      <Grid
        container
        spacing={2}
        sx={{
          marginTop: "2%",
          justifyContent: "center",
          alignItems: "center",
          minWidth: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {project.map((e, i) => {
          return (
            <Grid item xs={12} md={6} lg={3} id="GroupSection">
              <MenuItem>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={e.isChecked}
                      onChange={handleProjectCheckboxChange(i)}
                    />
                  }
                  label={`Project ${e.projectId}: ${e.title}`}
                  sx={{ whiteSpace: "wrap" }}
                />
              </MenuItem>
            </Grid>
          );
        })}
      </Grid>
      <Typography
        variant="h5"
        sx={{
          marginTop: "5%",
          textAlign: "left",
        }}
      >
        Number of Hours
      </Typography>
      <Divider
        sx={{
          marginTop: "20px",
        }}
      />
      <Grid
        container
        spacing={2}
        sx={{
          marginTop: "2%",
          justifyContent: "center",
          alignItems: "center",
          minWidth: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Grid item xs={12} md={6} lg={3} id="NoOfHours">
          {" "}
          <Typography
            textAlign="right"
            sx={{
              variant: "body1",
              display: "flex",
              flexDirection: "row",
            }}
          >
            {" "}
            Enter Number of Hours:
            <TextField
              label="No. of Hours"
              variant="standard"
              id="availableHours"
              sx={{
                marginLeft: "10%",
              }}
            ></TextField>
          </Typography>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        lg={3}
        sx={{
          marginTop: "10%",
        }}
      >
        <Button variant="contained" onClick={triggerAlgo}>
          Run
        </Button>
      </Grid>
      <LoadingModal
        setTime={setTime}
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
      />
      <ResultModal
        open={resultModalOpen}
        handleClose={() => setResultModalOpen(false)}
        cost={cost}
        time={time}
        result={matchingPair}
        satisfaction={matchingPairSatisfaction}
      />
    </Grid>
  );
}

export default MatchForm;
