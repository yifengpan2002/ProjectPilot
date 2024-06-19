import { Card, Box, CardContent, CardMedia, Typography } from "@mui/material";
import Logo from "../../assets/Logo.svg";

interface projectType {
  title: string;
  image: string;
  category: string;
  projectID: number;
  description: string;
}

const projectCard = ({}: projectType) => {
  return (
    <Box mt="10vh">
      <Card
        sx={{
          minWidth: 500,
          maxWidth: 800,
        }}
      >
        <CardMedia
          component="img"
          alt="projectImage"
          src={Logo}
          sx={{ boxShadow: "inherit", maxHeight: 200 }}
        />
        <CardContent
          sx={{
            padding: "25px 25px 25px 25px",
          }}
        >
          <Box display="grid">
            <Typography variant="body2" sx={{ fontSize: "20px" }}>
              Title
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              Logo
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default projectCard;
