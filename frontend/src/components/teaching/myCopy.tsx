import {
  Typography,
  Button,
  Box,
  TextField,
  NativeSelect,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState, useEffect } from "react";
import Modal from "./confirmedModal";
import { API_URL } from "../../apis/config";

interface Semester {
  name: string;
  semesterId: number;
}

interface Admin {
  adminId: number;
  availableHoure: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
}

export default function TeachingSetUp() {
  const [proposalDate, setProposalDate] = useState<Dayjs | null>(dayjs());
  const [preferenceDate, setPreferenceDate] = useState<Dayjs | null>(dayjs());
  const [confirmState, setConfirmState] = useState<boolean>(false);
  const [deadlineConfirmState, setDeadlineConfirmState] =
    useState<boolean>(false);
  const [changeDisplay, setChangeDisplay] = useState<boolean>(false);
  // const [updateDeadlineState, setUpdateDeadlineState] = useState<boolean>(false);
  const [newSemester, setNewSemester] = useState<string>("");
  const [newDisplaySemester, setNewDisplaySemester] = useState<string>("");
  const [semesterList, setSemesterList] = useState<Semester[]>([]);
  const [currentSemester, setCurrentSemester] = useState<number>(0);
  const [currentSemesterDisplay, setCurrentSemesterDisplay] =
    useState<number>(0);
  const [currentSemesterTitle, setCurrentSemesterTitle] = useState<string>("");
  const [admin, setAdmin] = useState<Admin[]>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteAdminId, setDeleteAdminId] = useState<number>(0);

  useEffect(() => {
    fetch(`${API_URL}/semesters`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setSemesterList(data);
        setCurrentSemester(data[-1]?.semesterId || 0);
        setCurrentSemesterTitle(data[-1]?.name || "");
      });
    fetch(`${API_URL}/admins`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setAdmin(data);
      });
  }, []);

  const handleProposalDateChange = (newValue: Dayjs | null) => {
    setProposalDate(newValue);
    if (newValue) {
      console.log(newValue.format("YYYY-MM-DD") + "T23:59:59");
    }
  };

  const handlePreferenceDateChange = (newValue: Dayjs | null) => {
    setPreferenceDate(newValue);
    if (newValue) {
      console.log(newValue.format("YYYY-MM-DD") + "T23:59:59");
    }
  };

  const updateDeadline = () => {
    fetch(`${API_URL}/semesters/deadline/submission`, {
      method: "PUT",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        semesterID: currentSemester,
        dateTimeString: proposalDate?.format("YYYY-MM-DD") + "T23:59:59",
      }),
    });

    fetch(`${API_URL}/semesters/deadline/preferences`, {
      method: "PUT",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        semesterID: currentSemester,
        dateTimeString: preferenceDate?.format("YYYY-MM-DD") + "T23:59:59",
      }),
    });
    fetch(`${API_URL}/semesters/${currentSemester}`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => console.log("submit new deadline successfully"));
  };

  const popUp = () => {
    const Input = document.getElementById(
      "new-semester-name"
    ) as HTMLInputElement;
    setNewSemester(Input.value);
    setConfirmState(true);
  };
  const popUp2 = () => {
    setDeadlineConfirmState(true);
  };

  const createNewSemester = () => {
    fetch("${API_URL}/semesters", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        semesterName: newSemester,
      }),
    })
      .then(() => {
        setConfirmState(false);
        console.log("New semester created successfully");
      })
      .catch((error) => {
        console.error("Error creating new semester:", error);
      });
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [semesterId, semesterTitle] = event.target.value.split(" ");
    setCurrentSemester(Number(semesterId));
    setCurrentSemesterTitle(semesterTitle);
  };

  const handleDisplaySemester = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const [semesterId, semesterTitle] = event.target.value.split(" ");
    setCurrentSemesterDisplay(Number(semesterId));
    setNewDisplaySemester(semesterTitle);
  };

  const changeDisplaySemester = () => {
    setChangeDisplay(true);
  };

  const updateDisplaySemester = () => {
    fetch("${API_URL}/semesters", {
      method: "PUT",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        semesterID: currentSemesterDisplay,
      }),
    })
      .then(() => {
        setChangeDisplay(false);
        console.log("Change semester display successfully");
      })
      .catch((error) => {
        console.error("Error creating new semester:", error);
      });
  };

  const deleteConfirm = () => {
    fetch(`${API_URL}/admins/${deleteAdminId}`, {
      method: "DEL",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    }).then(() => console.log("delete successfully"));
  };

  const deleteModalPopUp = (Id: number) => {
    setDeleteAdminId(Id);
    setDeleteModal(true);
  };
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "scroll",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "800px",
          maxWidth: "1000px",
          margin: "20px auto",
          textAlign: "left",
          padding: "0 50px",
        }}
      >
        <Box sx={{ borderBottom: 3 }}>
          <Typography variant="h5" sx={{ marginBottom: "20px" }}>
            Semester Set Up
          </Typography>
          <Typography>
            {" "}
            The following select component is for you to decide which semester
            projects are displaying to student.
            <NativeSelect
              inputProps={{
                name: "project",
                id: "uncontrolled-native",
              }}
              sx={{
                variant: "filled",
                justifyContent: "end",
                alignContent: "end",
                marginRight: "50px",
                overflowY: "scroll",
              }}
              onChange={handleDisplaySemester}
            >
              {semesterList.map((e: Semester) => (
                <option key={e.semesterId} value={`${e.semesterId} ${e.name}`}>
                  {e.name}
                </option>
              ))}
            </NativeSelect>
            Currently display semester: Need data
            <Button
              variant="contained"
              size="small"
              color="error"
              sx={{ marginLeft: "30px" }}
              onClick={changeDisplaySemester}
            >
              Confirm
            </Button>
          </Typography>

          <TextField
            id="new-semester-name"
            variant="standard"
            label="Semester Name"
            sx={{ display: "block", marginTop: "20px" }}
            placeholder="ie:2024S1"
          ></TextField>
          <Button
            sx={{ marginTop: "30px", marginBottom: "50px" }}
            variant="contained"
            onClick={popUp}
          >
            Create new semester
          </Button>
          <Button
            sx={{ marginTop: "30px", marginBottom: "50px", marginLeft: "50px" }}
            variant="contained"
          >
            Populate semester
          </Button>
        </Box>

        <Box sx={{ margin: "30px 0", paddingBottom: "30px", borderBottom: 3 }}>
          <Typography variant="h5">Account Set Up</Typography>
          {admin.map((singleAdmin) => {
            const Id = singleAdmin.adminId;
            return (
              <Box>
                <Typography>
                  {singleAdmin.firstName + " " + singleAdmin.lastName}
                </Typography>
                <Typography>{singleAdmin.email}</Typography>
                <Button color="error" onClick={() => deleteModalPopUp(Id)}>
                  {" "}
                  Delete
                </Button>
              </Box>
            );
          })}
        </Box>

        <Typography variant="h5" sx={{ marginTop: "30px" }}>
          Deadline Set Up
          <NativeSelect
            inputProps={{
              name: "project",
              id: "uncontrolled-native",
            }}
            sx={{
              variant: "filled",
              justifyContent: "end",
              alignContent: "end",
              marginLeft: "50px",
              overflowY: "scroll",
            }}
            onChange={handleSelectChange}
          >
            {semesterList.map((e: Semester) => (
              <option key={e.semesterId} value={`${e.semesterId} ${e.name}`}>
                {e.name}
              </option>
            ))}
          </NativeSelect>
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateCalendar"]}>
              <DemoItem label="Project Proposal Submission Date">
                <DateCalendar
                  value={proposalDate}
                  onChange={handleProposalDateChange}
                />
              </DemoItem>
            </DemoContainer>
            <DemoContainer components={["DateCalendar"]}>
              <DemoItem label="Preference Submission Date">
                <DateCalendar
                  value={preferenceDate}
                  onChange={handlePreferenceDateChange}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <Box sx={{ mt: "20px", display: "flex", justifyContent: "center" }}>
          <Button variant="contained" onClick={popUp2}>
            Update Deadline
          </Button>
        </Box>

        <Typography
          variant="h5"
          sx={{ marginTop: "30px", paddingTop: "20px", borderTop: 3 }}
        >
          Matching History
        </Typography>
      </Box>

      {confirmState && (
        <Modal
          title="Create New Semester"
          description={`Are you sure you want to create a new semester with name ${newSemester}`}
          propFunction={createNewSemester}
          setModalState={setConfirmState}
        />
      )}
      {deleteModal && (
        <Modal
          title="Create New Semester"
          description={`Are you sure you want to delete this admin account`}
          propFunction={deleteConfirm}
          setModalState={setDeleteModal}
        />
      )}
      {changeDisplay && (
        <Modal
          title="Change semester"
          description={`Are you sure you want to change the displayed semester to ${newDisplaySemester}`}
          propFunction={updateDisplaySemester}
          setModalState={setChangeDisplay}
        />
      )}
      {deadlineConfirmState && (
        <Modal
          title="Change Deadline"
          description={`Are you sure you want to change client proposol deadline to ${proposalDate?.format(
            "YYYY-MM-DD"
          )} and the team's preferences submission deadline to ${preferenceDate?.format(
            "YYYY-MM-DD"
          )} in ${currentSemesterTitle}`}
          propFunction={updateDeadline}
          setModalState={setDeadlineConfirmState}
        />
      )}
    </Box>
  );
}
