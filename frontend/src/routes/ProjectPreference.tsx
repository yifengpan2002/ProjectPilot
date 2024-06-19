import { useEffect, useState } from "react";
import Modal from "../components/student/modal";
import {
  Button,
  Paper,
  Typography,
  Grid,
  InputLabel,
  FormControl,
  NativeSelect,
} from "@mui/material";
import { Project } from "../components/teaching/project";
import { API_URL } from "../apis/config";
import { useFetchUserInfo } from "../hook/useFetchUserInfo";
import { useAuth } from "../hook/useAuth";

interface selectedList {
  project1: number;
  project2: number;
  project3: number;
  project4: number;
  project5: number;
}

function preferencePage() {
  const isLoggedin = useAuth();
  const { userInfo } = useFetchUserInfo(isLoggedin);
  const [fullProjectList, setFullProjectList] = useState<Project[]>([]);
  const [userSelectList, setUserSelectList] = useState<selectedList>({
    project1: 1,
    project2: 1,
    project3: 1,
    project4: 1,
    project5: 1,
  });
  const [submitState, setSubmitState] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);
  const [currentSemesterDeadline, setCurrentSemesterDeadline] =
    useState<Date | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/projects`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setFullProjectList(data);
      });

    fetch(`${API_URL}/semesters/selected`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        const deadline = new Date(data.preferencesDeadline);
        setCurrentSemesterDeadline(deadline);
      });
  }, []);

  const handleSelectChange = (value: string, selectNumber: number) => {
    console.log(parseInt((value[0] + value[1]).trim()));
    // Update the state based on the selectNumber
    switch (selectNumber) {
      case 1:
        setUserSelectList((prevState) => ({
          ...prevState,
          project1: parseInt((value[0] + value[1]).trim()),
        }));
        // console.log(userSelectList)
        break;
      case 2:
        setUserSelectList((prevState) => ({
          ...prevState,
          project2: parseInt((value[0] + value[1]).trim()),
        }));
        break;
      case 3:
        setUserSelectList((prevState) => ({
          ...prevState,
          project3: parseInt((value[0] + value[1]).trim()),
        }));
        break;
      case 4:
        setUserSelectList((prevState) => ({
          ...prevState,
          project4: parseInt((value[0] + value[1]).trim()),
        }));
        break;
      case 5:
        setUserSelectList((prevState) => ({
          ...prevState,
          project5: parseInt((value[0] + value[1]).trim()),
        }));
        break;
      default:
        break;
    }
  };

  const isValidSelection = () => {
    const selectedValues = Object.values(userSelectList);
    if (selectedValues.length !== 5) {
      alert("please select 5 projects");
      return false;
    }
    const uniqueValues = new Set(selectedValues);
    if (selectedValues.length !== uniqueValues.size) {
      alert("Please select different projects for each preference.");
      setWarning(true);
      return false;
    }
    //if the deadline is pass the current datetime, return false and alert a message.
    if (currentSemesterDeadline && new Date() > currentSemesterDeadline) {
      alert("Submission deadline has passed.");
      return false;
    }
    return true;
  };

  const submitPreference = () => {
    if (isValidSelection()) {
      const project1 = userSelectList["project1"];
      const project2 = userSelectList["project2"];
      const project3 = userSelectList["project3"];
      const project4 = userSelectList["project4"];
      const project5 = userSelectList["project5"];
      const final = [project1, project2, project3, project4, project5];
      fetch(`${API_URL}/user/preferences`, {
        method: "PUT",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupID: userInfo?.groupId, //how do I get the groupId?
          preferenceIDs: final, //[2,3,4,5,6]
        }),
      });
      console.log(final);
      setSubmitState(true);
      setWarning(false);
    }
  };

  return (
    <Grid
      component={Paper}
      elevation={10}
      sx={{
        marginLeft: "20%",
        marginRight: "20%",
        marginBottom: "5%",
        marginTop: "5%",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {warning && (
        <Typography
          variant="h6"
          sx={{ color: "error.main", textAlign: "center", marginTop: "20px" }}
        >
          Please select different projects for each preference
        </Typography>
      )}

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          minHeight: "50%",
          maxWidth: "100%",
          paddingTop: "5%",
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingBottom: "5%",
        }}
      >
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Typography variant="h6">
            1. Select Team's first preference for projects:
            <InputLabel
              variant="standard"
              htmlFor="uncontrolled-native"
            ></InputLabel>
          </Typography>
          <NativeSelect
            inputProps={{
              name: "project",
              id: "uncontrolled-native",
            }}
            sx={{
              variant: "filled",
              justifyContent: "end",
              alignContent: "end",
              marginLeft: "10%",
              overflowY: "scroll",
            }}
            onChange={(e) => handleSelectChange(e.target.value, 1)}
          >
            {fullProjectList.map((e, i) => {
              return (
                <option key={i} value={e.projectId}>
                  {e.projectId + " " + e.title}
                </option>
              );
            })}
          </NativeSelect>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          minHeight: "50%",
          maxWidth: "100%",
          paddingTop: "5%",
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingBottom: "5%",
        }}
      >
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Typography variant="h6">
            2. Select Team's second preference for projects:
            <InputLabel
              variant="standard"
              htmlFor="uncontrolled-native"
            ></InputLabel>
          </Typography>
          <NativeSelect
            inputProps={{
              name: "project",
              id: "uncontrolled-native",
            }}
            sx={{
              variant: "filled",
              justifyContent: "end",
              alignContent: "end",
              marginLeft: "10%",
            }}
            onChange={(e) => handleSelectChange(e.target.value, 2)}
          >
            {fullProjectList.map((e) => {
              return (
                <option value={e.projectId}>
                  {e.projectId + " " + e.title}
                </option>
              );
            })}
          </NativeSelect>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          minHeight: "50%",
          maxWidth: "100%",
          paddingTop: "5%",
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingBottom: "5%",
        }}
      >
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Typography variant="h6">
            3. Select Team's third preference for projects:
            <InputLabel
              variant="standard"
              htmlFor="uncontrolled-native"
            ></InputLabel>
          </Typography>
          <NativeSelect
            inputProps={{
              name: "project",
              id: "uncontrolled-native",
            }}
            sx={{
              variant: "filled",
              justifyContent: "end",
              alignContent: "end",
              marginLeft: "10%",
            }}
            onChange={(e) => handleSelectChange(e.target.value, 3)}
          >
            {fullProjectList.map((e) => {
              return (
                <option value={e.projectId}>
                  {e.projectId + " " + e.title}
                </option>
              );
            })}
          </NativeSelect>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          minHeight: "50%",
          maxWidth: "100%",
          paddingTop: "5%",
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingBottom: "5%",
        }}
      >
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Typography variant="h6">
            4. Select Team's fourth preference for projects:
            <InputLabel
              variant="standard"
              htmlFor="uncontrolled-native"
            ></InputLabel>
          </Typography>
          <NativeSelect
            inputProps={{
              name: "project",
              id: "uncontrolled-native",
            }}
            sx={{
              variant: "filled",
              justifyContent: "end",
              alignContent: "end",
              marginLeft: "10%",
            }}
            onChange={(e) => handleSelectChange(e.target.value, 4)}
          >
            {fullProjectList.map((e) => {
              return (
                <option value={e.projectId}>
                  {e.projectId + " " + e.title}
                </option>
              );
            })}
          </NativeSelect>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          minHeight: "50%",
          maxWidth: "100%",
          paddingTop: "5%",
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingBottom: "5%",
        }}
      >
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Typography variant="h6">
            5. Select Team's last preference for projects:
            <InputLabel
              variant="standard"
              htmlFor="uncontrolled-native"
            ></InputLabel>
          </Typography>
          <NativeSelect
            inputProps={{
              name: "project",
              id: "uncontrolled-native",
            }}
            sx={{
              variant: "filled",
              justifyContent: "end",
              alignContent: "end",
              marginLeft: "10%",
            }}
            onChange={(e) => handleSelectChange(e.target.value, 5)}
          >
            {fullProjectList.map((e) => {
              return (
                <option value={e.projectId}>
                  {e.projectId + " " + e.title}
                </option>
              );
            })}
          </NativeSelect>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          minHeight: "50%",
          maxWidth: "100%",
          paddingTop: "5%",
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingBottom: "5%",
        }}
      >
        <Button variant="contained" onClick={submitPreference}>
          submit
        </Button>
      </Grid>
      {submitState && <Modal />}
    </Grid>
  );
}

export default preferencePage;
