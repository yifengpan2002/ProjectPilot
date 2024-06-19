import {
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import { Link } from "react-router-dom";
import Hero from "../components/home/herobannertest";
import PlaceHolder from "../assets/placeholderBanner.png";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
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

function Home() {
  const [fullProjectList, setFullProjectList] = useState<Project[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/projects`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setFullProjectList(data.slice(1, 9));
      });
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("uid", uid);
      } else {
        console.log("user is signed out");
      }
    });
  }, []);

  return (
    <Grid>
      <Hero />
      <Grid
        sx={{
          paddingTop: "20px",
          paddingBottom: "20px",
          display: "flex",
          maxWidth: "90%",
          backgroundColor: "#f8f8f8",
          marginLeft: "10%",
          marginRight: "10%",
          position: "relative",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexWrap: "wrap",
            boxSizing: "border-box",
            minWidth: "90%",
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              minWidth: "100%",

              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {fullProjectList.map((e) => {
              return (
                <Grid item xs={12} md={6} lg={3}>
                  <Link to={`/projectspage/${e.projectId}`}>
                    <Card>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="300"
                          image={PlaceHolder}
                          alt="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {e.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {e.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
}

export default Home;
