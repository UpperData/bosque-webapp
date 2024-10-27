import React, { useEffect, useState } from 'react'
import axios from "../../../../auth/fetch"

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

import { Box, Grid, Divider, Container,FormControl, InputLabel,OutlinedInput,InputAdornment,Typography, Card, CardContent, Hidden, Button, Modal, TextField, Alert, List, ListItem, ListItemButton, ListItemText } from '@mui/material';


import Scrollbar from "../../../../components/Scrollbar";

import Loader from '../../../../components/Loader/Loader';
import Page from '../../../../components/Page';
import { useSelector } from 'react-redux';
import { Font } from '@react-pdf/renderer';
import { withSize } from 'react-sizeme';
import { title } from 'process';

export default function MesssageWhatsapp() {

    const [loading, setloading] = useState(false);
    const [search, setsearch]   = useState(false);

    const [data, setdata]       = useState(null);

    const [phone, setphone]                     = useState("*");
    const [membershipsList, setmembershipsList] = useState([]);
    const [roleList, setRoleList] = useState([]);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const memberships                                   = useSelector(state => state.dashboard.memberships);
    const [membershipsSelected, setmembershipsSelected] = useState([]);
    const [contactList,setContactList]                    =useState([]);

    const [count, setcount]                             = useState(0);
    const [sending, setsending]                         = useState(false);
    const [titulo,setTitulo]                            =useState(null);
    const [msg,setMsg]                                  =useState(null);


    let urlValidatePhone        = "/accoUnt/phone/VALIDAtor/";   
    let getMembershipsByPhone   = "/memBeRship/Get/ByPhone/";
    let urlAsignRevoke          = "membeRship/asing/revoque/";

    const LoginSchema =     Yup.object().shape({
        text:               Yup.string().required('')
    });

    const getContacts=()=>{
        const group={"group":membershipsSelected}
        axios({
            method: "post",
            url:    "/memBeRship/Get/ByGroup/",
            data:   group
        }).then((res) => {
            setContactList(res.data)
        }).catch((err) => {
            console.error(err);
        });
    } 
    const sendWhatsapp=()=>{
        let contact= getContacts();
        let arrayMsj={"tel":contactList,"msg":msg,"title":titulo};
        axios({
            method: "POST",            
            url:    "http://localhost:7170/sendWhatsapp/",
            data:   arrayMsj
        }).then((res) => {
            setsending(false);            
            if(res.result){
                setalertSuccessMessage(res.data.message);                
                setTimeout(() => {
                    setalertSuccessMessage("");
                }, 8000);
            }

        }).catch((err) => { 
            console.log(err)           
            let fetchError = err;            
            if(fetchError.response){                   
                setalertErrorMessage(err.response.data.message || err.response.data.data.message);
                setsending(false);               
            }
        });
    }

    const getRoleList = () => {
        axios.get("/front/Role/get/*")
        .then((res) => {
                setRoleList(res.data.data);
                setloading(false);

        }).catch((err) => {
            console.error(err);
        });
    }
    const toggleValueToMemberships = async (value) => {

        console.log(membershipsSelected)
        let newList = membershipsSelected;
        // console.log(newList);
        let verify  = newList.find(item => item === value);

        if(verify){
            // delete
            newList = newList.filter(item => item !== value);
            await setmembershipsSelected(newList);
        }else{
            // add
            newList.push(value);
            await setmembershipsSelected(newList);
        }

        await setcount(count + 5);        
    }

    const getMemberships = () => {
        axios.get(getMembershipsByPhone+phone)
        .then((res) => {

            console.log(res.data.data);

            if(res.data.result){

                setdata(res.data.data);
                setmembershipsList(res.data.data.membership);

                let RoleListByUser = [];
                if(res.data.data !== null){
                    if(res.data.data.membership.length > 0){
                        for (let i = 0; i < res.data.data.membership.length; i++) {

                            const membershipData = res.data.data.membership[i];
                            RoleListByUser.push(membershipData.role.roleId);

                        }
                    }
                }

                setmembershipsSelected(RoleListByUser);

                setsearch(false);
                setloading(false);

            }

        }).catch((err) => {

            let error = err.response;
            if(error){
                if(error.data){
                    setdata(null);
                    setsearch(false);
                    setloading(false);

                    setalertErrorMessage(error.data.data.message);

                    setTimeout(() => {
                        setalertErrorMessage("");
                    }, 5000);
                }
            }

        });
    }


    let RoleListByUser = [];
    if(data !== null){
        if(membershipsList.length > 0){
            for (let i = 0; i < membershipsList.length; i++) {

                const membershipData = membershipsList[i];
                RoleListByUser.push(membershipData.role.roleId);

            }
        }
    }
 
  

    useEffect(()=>{
      if(!loading|| !search)   getRoleList()        
    },[loading,search])
    
    return (
        <Page title="Notificaciones | Bosque Marino">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4" color="white.main">
                    Notificaciones Whatsapp
                </Typography>
            </Box>

            <Grid sx={{ pb: 3 }} item xs={12}>
                {!loading &&
                    <Card>
                        <CardContent>
                            {alertSuccessMessage !== "" &&
                                <Alert sx={{mb: 3}} severity="success">
                                    {alertSuccessMessage}
                                </Alert>
                            }

                            {alertErrorMessage !== "" &&
                                <Alert sx={{mb: 3}} severity="error">
                                    {alertErrorMessage}
                                </Alert>
                            }

                            <Grid container justifyContent="space-between" columnSpacing={3}>

                                <Grid item xs={2} md={5}>

                                    <Typography variant="h5" align="center" sx={{mb: 3, mt: 2, fontWeight: "bold"}}>
                                        Grupos
                                    </Typography>
                                        <List>
                                            {roleList.length > 0 &&
                                                
                                                <Scrollbar
                                                    sx={{
                                                        height: 320,
                                                        with:100,
                                                        '& .simplebar-content': { maxHeight: 320 ,height: 320, maxWidth:200,  display: 'flex', flexDirection: 'column' }
                                                    }}
                                                >
                                                {roleList.map((role, key) => {
                                                    let item = role;
                                                    return <ListItem 
                                                            // sx={{ background: membershipsSelected.includes("Drafts") ? "primary" : "" }} 
                                                            disablePadding
                                                            key={key}
                                                        >
                                                            <ListItemButton 
                                                                selected={membershipsSelected.includes(role.id)} 
                                                                onClick={() => toggleValueToMemberships(role.id)}
                                                            >
                                                                <ListItemText primary={role.name} />
                                                            </ListItemButton>
                                                        </ListItem>
                                                })}
                                                </Scrollbar>                                                    
                                            }
                                        </List>
                                    </Grid>      
                                
                            
                                <Divider orientation="vertical" flexItem />                                    
                                    <Grid item xs={6} md={6}>                                    
                                        <Box sx={{ pb: 3 }}>
                                            <Typography variant="h5" align="center" sx={{mb: 3, mt: 2, fontWeight: "bold"}}>
                                                Contenido
                                            </Typography>
                                        </Box> 
                                        <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Título</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"                                           
                                            
                                            onChange={(e)=>setTitulo(e.target.value)}
                                            value={titulo}
                                            
                                        />
                                        </FormControl>
                                        <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Mensaje</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            startAdornment={<InputAdornment position="start">Texto a enviar</InputAdornment>}
                                            label="Amount"
                                            onChange={(e)=>setMsg(e.target.value)}
                                            value={msg}
                                            multiline
                                            rows={8}
                                        />
                                        </FormControl>
                                        <LoadingButton 
                                                variant="contained" 
                                                color="primary"
                                                type="button"
                                                fullWidth
                                                sx={{py: .9, mt:2}}
                                                onClick={() => sendWhatsapp()}
                                                loading={sending}
                                                disabled={sending || (membershipsSelected.length === 0 && membershipsList.length === 0 && title && msg )}
                                            >
                                                Enviar Whatsapp
                                            </LoadingButton>
                                    </Grid>                                
                            </Grid>
                        </CardContent>        
                        
                                                
                    </Card>                    
                }

                {loading &&
                    <Card>
                        <CardContent>
                            <Loader />
                        </CardContent>
                    </Card>
                }
            </Grid>
        </Container>
        </Page>
    );
}
