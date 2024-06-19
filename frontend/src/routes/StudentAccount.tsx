import { useState } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../apis/config";
import { useFetchUserInfo } from "../hook/useFetchUserInfo";
import { useAuth } from "../hook/useAuth";

export default function StudentAccount() {
  const navigate = useNavigate();
  const [newName, setNewName] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const isLoggedin = useAuth();
  const { userInfo } = useFetchUserInfo(isLoggedin);
  console.log(userInfo?.groupId);
  console.log(userInfo?.projectPreferences, "projects");

  const handleNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPassword(event.target.value);
  };

  const updatePassword = () => {
    fetch(`${API_URL}/updateUser`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userInfo?.groupId,
        field: "password",
        newInput: newPassword,
      }),
    }).then(() => window.location.reload());
  };
  const updateTeamName = () => {
    fetch(`${API_URL}/updateUser`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userInfo?.groupId,
        field: "teamName",
        newInput: newName,
      }),
    }).then(() => window.location.reload());
  };

  const handlePreferenceClick = () => {
    navigate("/projectPreference");
  };

  return (
    <Box sx={{ maxWidth: "900px", margin: "0 auto", padding: "50px" }}>
      <Typography variant="h4" sx={{ textAlign: "left" }}>
        Hi Team {userInfo?.teamName}
      </Typography>
      <Typography sx={{ marginTop: "30px" }}>
        Your Selected List: {userInfo?.projectPreferences}
      </Typography>

      <Button
        variant="contained"
        sx={{ marginTop: "30px", width: "fit-content" }}
        onClick={handlePreferenceClick}
      >
        Submit Your Preference
      </Button>

      <Typography
        variant="h5"
        sx={{ marginTop: "30px", textAlign: "left", borderBottom: 2 }}
      >
        Account Setting
      </Typography>

      <Box
        sx={{
          textAlign: "left",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextField
          variant="standard"
          label="New Team Name"
          sx={{ textAlign: "left" }}
          onChange={handleNewNameChange}
        />
        <Button
          variant="contained"
          sx={{ marginTop: "16px", width: "fit-content" }}
          onClick={updateTeamName}
        >
          Submit
        </Button>
      </Box>
      <Box
        sx={{
          textAlign: "left",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextField
          variant="standard"
          label="New password"
          sx={{ textAlign: "left" }}
          onChange={handleNewPasswordChange}
        />
        <Button
          variant="contained"
          sx={{ marginTop: "16px", width: "fit-content" }}
          onClick={updatePassword}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
