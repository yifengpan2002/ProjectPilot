import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { createSvgIcon } from "@mui/material/utils";
import "../css/client.css";
import { API_URL } from "../apis/config";

const PlusIcon = createSvgIcon(
  <svg
    xmlns="https://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>,
  "Plus"
);

function Client() {
  const [project, setProject] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/projects`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setProject(data.title.slice(0, 2));
        console.log(project);
      });
  }, []);

  return (
    <Box
      id="client-page"
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: "lightblue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          width: "1000px",
          height: "100%",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            paddingTop: "70px",
            textAlign: "left",
            paddingBottom: "10px",
            paddingLeft: { xs: "30px" },
            marginBottom: 5,
          }}
        >
          My Projects
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              marginLeft: { lg: "30px", md: "30px", xs: "30px" },
              border: 1,
              bgcolor: "white",
            }}
          >
            <Link to="/projectform">
              <PlusIcon
                id="plus-icon"
                sx={{
                  color: "black",
                  width: "300px",
                  height: "300px",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              />
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Client;
