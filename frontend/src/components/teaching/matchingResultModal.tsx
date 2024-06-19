import { Box, Button, Typography, Modal } from "@mui/material";

interface result {
  cost: number;
  time: string;
  result: string[][];
  open: boolean;
  handleClose: Function;
  satisfaction: { [key: string]: string };
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ResultModal(props: result) {
  const handleClose = () => {
    props.handleClose(false);
  };

  const confirm = () => {
    props.handleClose(false);
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{ ...style, height: "80vh", padding: "5vh", overflow: "scroll" }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            Matching Algorithm Result
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, textAlign: "center" }}
          >
            Cost: {props.cost}, Running Time: {props.time}
          </Typography>
          <Box id="modal-modal-description" sx={{ mt: 2 }}>
            {props.result.map((pair, index) => {
              const teamId = pair[0];
              const projectId = pair[1];
              const satisfaction = props.satisfaction[teamId];
              return (
                <Typography
                  key={index + 1}
                  sx={{
                    textAlign: "left",
                    paddingBottom: "3px",
                    borderBottom: 1,
                  }}
                >
                  Result {index}: Team: {teamId} matched with Project:{" "}
                  {projectId}, Satisfaction: {satisfaction}
                </Typography>
              );
            })}
          </Box>
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
