import React from "react";
import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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

interface confirmModal {
  title: string;
  description: string;
  propFunction: Function;
  setModalState: Function;
}

export default function confirmModal(props: confirmModal) {
  const [open, setOpen] = React.useState(true);
  setModalState: Function;
  const handleClose = () => {
    setOpen(false);
    props.setModalState(false);
  };
  const confirm = () => {
    props.propFunction();
    props.setModalState(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            {props.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {props.description}
          </Typography>
          <Box sx={{ mt: "20px", display: "flex", justifyContent: "center" }}>
            <Button variant="contained" onClick={confirm}>
              Confirmed
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
