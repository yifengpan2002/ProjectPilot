import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  const backHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Page 404 error !!!</Typography>
        <Button onClick={backHome} variant="contained" sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}
