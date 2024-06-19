import { Box, Button, Typography, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../apis/config";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
interface inputProp {
  open: boolean;
  handleClose: Function;
}

function AdminInput(props: inputProp) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const semesterID = 1;
    try {
      await axios.post(`${API_URL}/registeradmin`, {
        email,
        password,
      });

      await axios.post("${API_URL}/admins", {
        email,
        password,
        username: email,
        firstName,
        lastName,
        semesterID,
      });

      console.log("user");
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
        console.log("Axios error creating user", error);
      } else {
        setError("Error Occured");
        console.error("Error User", error);
      }
    }
  };
  const confirm = () => {
    props.handleClose(false);
  };

  return (
    <Modal
      open={props.open}
      onClose={confirm}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} component="form" noValidate onSubmit={handleSubmit}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ textAlign: "center" }}
        >
          Register Another Admin
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Email
        </Typography>
        <TextField
          variant="standard"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Password
        </Typography>
        <TextField
          variant="standard"
          type="Password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          First Name
        </Typography>
        <TextField
          variant="standard"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
        />
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Last Name
        </Typography>
        <TextField
          variant="standard"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
        />
        <Box sx={{ mt: "20px", display: "flex", justifyContent: "center" }}>
          <Button variant="contained" type="submit">
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default function AddAdmin() {
  const [inputModal, setInputModal] = useState(false);

  const handleOpen = () => setInputModal(true);

  return (
    <Box>
      <Button variant="outlined" onClick={handleOpen}>
        Add another admin
      </Button>
      <AdminInput open={inputModal} handleClose={setInputModal} />
    </Box>
  );
}
