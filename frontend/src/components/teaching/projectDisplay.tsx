import { Box, TextField, Button, Typography, Slider } from "@mui/material";
import { FormControl, Radio, RadioGroup } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../apis/config";

interface addtionalClient {
  name: string;
  email: string;
}

interface Project {
  MVP: string;
  approved: boolean;
  availableResouces: string;
  clientId: number;
  description: string;
  futureConsideration: boolean;
  numberOfTeams: number;
  preferedSkills: string;
  projectId: number;
  requiredEquipment: string;
  selected: boolean;
  title: string;
  additionalInformation: addtionalClient[];
}

interface ProjectFormProps {
  project: Project;
  state: boolean;
  formButton: Function;
}

interface Client {
  firstName: String;
  lastName: String;
  email: String;
}

const marks = [
  {
    value: 10,
    label: "Any",
  },
];

function ProjectForm(props: ProjectFormProps) {
  const [_, setSpecialRequirementState] = useState<boolean>(false);
  const [client, setClient] = useState<Client[]>([]);
  const [slider, setSlider] = useState<number>(0);
  const [sliderState, setSliderState] = useState<boolean>(true);
  const [futureConsideration, setFutureConsideration] = useState<boolean>(
    props.project.futureConsideration
  );
  // const [addtionalClient, setAdditionalClient] = useState<addtionalClient[]>(
  //   props.project.additionalInformation
  // );

  // New state for controlled components
  const [title, setTitle] = useState(props.project.title);
  const [description, setDescription] = useState(props.project.description);
  const [MVP, setMVP] = useState(props.project.MVP);
  const [preferredSkills, setPreferredSkills] = useState(
    props.project.preferedSkills
  );
  const [availableResources, setAvailableResources] = useState(
    props.project.availableResouces
  );
  const [requiredEquipment, setRequiredEquipment] = useState(
    props.project.requiredEquipment
  );

  useEffect(() => {
    setSpecialRequirementState(props.project.requiredEquipment !== "No");
    setSliderState(props.project.numberOfTeams !== 10);
    setSlider(props.project.numberOfTeams);

    // Update controlled component state when props.project changes
    setTitle(props.project.title);
    setDescription(props.project.description);
    setMVP(props.project.MVP);
    setPreferredSkills(props.project.preferedSkills);
    setAvailableResources(props.project.availableResouces);
    setRequiredEquipment(props.project.requiredEquipment);
    setFutureConsideration(props.project.futureConsideration);
    if (props.project.clientId != 0) {
      fetch(`${API_URL}/users/${props.project.clientId}`,
        {
          method: "GET",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setClient([data]);
        });
    }
  }, [props.project]);

  const handleSlider = (_: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setSlider(value);
    setSliderState(value !== 10);
  };

  const handleSpecialRequirement = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSpecialRequirementState(event.target.value !== "No");
    setRequiredEquipment(event.target.value);
  };

  const handleFutureConsiderationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFutureConsideration(event.target.value === "yes");
  };

  const acceptProject = async () => {
    const finalNumberOfTeam =
      slider === 10
        ? parseInt(
            (document.getElementById("other-number") as HTMLInputElement).value
          )
        : slider;
    const clientNameList = document.querySelectorAll(
      "#client-info .client-name"
    ) as NodeListOf<HTMLInputElement>;
    const clientEmailList = document.querySelectorAll(
      "#client-info .client-email"
    ) as NodeListOf<HTMLInputElement>;
    const additionalInfo = [] as addtionalClient[];
    console.log(clientNameList.length);
    clientNameList.forEach((e, i) => {
      // console.log(e.value)
      additionalInfo.push({ name: e.value, email: clientEmailList[i].value });
    });
    console.log(additionalInfo);

    const data = {
      clientID: props.project.clientId,
      title: title,
      description: description,
      MVP: MVP,
      preferredSkills: preferredSkills,
      requiredEquipment: requiredEquipment,
      noOfTeams: finalNumberOfTeam,
      availableResources: availableResources,
      futureConsideration: futureConsideration,
      projectID: props.project.projectId,
    };

    const response = await fetch(`${API_URL}/projects`,
      {
        method: "PUT",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      console.log("error on fetching");
    }

    props.formButton(props.project, "approved", data);
  };

  return (
    <Box
      className="project-form"
      component="form"
      sx={{
        width: "700px",
        maxWidth: "1000px",
        margin: "20px auto",
        bgcolor: "",
        "& .MuiTextField-root": { m: 2, width: "99%" },
      }}
    >
      <div id="client-info" style={{ position: "relative" }}>
        <Typography
          fontWeight={700}
          textAlign={"left"}
          fontSize={18}
          marginLeft={"16px"}
          marginBottom={"-16px"}
        >
           Clients Information
          {props.project.additionalInformation
            ? props.project.additionalInformation.map((e, _) => {
                return (
                  <>
                    {/* <TextField
                    label="client's Name"
                    value={e.name}
                    className="client-name"
                  ></TextField>
                  <TextField
                    label="client's email"
                    value={e.email}
                    sx={{ marginBottom: "20px" }}
                    className="client-email"
                  ></TextField> */}
                    <Typography textAlign={"left"} fontSize={14}>
                      Client's Name: {e.name}
                    </Typography>
                    <Typography
                      textAlign={"left"}
                      fontSize={14}
                      sx={{ marginBottom: "10px" }}
                    >
                      Client's Email: {e.email}
                    </Typography>
                  </>
                );
              })
            : client.map((e, _) => {
                return (
                  <>
                    {/* <TextField
                  label="client's Name"
                  defaultValue={e.firstName + " " + e.lastName}
                  className="client-name"
                ></TextField>
                <TextField
                  label="client's email"
                  defaultValue={e.email}
                  sx={{ marginBottom: "20px" }}
                  className="client-email"
                ></TextField> */}
                    <Typography
                      textAlign={"left"}
                      fontSize={14}
                      key={e.firstName + " " + e.lastName}
                    >
                      Client's Name: {e.firstName + " " + e.lastName}
                    </Typography>
                    <Typography textAlign={"left"} fontSize={14}>
                      Client's Email: {e.email}
                    </Typography>
                  </>
                );
              })}
        </Typography>
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
          multiline
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
            Please provide a short description (3-10 sentences) of the project.
          </Typography>
        </Typography>
        <TextField
          id="description"
          placeholder="Enter Your Answer"
          multiline
          rows={10}
          variant="filled"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          Desired output *
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
          value={MVP}
          onChange={(e) => setMVP(e.target.value)}
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
            provide? If yes, please specify the required equipment. Note: We can
            only accept a limited number of projects with special equipment
            needs.
          </Typography>
        </Typography>
        <FormControl
          id="specialRequirement"
          sx={{ marginTop: "20px", marginLeft: "16px" }}
        >
          <RadioGroup
            name="radio-buttons-group"
            onChange={handleSpecialRequirement}
          >
            <Radio
              value="No"
              label="No"
              variant="outlined"
              checked={requiredEquipment === "No"}
              sx={{ textAlign: "left" }}
            />
            <Radio
              value="Other"
              label="Other"
              variant="outlined"
              checked={requiredEquipment !== "No"}
              sx={{ textAlign: "left" }}
            />
            <TextField
              id="specialRequirement-input"
              label="Standard"
              variant="standard"
              value={requiredEquipment !== "No" ? requiredEquipment : ""}
              onChange={(e) => setRequiredEquipment(e.target.value)}
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
            <br />
            <br />
            For your consideration, 1-4 teams would require a 1-hour meeting
            fortnightly. Additionally, we will invite you to evaluate teams'
            final presentations, typically taking about 20 minutes per team.
            <br />
            <br />
            Working with multiple teams offers the advantage of bringing diverse
            perspectives and ideas to the project. It also increases the
            likelihood of achieving a final result that aligns with
            expectations.
          </Typography>
        </Typography>
        <Slider
          value={slider}
          onChange={handleSlider}
          aria-label="Default"
          {...(slider < 10
            ? { valueLabelDisplay: "on" }
            : { valueLabelDisplay: "off" })}
          min={1}
          max={10}
          marks={marks}
          sx={{ marginTop: "50px", marginLeft: "16px", width: "95%" }}
        />
        {slider >= 10 && (
          <TextField id="other-number" variant="filled" label="other number" defaultValue={slider} />
        )}
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
          Desired team skills *
          <Typography textAlign={"left"} fontSize={14}>
            Please specify any skills you would like team members to have. This
            could include expertise in a specific technology or tool that you
            want the team to use for implementing the project.
          </Typography>
        </Typography>
        <TextField
          id="desireSkill"
          placeholder="Enter Your Answer"
          multiline
          rows={10}
          variant="filled"
          value={preferredSkills}
          onChange={(e) => setPreferredSkills(e.target.value)}
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
          Available resources *
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
          required
          value={availableResources}
          onChange={(e) => setAvailableResources(e.target.value)}
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
            name="future-consideration"
            onChange={handleFutureConsiderationChange}
            sx={{ marginTop: "30px", marginLeft: "16px" }}
          >
            <Radio
              value="yes"
              label="yes"
              checked={futureConsideration}
              variant="outlined"
              sx={{ textAlign: "left" }}
            />
            <Radio
              value="no"
              label="no"
              checked={!futureConsideration}
              variant="outlined"
              sx={{ textAlign: "left" }}
            />
          </RadioGroup>
        </FormControl>
      </div>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            props.formButton(props.project, "reject");
          }}
          sx={{}}
        >
          Reject
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => {
            props.formButton(props.project, "pending");
          }}
          sx={{}}
        >
          Wait a minute!
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={acceptProject}
          sx={{}}
        >
          Accept
        </Button>
      </Box>
    </Box>
  );
}

export default ProjectForm;
