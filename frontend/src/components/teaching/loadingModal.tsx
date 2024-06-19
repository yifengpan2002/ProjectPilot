import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import { useState, useEffect } from "react";

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

interface LoadingProps {
  setTime: Function;
  open: boolean;
  handleClose: Function;
}

export default function LoadingModal(props: LoadingProps) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");

  useEffect(() => {
    if (props.open) {
      setStartTime(new Date());
    } else {
      setStartTime(null);
    }
  }, [props.open]);

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      const currentTime = new Date();
      const elapsedTimeInSeconds =
        (currentTime.getTime() - startTime.getTime()) / 1000;
      const minutes = Math.floor(elapsedTimeInSeconds / 60);
      const seconds = Math.floor(elapsedTimeInSeconds % 60);
      setElapsedTime(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      props.setTime((`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const close = () => {
    setTimeout(() => {
      props.handleClose();
    }, 100);
  };

  return (
    <Modal
      open={props.open}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
        <Typography>This matching process is going to take 3-5 mins</Typography>
        <Typography>
          You have been running this algorithm for {elapsedTime}
        </Typography>
      </Box>
    </Modal>
  );
}
