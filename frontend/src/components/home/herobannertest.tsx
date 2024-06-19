import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  Container,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import Banner from "../../assets/HeroBanner.png";

const HeroBanner = () => {
  const isSmallScreen = useMediaQuery('(max-width: 800px)');

  return (
    <Grid container spacing={2}>
       <Grid item xs={12}>
        <Box
          sx={{
            width: "100%",
            height: "100vh",
            backgroundColor: "rgb(6, 118, 255)",
            overflow: "hidden",

            transform: "translateY(+0%)",
            

          }}
        >
          <Box
            component="img"
            src={Banner}
            alt="Banner Image"
            sx={{
              width: isSmallScreen ? "100%" : "35%",
   
              display: "flex",
              position: "absolute",
              transform: "translateY(-60%)",
              left: isSmallScreen ? "0%": "20%",
              top:  isSmallScreen ? "50vh" : "50vh",
              zIndex: 2,
            }}
          />
          {!isSmallScreen && (
            <Box
              sx={{
                width: "40%",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: "5%",
                zIndex: 2,
                color: "white",
                textAlign: "left",
              }}
            >
              <Typography variant="h2" sx={{ fontSize: "40px", fontWeight: "bold" }}>
                Where <Box component="span" fontWeight={700}>Capstones </Box>
                Come <br />to Life
              </Typography>
              <Typography sx={{ mt: 2, lineHeight: "25px" }}>
                Get started with a step further into your future with projectPilot
                by choosing your project.
              </Typography>
              <Button
                component={Link} to="/Projects"
                variant="contained"
                sx={{
                  mt: 3,
                  borderRadius: "20px",
                  backgroundColor: "#0D47A1",
                  ":hover": { color: "white" },
                }}
              >
                View Projects
              </Button>
            </Box>
          )}
        </Box>
      </Grid>

      {isSmallScreen && (
        <Container>
          <Box
            sx={{
              marginTop: "10px",
              textAlign: "center",
              position: "relative",
            }}
          >
          
            <Box
              sx={{
                position: "absolute",
                bottom: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 2,
                color: "white",
              }}
            >
              <Button
                component={Link} to="/Projects"
                variant="contained"
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "#0D47A1",
                  ":hover": { color: "white" },
                  marginBottom: "20vh"
                }}
              >
                View Projects
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </Grid>
  );
};

export default HeroBanner;
