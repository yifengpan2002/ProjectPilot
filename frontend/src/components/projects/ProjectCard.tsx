import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  title: string;
  id: number;
}

function ProjectCard(prop: ProjectCardProps) {
  const page = "/projectsPage/";
  return (
    <Card
      sx={{
        minWidth: 500,
        maxWidth: 800,
      }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Project {prop.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {prop.title}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Link to={page + prop.id}>
          <Button size="small">Learn More</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
export default ProjectCard;
