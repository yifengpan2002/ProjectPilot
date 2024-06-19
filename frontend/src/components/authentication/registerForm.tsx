import * as React from "react";
import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Paper,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";

import Logo from "../../assets/Logo.svg";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { API_URL } from "../../apis/config";

function registerForm() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("");
  const [availableHours, setAvailableHours] = useState(0);
  const [additionalInformation, setAdditionalInformation] = useState("");
  const [userType, setUserType] = useState("student");

  const [emailError] = useState("");
  const [passwordError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const semesterID = 1;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      type UserPayload = {
        email: string;
        password: string;
        username: string;
        firstName: string;
        lastName: string;
        semesterID?: number;
        teamName?: string;
        availableHours?: number;
        additionalInformation?: string;
      };

      let apiUrl = "";
      const userPayload: UserPayload = {
        email,
        password,
        username: email,
        firstName,
        lastName,
        semesterID,
        teamName,
        availableHours,
        additionalInformation,
      };

      switch (userType) {
        case "admin":
          apiUrl = `${API_URL}/admins`;
          delete userPayload.teamName;
          delete userPayload.additionalInformation;
          break;
        case "student":
          apiUrl = `${API_URL}/students`;
          delete userPayload.availableHours;
          delete userPayload.additionalInformation;
          break;
        case "client":
          apiUrl = `${API_URL}/clients`;
          delete userPayload.teamName;
          delete userPayload.availableHours;
          break;
        default:
          throw new Error("Invalid user type");
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Failed to register user in local database");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <Grid
      component={Paper}
      elevation={10}
      sx={{
        width: { xs: "100%", md: "50%" },

        marginTop: "7%",
        marginLeft: { md: "25%" },
        marginRight: "25%",
      }}
    >
      <Box
        sx={{
          marginTop: "5%",
        }}
      >
        <Box component="img" src={Logo} sx={{ width: 200 }}></Box>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            sx={{ minWidth: "50vh", marginTop: 2, marginBottom: 2 }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="client">Client</MenuItem>
          </Select>

          <TextField
            required
            id="firstName"
            type="String"
            label="First Name"
            margin="dense"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ minWidth: "50vh" }}
          ></TextField>

          <TextField
            required
            id="lastName"
            label="Last Name"
            type="String"
            margin="dense"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ minWidth: "50vh" }}
          ></TextField>

          {userType === "student" && (
            <TextField
              required
              id="teamName"
              label="Team Name"
              type="String"
              margin="dense"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              sx={{ minWidth: "50vh" }}
            ></TextField>
          )}

          {userType === "admin" && (
            <TextField
              id="availableHours"
              label="Available Hours"
              type="Number"
              margin="dense"
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
              sx={{ minWidth: "50vh" }}
            ></TextField>
          )}

          {userType === "client" && (
            <TextField
              id="additonalInformation"
              label="Additonal Information"
              type="String"
              margin="dense"
              value={additionalInformation}
              onChange={(e) => setAdditionalInformation(e.target.value)}
              sx={{ minWidth: "50vh" }}
            ></TextField>
          )}

          <TextField
            required
            id="email"
            label="Email Address"
            type="String"
            margin="dense"
            onChange={(e) => setEmail(e.target.value)}
            helperText={emailError}
            error={!!emailError}
            sx={{ minWidth: "50vh" }}
          ></TextField>

          <TextField
            required
            id="password"
            label="Password"
            type="Password"
            margin="dense"
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            sx={{ minWidth: "50vh" }}
          ></TextField>

          <Button
            variant="contained"
            type="submit"
            sx={{
              mb: 3,
              mt: 3,
              borderRadius: "20px",
              ":hover": {},
            }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}

export default registerForm;
