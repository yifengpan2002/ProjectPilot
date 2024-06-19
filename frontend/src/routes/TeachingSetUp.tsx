import {
  Typography,
  Button,
  Box,
  TextField,
  NativeSelect,
  Grid,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState, useEffect, useCallback } from "react";
import Modal from "../components/teaching/confirmedModal";
import { API_URL } from "../apis/config";

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
// /semesters/selected
export default function TeachingSetUp() {
  // this is for the deadline component
  const [proposalDate, setProposalDate] = useState<Dayjs | null>(dayjs());
  const [preferenceDate, setPreferenceDate] = useState<Dayjs | null>(dayjs());
  const [deadlineConfirmState, setDeadlineConfirmState] =
    useState<boolean>(false);

  // this is for populate new semester
  const [populateSemesterState, setPopulateSemesterState] =
    useState<boolean>(false);

  // this is for creating new semester
  const [confirmState, setConfirmState] = useState<boolean>(false);
  const [newSemester, setNewSemester] = useState<string>("");

  // this is for delete admin component
  const [admin, setAdmin] = useState<Admin[]>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteAdminId, setDeleteAdminId] = useState<number>(0);

  // this is for delete semester component
  const [deleteSemesterModal, setDeleteSemesterModal] =
    useState<boolean>(false);
  const [deleteSemesterId, setDeleteSemesterId] = useState<number>(0);
  const [deleteSemesterString, setDeleteSemesterString] = useState<string>("");

  //this is for deadline set up
  const [currentSemester, setCurrentSemester] = useState<number>(0);
  const [currentSemesterTitle, setCurrentSemesterTitle] = useState<string>("");

  //share component
  const [semesterList, setSemesterList] = useState<Semester[]>([]);

  // this is for change display
  const [changeDisplay, setChangeDisplay] = useState<boolean>(false);
  const [newDisplaySemester, setNewDisplaySemester] = useState<string>("");
  const [currentSelectedSemester, setCurrentSelectedSemester] =
    useState<string>("");
  const [currentSemesterDisplay, setCurrentSemesterDisplay] =
    useState<number>(0);

  const fetchSemesters = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/semesters`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setSemesterList(data);
      setCurrentSemester(data[-1]?.semesterId || 0);
      setCurrentSemesterTitle(data[-1]?.name || "");
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  }, []);

  const fetchSelectedSemesters = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/semesters/selected`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setCurrentSelectedSemester(data.name);
      // console.log(data)
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  }, []);

  const fetchAdmins = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/admins`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setAdmin(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  }, []);

  const handleProposalDateChange = useCallback((newValue: Dayjs | null) => {
    setProposalDate(newValue);
  }, []);

  const handlePreferenceDateChange = useCallback((newValue: Dayjs | null) => {
    setPreferenceDate(newValue);
  }, []);

  const populateSemester = () => {
    fetch(`${API_URL}/semesters/populate`, {
      method: "PUT",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    }).then(() => setPopulateSemesterState(true));
  };

  const updateDeadline = useCallback(() => {
    const updateDates = async () => {
      try {
        await fetch(`${API_URL}/semesters/deadline/submission`, {
          method: "PUT",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            semesterID: currentSemester,
            dateTimeString: proposalDate?.format("YYYY-MM-DD") + "T23:59:59",
          }),
        });

        await fetch(`${API_URL}/semesters/deadline/preferences`, {
          method: "PUT",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            semesterID: currentSemester,
            dateTimeString: preferenceDate?.format("YYYY-MM-DD") + "T23:59:59",
          }),
        });

        console.log("Submit new deadline successfully");
      } catch (error) {
        console.error("Error updating deadline:", error);
      }
    };

    updateDates();
  }, [currentSemester, proposalDate, preferenceDate]);

  const popUp = useCallback(() => {
    const Input = document.getElementById(
      "new-semester-name"
    ) as HTMLInputElement;
    setNewSemester(Input.value);
    setConfirmState(true);
  }, []);

  const popUp2 = useCallback(() => {
    setDeadlineConfirmState(true);
  }, []);

  const createNewSemester = useCallback(() => {
    const createSemester = async () => {
      try {
        await fetch(`${API_URL}/semesters`, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            semesterName: newSemester,
          }),
        });

        setConfirmState(false);
        console.log("New semester created successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error creating new semester:", error);
      }
    };

    createSemester();
  }, [newSemester]);

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const semesterId = event.target.value.split("-")[0];
      const semesterTitle = event.target.value.split("-")[1];
      setCurrentSemester(Number(semesterId));
      setCurrentSemesterTitle(semesterTitle);
    },
    []
  );

  const handleDisplaySemester = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const semesterId = event.target.value.split("-")[0];
      const semesterTitle = event.target.value.split("-")[1];
      setCurrentSemesterDisplay(Number(semesterId));
      setNewDisplaySemester(semesterTitle);
    },
    []
  );

  const changeDisplaySemester = useCallback(() => {
    setChangeDisplay(true);
  }, []);

  const updateDisplaySemester = useCallback(() => {
    const updateSemesterDisplay = async () => {
      try {
        await fetch(`${API_URL}/semesters/select`, {
          method: "PUT",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            semesterID: currentSemesterDisplay,
          }),
        });

        setChangeDisplay(false);
        console.log(
          "Change semester display successfully",
          currentSemesterDisplay
        );
        window.location.reload();
      } catch (error) {
        console.error("Error changing semester display:", error);
      }
    };

    updateSemesterDisplay();
  }, [currentSemesterDisplay]);

  const deleteConfirm = useCallback(() => {
    const deleteAdmin = async () => {
      try {
        await fetch(`${API_URL}/admins/${deleteAdminId}`, {
          method: "DELETE",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
        });
        window.location.reload();
        console.log("Delete successfully");
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    };

    deleteAdmin();
  }, [deleteAdminId]);

  const deleteModalPopUp = useCallback((Id: number) => {
    setDeleteAdminId(Id);
    setDeleteModal(true);
  }, []);

  useEffect(() => {
    fetchSemesters();
    fetchAdmins();
    fetchSelectedSemesters();
  }, [fetchSemesters, fetchAdmins, fetchSelectedSemesters]);

  const deleteSemesterConfirm = useCallback(() => {
    const deleteSemester = async () => {
      try {
        await fetch(`${API_URL}/semesters/${deleteSemesterId}`, {
          method: "DELETE",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
        });
        window.location.reload();
        console.log("Delete successfully");
      } catch (error) {
        console.error("Error deleting semester:", error);
      }
    };

    deleteSemester();
  }, [deleteSemesterId]);

  const deleteSemesterModalPopUp = useCallback((Id: number) => {
    setDeleteSemesterId(Id);
    setDeleteSemesterModal(true);
  }, []);
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
              <option key={0} value={``}></option>
              {semesterList.map((e: Semester) => {
                return (
                  <option
                    key={e.semesterId}
                    value={`${e.semesterId}-${e.name}`}
                  >
                    {e.name}
                  </option>
                );
              })}
            </NativeSelect>
            Currently display semester:
            <Typography sx={{ fontWeight: 700, display: "inline" }}>
              {" " + currentSelectedSemester}
            </Typography>
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
          <Typography>
            Enforced Format: year semester number ie:2024 Semester 2
          </Typography>
          <Button
            sx={{ marginTop: "30px", marginBottom: "30px" }}
            variant="contained"
            onClick={popUp}
          >
            Create new semester
          </Button>
          <Typography>
            Please make sure your select semester is one semester later than the
            one you want to populate from
          </Typography>
          <Button
            sx={{ marginBottom: "50px" }}
            variant="contained"
            onClick={populateSemester}
          >
            Populate semester
          </Button>
          {semesterList.map((semester) => (
            <Box key={semester.semesterId}>
              <Typography>{semester.name}</Typography>
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  setDeleteSemesterString(semester.name);
                  deleteSemesterModalPopUp(semester.semesterId);
                }}
              >
                Delete
              </Button>
            </Box>
          ))}
          <Box sx={{ marginBottom: "30px" }}></Box>
        </Box>
        <Box sx={{ margin: "30px 0", paddingBottom: "30px", borderBottom: 3 }}>
          <Grid container>
            <Grid item xs={12} md={6} lg={6}>
              <Typography variant="h5">Account Set Up</Typography>
            </Grid>
          </Grid>
          {admin.map((singleAdmin) => (
            <Box key={singleAdmin.adminId}>
              <Typography>
                {singleAdmin.firstName + " " + singleAdmin.lastName}
              </Typography>
              <Typography>{singleAdmin.email}</Typography>
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  deleteModalPopUp(singleAdmin.adminId);
                  console.log(admin);
                }}
              >
                Delete
              </Button>
            </Box>
          ))}
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
            <option key={0} value={``}></option>
            {semesterList.map((e: Semester) => (
              <option key={e.semesterId} value={`${e.semesterId}-${e.name}`}>
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
          title="Delete Admin"
          description={`Are you sure you want to delete this admin account?`}
          propFunction={deleteConfirm}
          setModalState={setDeleteModal}
        />
      )}
      {deleteSemesterModal && (
        <Modal
          title="Delete Semester"
          description={`Are you sure you want to delete this Semester with name is ${deleteSemesterString}?`}
          propFunction={deleteSemesterConfirm}
          setModalState={setDeleteSemesterModal}
        />
      )}
      {changeDisplay && (
        <Modal
          title="Change Semester Display"
          description={`Are you sure you want to change the displayed semester to ${newDisplaySemester}?`}
          propFunction={updateDisplaySemester}
          setModalState={setChangeDisplay}
        />
      )}
      {deadlineConfirmState && (
        <Modal
          title="Change Deadline"
          description={`Are you sure you want to change the project proposal deadline to ${proposalDate?.format(
            "YYYY-MM-DD"
          )} and the team's preferences submission deadline to ${preferenceDate?.format(
            "YYYY-MM-DD"
          )} in ${currentSemesterTitle}?`}
          propFunction={updateDeadline}
          setModalState={setDeadlineConfirmState}
        />
      )}
      {populateSemesterState && (
        <Modal
          title="Populate Semester"
          description={`You have populate semester successfully`}
          propFunction={() => setPopulateSemesterState(true)}
          setModalState={setPopulateSemesterState}
        />
      )}
    </Box>
  );
}
