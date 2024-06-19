import * as React from "react";
import { useState } from "react";
import {
    Button,
    TextField,
    Box,
    Paper,
    Grid,
} from "@mui/material"

import Logo from "../../assets/Logo.svg";
import { Link, useNavigate } from "react-router-dom";
import {auth} from'../../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";



const LoginForm = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        
            try {
              await signInWithEmailAndPassword(auth, email, password);
              console.log("Logged in successfully");
              navigate("/")   
            } catch (error) {
              console.error("Error logging in: ", error);
            }
          };
        
    return (
        <Grid component={Paper} elevation={10} 
            sx={{
                marginLeft: "20%",
                marginRight: "20%",
                marginBottom: "5%",
                marginTop:"5%",
            }} >
        <Box
            sx={{
                minHeight:"50%", 
                maxWidth: "100%",
                }}>
            <Box
                component="img"
                src={Logo}
                sx={{width: 200,
                }}
            />
            <Box 
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{
                display:"flex",
                flexDirection:"column",
                alignItems: "center",
            }}
            >
                <TextField 
                    required
                    id="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}

                    margin="normal"
                    sx={{
                        width:{xs: "75%", md: "50%"},
                        borderRadius:"50px"
                    }}
                />
                <TextField
                    required
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{width:{xs: "75%", md: "50%"},
                    }}
                    inputProps={{borderRadius:"20px"}}
                />
                <Box
                    flexDirection="row"
                    sx={{  
                        mb:3,
                        mt:3,
                    }}
                >
                    <Button 
                        variant="text"
                        component={Link} to="/resetPassword"
                        sx={{
                            borderRadius:"20px",
                            mr:"33vh",
                            mt:"10vh",
                            width:{xs: "100%"}
                        }}
                    >Forgot Password?
                    </Button>
                    <Button 
                        variant="contained"
                        type="submit"
                        sx={{ 
                            borderRadius:"20px", 
                            marginTop:"3vh"
                        }}  
                    >Login
                    </Button>
                </Box>
            </Box>
        </Box>
    </Grid>
    );
}

export default LoginForm;
