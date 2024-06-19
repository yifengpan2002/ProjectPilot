import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { API_URL } from "../../apis/config";

export default function Header() {
  const [deadline, setDeadline] = useState<string>("");
  const [currentSemesterTitle, setCurrentSemesterTitle] = useState<string>("");

  useEffect(() => {
    fetch(`${API_URL}/semesters/selected`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        const latestDeadline = data.submissionDeadline;
        setDeadline(latestDeadline); // Default to the first semester ID if available
        setCurrentSemesterTitle(data.name);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  return (
    <div>
      <Box>
        <Typography variant="h4" sx={{ textAlign: "left" }}>
          Computer Science Capstone: Project Proposal Form
        </Typography>
        <br />
        <Typography variant="h6" sx={{ textAlign: "left" }} fontWeight={900}>
          Deadline
        </Typography>
        <br />
        <Typography sx={{ textAlign: "left" }}>
          Kindly complete this form if you wish to propose a project for the
          COMPSCI 399 Capstone Course in {currentSemesterTitle}. The deadline
          for form submission is{" "}
          <Typography fontWeight={700} display={"inline"}>
            {formatDate(deadline)}
          </Typography>
        </Typography>
        <br />
        <Typography sx={{ textAlign: "left" }}>
          Note: We accept applications throughout the year, but if the deadline
          isn't met, we will consider the project only for the following
          semester.
        </Typography>
        <br />
        <Typography variant="h5" sx={{ textAlign: "left" }} fontWeight={900}>
          Project Requirements
        </Typography>
        <Typography sx={{ textAlign: "left" }}>
          The proposed project should be a research or software development
          project, suitable in size to be completed within the 12-week duration
          of the semester. It should present a challenge for a team consisting
          of 5-6 students. For instance, if you are engaged in an ongoing
          project and seek assistance in developing a specific module, you can
          propose it as a potential project. Alternatively, if you are in a
          service role and require support in creating a system to facilitate or
          automate certain aspects of your work, you can suggest a project for
          consideration.
          <br />
          <br />
          Each team is expected to allocate approximately 7-8 hours per person
          per week to project development. The team will produce a prototype
          system every fortnight, progressively enhancing its functionality.
        </Typography>
        <br />
        <Typography variant="h5" sx={{ textAlign: "left" }} fontWeight={900}>
          Supervision Requirements
        </Typography>
        <Typography sx={{ textAlign: "left" }}>
          Team(s) will meet with you (or your nominated representative) at least
          once every fortnight to ensure that the project is going in the right
          direction. There will be a final project presentation session
          (probably in the last week of the semester) that we would expect you
          (or your nominated representative) to attend and provide us with
          feedback on your team's performance.
        </Typography>
        <br />
        <Typography variant="h5" sx={{ textAlign: "left" }} fontWeight={900}>
          Contacts & Information
        </Typography>
        <Typography sx={{ textAlign: "left" }}>
          You can find examples of projects created by capstone students
          following this link: https://www.capitalise.space/ The course overview
          can be found here:
          https://courseoutline.auckland.ac.nz/dco/course/COMPSCI/399/1243 If
          you have any questions, please feel free to contact Anna Trofimova
          (anna.trofimova@auckland.ac.nz) or Asma Shakil
          (asma.shakil@auckland.ac.nz)
        </Typography>
        <br />
      </Box>
    </div>
  );
}
