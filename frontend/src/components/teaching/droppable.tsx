import { Box,Typography } from '@mui/material';
import {useDroppable} from '@dnd-kit/core';
import Draggable from './draggable';
import { Project } from './project';

interface DroppableProps {
    id: string;
    color: string;
    projectId: number;
    list: Project[];
    onChangeProject: Function;
    refreshProjects: Function;
}

function MultipleDroppables(props: DroppableProps) {
  const {setNodeRef} = useDroppable({id: props.id})
  const list = props.list
  
  return (

                <Box id="pending-section" sx={{textAlign:"left",height:"30%",
                position:"relative",  
                marginTop:"10%",
                '&:before':{
                    content:`''`,
                    display:"inline-block",
                    position:"absolute",
                    width:"15px",
                    height:"15px",
                    top:"5px",
                    bgcolor: props.color,
                    borderRadius: "50%"

                } }} ref={setNodeRef}>
                    <Typography sx={{
                    borderBottom: 2,
                    fontSize: "18px",
                    fontWeight: 700,
                    paddingLeft: "30px",
                    textTransform: "capitalize",
                    marginBottom: "5px",
                    position: "relative",
                    "&::after": {
                        display: "block",
                        position: "absolute",
                        top: 5,
                        right: 0,
                        fontWeight:400,
                        fontSize: "16px",
                        content: `"${list.length}"`
                    }
                }}>{props.id}</Typography>
                    <Box className="content" sx={{padding:"0 20px 5px 30px", overflow:"scroll",boxSizing:"border-box" }}>
                        {list.map((item) => {
                                return(
                                <Draggable publishStatus={item.published} id={item.projectId} name={item.title} projectId={props.projectId} onChangeProject={props.onChangeProject} areaId={props.id}
                                refreshProjects={props.refreshProjects}/>
                            )
                        })}
                    </Box>

                </Box>
  );
}
export default MultipleDroppables
