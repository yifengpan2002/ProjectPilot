import { useDraggable } from "@dnd-kit/core";
import { Button, Tooltip } from "@mui/material";
import { useSensor } from "@dnd-kit/core";
import { MouseSensor } from "@dnd-kit/core";
import { useSensors } from "@dnd-kit/core";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import UnpublishedOutlinedIcon from "@mui/icons-material/UnpublishedOutlined";
import { useEffect } from "react";
import { API_URL } from "../../apis/config";

interface DraggableProps {
  id: number;
  name: string;
  projectId: number;
  onChangeProject: Function;
  refreshProjects: Function;
  areaId: string;
  publishStatus: boolean;
}

export function Draggable(props: DraggableProps) {
  let title = props.name;
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.id,
      data: { title },
    });

  useEffect(() => {
    const publishIcon = document.getElementById("publish") as HTMLElement;
    if (publishIcon) {
      publishIcon.onclick = publish;
    }
    const unpublishIcon = document.getElementById("unpublish") as HTMLElement;
    if (unpublishIcon) {
      unpublishIcon.onclick = unpublish;
    }
  }, []);

  function changeColor() {
    props.onChangeProject(props.id);
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      onActivation: () => alert("click"), // Here!
      activationConstraint: { distance: 5 },
    })
  );
  const style = transform
    ? {
        position: isDragging ? "absolute" : "relative",
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 9999 : 1,
      }
    : undefined;

  const publish = () => {
    fetch(`${API_URL}/projects/published`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: props.id,
        published: true,
      }),
    })
      .then(() => {
        props.refreshProjects();
      })
      .catch((error) => {
        console.error("Error publishing project:", error);
      });
  };

  const unpublish = () => {
    fetch(`${API_URL}/projects/published`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: props.id,
        published: false,
      }),
    })
      .then(() => {
        props.refreshProjects();
      })
      .catch((error) => {
        console.error("Error unpublishing project:", error);
      });
  };

  return (
    <div style={{ display: "flex" }}>
      <Button
        ref={setNodeRef}
        onClick={() => changeColor()}
        {...listeners}
        {...attributes}
        {...sensors}
        variant="contained"
        size="small"
        sx={{
          ...style,
          width: "100%",
          marginBottom: "5px",
          overflow: "hidden",
          flexGrow: 1,
          textAlign: "left",
        }}
      >
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "clip",
          }}
        >
          {props.name}
        </div>
      </Button>
      {props.areaId === "approved" && !props.publishStatus && (
        <Tooltip title="publish">
          <div id="publish" onClick={publish}>
            <PublishedWithChangesIcon
              sx={{
                color: "primary.main",
                width: "30px",
                height: "30px",
                marginLeft: "10px",
                cursor: "pointer",
                "&:hover": { color: "success.main" },
              }}
            />
          </div>
        </Tooltip>
      )}

      {props.areaId === "approved" && props.publishStatus && (
        <Tooltip title="unpublish">
          <div id="unpublish" onClick={unpublish}>
            <UnpublishedOutlinedIcon
              sx={{
                color: "primary.main",
                width: "30px",
                height: "30px",
                marginLeft: "10px",
                cursor: "pointer",
                "&:hover": { color: "error.main" },
              }}
            />
          </div>
        </Tooltip>
      )}
    </div>
  );
}

export default Draggable;
