import * as React from "react";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  styled,
  Container,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.tsx";
import { useAuth } from "../hook/useAuth.tsx";
import { useFetchUserInfo } from "../hook/useFetchUserInfo.tsx";
import textLogo from "../assets/Logotext.svg";
const pages = ["About", "Projects"];

const StyledAppBar = styled(Toolbar)({
  height: "8vh",
  padding: "2px 10%",
});

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const isLoggedin = useAuth();
  const { userInfo } = useFetchUserInfo(isLoggedin);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Sign Out Error", error);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "transparent", boxShadow: "none", overflow: "hidden" }}
    >
      <Container maxWidth="xl">
        <StyledAppBar>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleDrawerToggle}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={handleDrawerToggle}
                onKeyDown={handleDrawerToggle}
              >
                <List>
                  {pages.map((page) => (
                    <ListItem component={Link} to={`/${page}`} key={page}>
                      <ListItemText primary={page} />
                    </ListItem>
                  ))}
                  {userInfo?.userType === "admin" && (
                    <>
                      <ListItem component={Link} to="/matchForm">
                        <ListItemText primary="MATCH" />
                      </ListItem>
                      <ListItem component={Link} to="/Setup">
                        <ListItemText primary="Data Set Up" />
                      </ListItem>
                      <ListItem component={Link} to="/Client">
                        <ListItemText primary="Client" />
                      </ListItem>
                      <ListItem component={Link} to="/ProjectForm">
                        <ListItemText primary="ProjectForm" />
                      </ListItem>
                      <ListItem component={Link} to="/TeachingTeam">
                        <ListItemText primary="Teaching Team" />
                      </ListItem>
                    </>
                  )}
                  {userInfo?.userType === "client" && (
                    <>
                      <ListItem button component={Link} to="/Client">
                        <ListItemText primary="Client" />
                      </ListItem>
                      <ListItem button component={Link} to="/ProjectForm">
                        <ListItemText primary="ProjectForm" />
                      </ListItem>
                    </>
                  )}
                  {userInfo?.userType === "group" && (
                    <ListItem component={Link} to="/projectPreference">
                      <ListItemText primary="PREFERENCE" />
                    </ListItem>
                  )}
                  {isLoggedin && (
                    <ListItem onClick={handleLogout}>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  )}
                  {!isLoggedin && (
                    <>
                      <ListItem component={Link} to="/Login">
                        <ListItemText primary="Login" />
                      </ListItem>
                      <ListItem component={Link} to="/Register">
                        <ListItemText primary="Register" />
                      </ListItem>
                    </>
                  )}
                </List>
              </Box>
            </Drawer>
          </Box>
          <Link to="/">
            <Box
              padding="0 20px"
              component="img"
              src={textLogo}
              alt="projectPilotLogo"
              sx={{
                width: "200px",
                height: "auto",
                flexGrow: 1,
                display: { xs: "fixed", md: "flex" },
                position: "static",
              }}
            />
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                component={Link}
                to={`/${page.toLowerCase()}`}
                sx={{ ml: 3 }}
              >
                <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                  {page.toUpperCase()}
                </Typography>
              </Button>
            ))}
            {userInfo?.userType === "admin" && (
              <>
                <Button component={Link} to="/matchForm" sx={{ ml: 3 }}>
                  <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                    MATCH
                  </Typography>
                </Button>
                <Button component={Link} to="/Client" sx={{ ml: 3 }}>
                  <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                    Client
                  </Typography>
                </Button>
                <Button component={Link} to="/ProjectForm" sx={{ ml: 3 }}>
                  <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                    ProjectForm
                  </Typography>
                </Button>
                <Button component={Link} to="/Setup" sx={{ ml: 3 }}>
                  <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                    Data Set Up
                  </Typography>
                </Button>
                <Button component={Link} to="/TeachingTeam" sx={{ ml: 3 }}>
                  <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                    Teaching Team
                  </Typography>
                </Button>
              </>
            )}
            {userInfo?.userType === "client" && (
              <>
                <Button component={Link} to="/Client" sx={{ ml: 3 }}>
                  <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                    Client
                  </Typography>
                </Button>
                <Button component={Link} to="/ProjectForm" sx={{ ml: 3 }}>
                  <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                    ProjectForm
                  </Typography>
                </Button>
              </>
            )}
            {userInfo?.userType === "group" && (
              <Button component={Link} to="/projectPreference" sx={{ ml: 3 }}>
                <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                  PREFERENCE
                </Typography>
              </Button>
            )}
          </Box>
          {isLoggedin ? (
            <Button
              onClick={handleLogout}
              sx={{ xs: "none", md: "flex", mr: 2, border: 1 }}
            >
              <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                Logout
              </Typography>
            </Button>
          ) : (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: "10px" }}>
              <Button component={Link} to="/Login" sx={{ mr: 2, border: 1 }}>
                <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                  Login
                </Typography>
              </Button>
              <Button component={Link} to="/Register" sx={{ mr: 2, border: 1 }}>
                <Typography fontFamily={"Bahnschrift"} fontWeight={1000}>
                  Register
                </Typography>
              </Button>
            </Box>
          )}
        </StyledAppBar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
