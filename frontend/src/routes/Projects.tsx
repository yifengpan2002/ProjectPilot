import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  Pagination,
  Button,
  NativeSelect,
} from "@mui/material";
import "../css/project.css";
import ProjectCard from "../components/projects/ProjectCard";
import { Link } from "react-router-dom";
import { useFetchUserInfo } from "../hook/useFetchUserInfo";
import { useAuth } from "../hook/useAuth";
import { API_URL } from "../apis/config";
interface Semester {
  name: string;
  semesterId: number;
}

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

function Projects() {
  const isLoggedin = useAuth();
  const { userInfo } = useFetchUserInfo(isLoggedin);
  const page = "/projectsPage/";
  // const [tagList, setTagList] = useState<string[]>([]);
  const [cardViewState, setCardView] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPageNumber, setTotalPageNumber] = useState<number>(1);
  const [fullProjectList, setFullProjectList] = useState<Project[]>([]);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [semesterList, setSemesterList] = useState<Semester[]>([]);
  const [_, setCurrentSemesterDisplay] = useState<number>(0);

  const fetchSemesters = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/semesters`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setSemesterList(data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  }, []);

  const pageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(event);
    setPageNumber(value);
    if (cardViewState) {
      setProjectList(fullProjectList.slice((value - 1) * 4, value * 4));
      setTotalPageNumber(Math.ceil(fullProjectList.length / 4));
    } else {
      setProjectList(fullProjectList.slice((value - 1) * 20, value * 20));
      setTotalPageNumber(Math.ceil(fullProjectList.length / 20));
    }
  };
  async function cardViewChange() {
    setCardView(!cardViewState);
    const updatedCardViewState = !cardViewState;
    if (updatedCardViewState) {
      setProjectList(
        fullProjectList.slice((pageNumber - 1) * 4, pageNumber * 4)
      );
      setTotalPageNumber(Math.ceil(fullProjectList.length / 4));
    } else {
      setProjectList(
        fullProjectList.slice((pageNumber - 1) * 20, pageNumber * 20)
      );
      setTotalPageNumber(Math.ceil(fullProjectList.length / 20));
    }
  }

  const handleDisplaySemester = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const [semesterId] = event.target.value.split(" ");
      setCurrentSemesterDisplay(Number(semesterId));
      fetch(`${API_URL}/semesters/${semesterId}`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          const number = Math.ceil(data.projects.length / 20);
          setTotalPageNumber(number);
          setProjectList(data.projects.slice((number - 1) * 20, number * 20));
          setFullProjectList(data.projects);
        });
    },
    []
  );

  useEffect(() => {
    fetch(`${API_URL}/projects/published`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalPageNumber(Math.ceil(data.length / 20));
        setProjectList(data.slice((pageNumber - 1) * 20, pageNumber * 20));
        setFullProjectList(data);
        //if card view = true, we display 4 cards
      });

    if (cardViewState) {
      setProjectList(
        fullProjectList.slice((pageNumber - 1) * 4, pageNumber * 4)
      );
      setTotalPageNumber(Math.ceil(fullProjectList.length / 4));
    } else {
      setProjectList(
        fullProjectList.slice((pageNumber - 1) * 20, pageNumber * 20)
      );
    }
  }, [setCardView]);

  useEffect(() => {
    fetchSemesters();
  }, []);

  return (
    <>
      <Box
        sx={{
          maxWidth: "1400px",
          height: "89vh",
          display: { xs: "block", md: "flex", lg: "flex" },
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <Box
          className="display-section"
          sx={{
            width: { lg: "80vw", md: "70vw", xs: "100vw" },
            height: "100%",
            position: "relative",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              marginBottom: "30px",
              padding: "30px 30px 10px 30px",
              display: "block",
              textAlign: "left",
              borderBottom: 3,
            }}
          >
            Projects
            {userInfo?.userType === "admin" && (
              <NativeSelect
                inputProps={{
                  name: "project",
                  id: "uncontrolled-native",
                }}
                sx={{
                  variant: "filled",
                  justifyContent: "end",
                  alignContent: "end",
                  marginLeft: "50px",
                  overflowY: "scroll",
                }}
                onChange={handleDisplaySemester}
              >
                {semesterList.map((e: Semester) => (
                  <option
                    key={e.semesterId}
                    value={`${e.semesterId} ${e.name}`}
                  >
                    {e.name}
                  </option>
                ))}
              </NativeSelect>
            )}
          </Typography>
          <span className="toggle" onClick={cardViewChange}>
            Toggle
          </span>
          <Grid container spacing={2}>
            {projectList.map(function (e, i) {
              if (cardViewState === false) {
                return (
                  <Grid item xs={12} md={6}>
                    <Link to={page + e.projectId}>
                      <Button
                        key={i}
                        sx={{
                          // overflow: "hidden",
                          whiteSpace: "nowrap",
                          textWrap: "ellipses",
                          display: "block",
                          width: "100%",
                        }}
                      >
                        Project {i + 1} {e.title}
                      </Button>
                    </Link>
                  </Grid>
                );
              } else {
                return (
                  <Grid item xs={6}>
                    <ProjectCard title={e.title} id={i + 1} />
                  </Grid>
                );
              }
            })}
          </Grid>
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
              // position: "absolute",
              // top: "95%",
            }}
          >
            <Pagination
              count={totalPageNumber}
              color="secondary"
              onChange={pageChange}
            />
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default Projects;
