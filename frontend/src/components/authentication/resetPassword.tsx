import * as React from "react";
import {  useState } from "react";
import {
    Button,
    TextField,
    Box,
    Paper,
    Grid,
    Snackbar


} from "@mui/material"

import Logo from "../../assets/Logo.svg"
// import validator from 'validator';


import {  getAuth, sendPasswordResetEmail } from 'firebase/auth';


function resetPassword(){
    
    const auth = getAuth();
    const [email, setEmail] = useState('');
    const [, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await sendPasswordResetEmail(auth, email)
            setSnackbarOpen(true);
            setEmail('');

        } catch (error: any){
            if (error.code === 'auth/user-not-found') {
                setError('User not found. Please check your email address.');
            } else if (error.code === 'auth/invalid-email') {
                setError('Invalid email address. Please enter a valid email.');
            } else {
                setError('An error occurred while sending the password reset email.');
            }
        }
    };

    return(
        <Grid component={Paper} elevation={10}
            sx={{width:"50%",
                
                marginTop: "7%",
                marginLeft: "25%",
                marginRight: "25%",
            }}
        
        >
        <Box
            sx={{
                marginTop:"5%"
            }}>
            <Box
                component="img"
                src={Logo}
                sx={{width: 200,          
                }}
            >
            </Box>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
 
        <TextField
            required
            id="email"
            type="String"
            label="Email Address"
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ minWidth: "50vh" }}
        ></TextField>
        <Button 
        variant="contained"
        type="submit"
        sx={{
            mb: 3,
            mt: 3,
            borderRadius: "20px",
            ":hover": {}
        }}
    >Submit
    </Button>
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Password reset email sent!"
    />

        </Box>
        </Box>
        </Grid>


    );
};

export default resetPassword;
