import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Slider,
  List,
  ListItem,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@material-ui/icons/Close";
import { FormControl, Radio, RadioGroup } from "@mui/joy";
import "../css/projectForm.css";
import Header from "../components/client/Header";
import { API_URL } from "../apis/config";
interface addtionalClient {
  name: string;
  email: string;
}

const marks = [
  {
    value: 10,
    label: "Any",
  },
];

function ProjectForm() {
  const clientRef = useRef(null);
  const [client, setClient] = useState([{}]);
  const [consideration, setConsideration] = React.useState("No");
  const [specialRequirement, setSpecialRequirement] = React.useState("No");
  const [slider, setSlider] = React.useState(1);
  const [sliderState, setSliderState] = React.useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const Error = () => {
    navigate("/Error404");
  };
  const handleConsideration = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConsideration((event.target as HTMLInputElement).value);
  };
  const handleSpecialRequirement = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSpecialRequirement((event.target as HTMLInputElement).value);
  };
  const handleSlider = (_: Event, newValue: number | number[]) => {
    setSlider(newValue as number);
    if (newValue == 10) {
      setSliderState(false);
    } else {
      setSliderState(true);
    }
  };

  function addClient() {
    setClient((arr) => [...arr, {}]);
  }
  function deleteClient(i: number) {
    if (i !== 0) {
      setClient((arr) => arr.filter((_, index) => index !== i));
    }
  }
  const style = {
    p: 0,
    width: "100%",
    marginBottom: 2,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    position: "relative",
  };
  const formSubmit = async () => {
    const clientList = document.querySelectorAll(
      ".clientName input"
    ) as NodeListOf<HTMLInputElement>;
    const clientEmailList = document.querySelectorAll(
      ".clientEmail input"
    ) as NodeListOf<HTMLInputElement>;
    //I need to iterate those list and make an object with name:, email:
    const additionalInfo = [] as addtionalClient[];
    clientList.forEach((e, i) => {
      additionalInfo.push({ name: e.value, email: clientEmailList[i].value });
    });
    const title = document.getElementById("projectTitle") as HTMLInputElement;
    const description = document.getElementById(
      "description"
    ) as HTMLInputElement;
    const MVP = document.getElementById("desireOutput") as HTMLInputElement;
    const preferredSkills = document.getElementById(
      "desireSkill"
    ) as HTMLInputElement;
    const availableResources = document.getElementById(
      "availableResources"
    ) as HTMLInputElement;
    const equipment = document.getElementById(
      "specialRequirement-input"
    ) as HTMLInputElement;
    /*
    3 inputs we need to have conditional check. 

    1.SpecialRequirment
    2.futureConsideration
    3.Number of team
  */
    if (!title.value.trim() || !description.value.trim() || !MVP.value.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    let futureConsideration: boolean;
    let equipmentName: String;
    let finalNumberOfTeam: number;
    if (specialRequirement === "No") {
      equipmentName = "No";
    } else {
      // if others, we got to take the input from the input field that user has entered
      equipmentName = equipment.value;
    }
    if (consideration === "No") {
      futureConsideration = false;
    } else {
      futureConsideration = true;
    }
    if (slider === 10) {
      //we are geting the value that user has inputed
      const otherNumber = document.getElementById(
        "other-number"
      ) as HTMLInputElement;
      finalNumberOfTeam = parseInt(otherNumber.value);
    } else {
      finalNumberOfTeam = slider;
    }
    const data = {
      clientID: 80, //this need to be change
      title: title.value,
      description: description.value,
      MVP: MVP.value,
      preferredSkills: preferredSkills.value,
      requiredEquipment: equipmentName,
      noOfTeams: finalNumberOfTeam,
      availableResources: availableResources.value,
      futureConsideration: futureConsideration,
      additionalInformation: additionalInfo,
    };

    console.log("submit", data);
    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // If response is not 200, throw an error
      Error();
    } else {
      alert("successfully submit");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        heightL: "100vh",
        overflow: "scroll",
        border: 1,
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "lightblue",
        backgroundImage: "url('../assets/crystalBackground.jpeg')",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        className="project-form"
        component="form"
        sx={{
          Width: "700px",
          maxWidth: "1000px",
          margin: "20px auto",
          bgcolor: "lightblue",
          "& .MuiTextField-root": { m: 2, width: "99%" },
        }}
      >
        <Header />
        <div
          id="client-info"
          ref={clientRef}
          style={{ position: "relative", paddingTop: "30px" }}
        >
          <Typography sx={{ marginBottom: "30px" }}>
            Please put your details in client 1 section. If there are other
            client, please use the add button to enter their contact information
          </Typography>
          {client.map((_, i) => {
            return (
              <>
                <List
                  key={i}
                  sx={style}
                  aria-label="mailbox folders"
                  id="individual-client"
                >
                  <Typography
                    color="primary"
                    textAlign="left"
                    display="block"
                    sx={{
                      position: "absolute",
                      top: "-15px",
                      left: "15px",
                      bgcolor: "#fff",
                      fontSize: "20px",
                      fontWeight: 700,
                    }}
                  >
                    Client {i + 1}
                  </Typography>
                  <ListItem>
                    <TextField
                      id=""
                      className="clientName"
                      label="Client's Name"
                      variant="standard"
                    />
                  </ListItem>
                  <ListItem>
                    <TextField
                      id="standard-textarea"
                      className="clientEmail"
                      label="Client's Email"
                      placeholder="xxx@mail.com"
                      variant="standard"
                    />
                  </ListItem>

                  <Box
                    onClick={() => deleteClient(i)}
                    sx={{
                      position: "absolute",
                      bgcolor: "white",
                      width: "30px",
                      height: "30px",
                      right: -5,
                      top: -15,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <CloseIcon></CloseIcon>
                  </Box>
                </List>
              </>
            );
          })}
          <Button variant="contained" onClick={addClient}>
            Add Client
          </Button>
        </div>
        <div>
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"-4px"}
            marginBottom={"-27px"}
          >
            1.
          </Typography>
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"16px"}
            marginBottom={"-16px"}
          >
            Project title *
            <Typography textAlign={"left"} fontSize={14}>
              Please provide an informative project title.
            </Typography>
          </Typography>
          <TextField
            id="projectTitle"
            placeholder="Enter Your Answer"
            variant="filled"
            required
            sx={{ paddingTop: "15px" }}
          />

          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"-4px"}
            marginBottom={"-27px"}
          >
            2.
          </Typography>
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"16px"}
            marginBottom={"-16px"}
          >
            Project description *
            <Typography textAlign={"left"} fontSize={14}>
              Please provide a short description (3-10 sentences) of the
              project.
            </Typography>
          </Typography>
          <TextField
            id="description"
            placeholder="Enter Your Answer"
            multiline
            rows={10}
            variant="filled"
            required
          />
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"-4px"}
            marginBottom={"-27px"}
          >
            3.
          </Typography>
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"16px"}
            marginBottom={"-16px"}
          >
            Desired ouput *
            <Typography textAlign={"left"} fontSize={14}>
              Please identify the features that will constitute the MVP (minimum
              viable product).
            </Typography>
          </Typography>
          <TextField
            id="desireOutput"
            placeholder="Enter Your Answer"
            multiline
            rows={10}
            variant="filled"
            required
          />
        </div>
        <div id="special-requirement">
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"-4px"}
            marginBottom={"-27px"}
          >
            4.
          </Typography>
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"16px"}
            marginBottom={"-16px"}
          >
            Special equipment requirements
            <Typography textAlign={"left"} fontSize={14}>
              Will your project require special equipment that you are unable to
              provide? If yes, please specify the required equipment. Note: We
              can only accept a limited number of projects with special
              equipment needs.
            </Typography>
          </Typography>
          <FormControl
            id="specialRequirement"
            sx={{ marginTop: "20px", marginLeft: "16px" }}
          >
            <RadioGroup
              name="radio-buttons-group"
              value={specialRequirement}
              onChange={handleSpecialRequirement}
            >
              <Radio
                value="No"
                label="No"
                variant="outlined"
                sx={{ textAlign: "left" }}
              />
              <Radio
                value="other"
                label="others"
                variant="outlined"
                sx={{ textAlign: "left" }}
              />

              <TextField
                id="specialRequirement-input"
                label="Equipment"
                variant="standard"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div id="">
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"-4px"}
            marginBottom={"-27px"}
          >
            5.
          </Typography>
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"16px"}
            marginBottom={"-16px"}
          >
            Number Of Teams *
            <Typography textAlign={"left"} fontSize={14}>
              Would you be open to the idea of multiple teams working on your
              project? If yes, please specify the maximum number of teams you
              would be happy to work with. To make it easier for you, all team
              meetings will be combined into the same time slot, ensuring you
              won't need to allocate more meeting time than you would with one
              team.
              <br></br>
              <br></br>
              For your consideration, 1-4 teams would require a 1-hour meeting
              fortnightly. Additionally, we will invite you to evaluate teams'
              final presentations, typically taking about 20 minutes per team.
              <br></br>
              <br></br>
              Working with multiple teams offers the advantage of bringing
              diverse perspectives and ideas to the project. It also increases
              the likelihood of achieving a final result that aligns with
              expectations.
            </Typography>
          </Typography>
          <Slider
            defaultValue={1}
            onChange={handleSlider}
            aria-label="Default"
            {...(sliderState
              ? { valueLabelDisplay: "on" }
              : { valueLabelDisplay: "off" })}
            min={1}
            max={10}
            marks={marks}
            sx={{ marginTop: "50px", marginLeft: "16px", width: "95%" }}
          />
          <TextField
            id="other-number"
            variant="filled"
            label="other number"
            disabled={sliderState}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.value = input.value.replace(/[^0-9]/g, "");
            }}
          />
        </div>
        <div id="team-number">
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"-4px"}
            marginBottom={"-27px"}
          >
            6.
          </Typography>
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"16px"}
            marginBottom={"-16px"}
          >
            Desired team skills
            <Typography textAlign={"left"} fontSize={14}>
              Please specify any skills you would like team members to have.
              This could include expertise in a specific technology or tool that
              you want the team to use for implementing the project.
            </Typography>
          </Typography>
          <TextField
            id="desireSkill"
            placeholder="Enter Your Answer"
            multiline
            rows={10}
            variant="filled"
          />
        </div>

        <div>
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"-4px"}
            marginBottom={"-27px"}
          >
            7.
          </Typography>
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"16px"}
            marginBottom={"-16px"}
          >
            Available resources
            <Typography textAlign={"left"} fontSize={14}>
              Are there any resources you would like to provide for students to
              become more familiar with your project?
            </Typography>
          </Typography>
          <TextField
            id="availableResources"
            placeholder="Enter Your Answer"
            multiline
            rows={10}
            variant="filled"
          />
        </div>
        <div id="future-consideration">
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"-10px"}
            marginBottom={"-27px"}
          >
            11.
          </Typography>
          <Typography
            fontWeight={700}
            textAlign={"left"}
            fontSize={18}
            marginLeft={"16px"}
            marginBottom={"-16px"}
          >
            Future consideration *
            <Typography textAlign={"left"} fontSize={14}>
              If your project is not selected by students in the upcoming
              semester, would you like it to be considered for the following
              semester?
            </Typography>
          </Typography>

          <FormControl>
            <RadioGroup
              name="radio-buttons-group"
              value={consideration}
              onChange={handleConsideration}
              sx={{ marginTop: "30px", marginLeft: "16px" }}
            >
              <Radio
                value="Yes"
                label="Yes"
                variant="outlined"
                sx={{ textAlign: "left" }}
              />
              <Radio
                value="No"
                label="No"
                variant="outlined"
                sx={{ textAlign: "left" }}
              />
            </RadioGroup>
          </FormControl>
        </div>
        <Button variant="contained" onClick={formSubmit} sx={{ marginTop: 5 }}>
          Submit
        </Button>
      </Box>
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
export default ProjectForm;
