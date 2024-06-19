import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Box } from "@mui/material";
import Droppable from "./droppable";
import { useSensor, PointerSensor, useSensors } from "@dnd-kit/core";
import { Project } from "./project";
import { API_URL } from "../../apis/config";

interface AppProps {
  projectId: Project;
  onChangeProject: Function;
  rejectList: Project[];
  setRejectList: Function;
  approvedList: Project[];
  setApprovedList: Function;
  pendingList: Project[];
  setPendingList: Function;
  refreshProjects: Function;
}

function App(props: AppProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 100, tolerance: 10 },
    })
  );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box id="state-section" sx={{ height: "89vh", width: "400px" }}>
        <Droppable
          id={"approved"}
          list={props.approvedList}
          color={"green"}
          projectId={props.projectId.projectId}
          onChangeProject={props.onChangeProject}
          refreshProjects={props.refreshProjects}
        />
        <Droppable
          id={"pending"}
          list={props.pendingList}
          color={"#ed6c02"}
          projectId={props.projectId.projectId}
          onChangeProject={props.onChangeProject}
          refreshProjects={props.refreshProjects}
        />
        <Droppable
          id={"reject"}
          list={props.rejectList}
          color={"red"}
          projectId={props.projectId.projectId}
          onChangeProject={props.onChangeProject}
          refreshProjects={props.refreshProjects}
        />
      </Box>
    </DndContext>
  );

  async function handleDragEnd(event: DragEndEvent) {
    const over = event.over;
    const active = event.active;
    console.log(event);
    if (over) {
      switch (over.id) {
        case "approved":
          // Handle drop in the "Approved" section
          props.setPendingList((prevList: Project[]) =>
            prevList.filter((item: Project) => item.projectId !== active.id)
          );
          props.setRejectList((prevList: Project[]) =>
            prevList.filter((item: Project) => item.projectId !== active.id)
          );
          if (
            !props.approvedList.some((item) => item.projectId === active.id)
          ) {
            props.setApprovedList((prevList: Project[]) => [
              ...prevList,
              { projectId: active.id, title: active.data?.current?.title },
            ]);
            try {
              const response = await fetch(`${API_URL}/projects/status`, {
                method: "PUT",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: active.id,
                  status: "approved",
                }),
              });
              if (!response.ok) {
                throw new Error(
                  "Failed to update project status to the server"
                );
              }
              const data = await response.json();
              console.log(data);
            } catch (error) {
              console.error("Error updating project status:", error);
            }
          }
          break;
        case "pending":
          // Handle drop in the "Pending" section
          props.setApprovedList((prevList: Project[]) =>
            prevList.filter((item: Project) => item.projectId !== active.id)
          );
          props.setRejectList((prevList: Project[]) =>
            prevList.filter((item: Project) => item.projectId !== active.id)
          );

          if (!props.pendingList.some((item) => item.projectId === active.id)) {
            props.setPendingList((prevList: Project[]) => [
              ...prevList,
              { projectId: active.id, title: active.data?.current?.title },
            ]);
            try {
              const response = await fetch(`${API_URL}/projects/status`, {
                method: "PUT",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: active.id,
                  status: "pending",
                }),
              });
              if (!response.ok) {
                throw new Error(
                  "Failed to update project status to the server"
                );
              }
              const data = await response.json();
              console.log(data);
            } catch (error) {
              console.error("Error updating project status:", error);
            }
          }
          break;
        case "reject":
          // Handle drop in the "Reject" section
          props.setApprovedList((prevList: Project[]) =>
            prevList.filter((item: Project) => item.projectId !== active.id)
          );
          props.setPendingList((prevList: Project[]) =>
            prevList.filter((item: Project) => item.projectId !== active.id)
          );

          if (!props.rejectList.some((item) => item.projectId === active.id)) {
            props.setRejectList((prevList: Project[]) => [
              ...prevList,
              { projectId: active.id, title: active.data?.current?.title },
            ]);
            try {
              const response = await fetch(`${API_URL}/projects/status`, {
                method: "PUT",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: active.id,
                  status: "reject",
                }),
              });
              if (!response.ok) {
                throw new Error(
                  "Failed to update project status to the server"
                );
              }
              const data = await response.json();
              console.log(data);
            } catch (error) {
              console.error("Error updating project status:", error);
            }
          }
          break;
      }
    }
  }
}
export default App;
