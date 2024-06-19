import {
  Box,
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import automation from "../assets/Automation.png";
import efficiency from "../assets/Efficiency.png";
import satisfaction from "../assets/Satisfaction.png";

function About() {
  return (
    <Grid mt="10vh">
      <Typography
        mt="10vh"
        variant="h3"
        sx={{
          fontWeight: "400",
          paddingBottom: "5vh",
        }}
      >
        About Us
      </Typography>
      <Box
        sx={{
          paddingTop: "20px",
          paddingBottom: "20px",
          display: "flex",
          marginLeft: "10%",
          marginRight: "10%",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
          }}
        >
          projectPilot is an online platform to automate the process of Capstone
          collection and allocation for the course COMPSCI 399. The "if"
          Statements aimed at automating the process and increase the efficency
          in proposal of capstone projects, team formation , and project
          allocation through projectPilot. Previously, the process was
          excessively time-consuming, from continuous email exchanges between
          clients, students and the teaching team to the tedious data
          aggregation process for information. projectPilot aims to have the
          functionality to automate each step of the process.
        </Typography>
      </Box>

      <Grid
        sx={{
          marginTop: "5%",
          paddingTop: "20px",
          paddingBottom: "20px",
          display: "flex",
          marginLeft: "10%",
          marginRight: "10%",
          backgroundColor: "#f8f8f8",
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
            <Grid item xs={12} lg={4}>
              {" "}
              <Card
                sx={{
                  Height: 400,
                }}
              >
                <CardMedia
                  component="img"
                  image={automation}
                  alt="green iguana"
                  sx={{
                    height: "50%",
                    width: "70%",
                    margin: "auto",
                    marginTop: "12%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Automation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automation of the process from project collection to project
                    allocation.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card
                sx={{
                  minHeight: 400,
                }}
              >
                <CardMedia
                  component="img"
                  image={efficiency}
                  alt="green iguana"
                  sx={{
                    height: "50%",
                    width: "70%",
                    margin: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Efficiency
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Increased efficiency, allowing the teaching team to
                    prioritise on other tasks without the need to perform
                    mundane tasks due to the automation of the process
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card
                sx={{
                  minHeight: 400,
                }}
              >
                <CardMedia
                  component="img"
                  image={satisfaction}
                  alt="green iguana"
                  sx={{
                    height: "50%",
                    width: "70%",
                    marginTop: "12%",
                    marginLeft: "5%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Satisfaction
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aims for maximum student satisfaction from algorithm
                    assigning teams to their preferred projects chosen
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
}

export default About;
