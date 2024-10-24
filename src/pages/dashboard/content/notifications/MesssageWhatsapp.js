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

    const [count, setcount]                             = useState(0);
    const [sending, setsending]                         = useState(false);


    let urlValidatePhone        = "/accoUnt/phone/VALIDAtor/";   
    let getMembershipsByPhone   = "/memBeRship/Get/ByPhone/";
    let urlAsignRevoke          = "membeRship/asing/revoque/";

    const LoginSchema =     Yup.object().shape({
        text:               Yup.string().required('')
    });
    const getRoleList = () => {
        axios.get("/front/Role/get/*")
        .then((res) => {
                setRoleList(res.data.data);
                setloading(false);

            console.log("roleList");
            console.log(roleList);

        }).catch((err) => {
            console.error(err);
        });
    }
    const toggleValueToMemberships = async (value) => {
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

    const getUser = () => {
        setsearch(true);
        setalertErrorMessage("");
        setalertSuccessMessage("");

        axios.get(urlValidatePhone+phone)
        .then((res) => {
            
            getMemberships();

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


    const revokeMembership = (id) => {
        console.log(id);

        let sendData = {
            accountId:  data.accountId,
            roleId:     id,
            isActived:  false
        };

        let newListSelected = membershipsSelected.filter(item => Number(item) !== id);

        setsending(true);
            
        axios({
            method: "post",
            url:    urlAsignRevoke,
            data:   sendData
        }).then((res) => {

            setalertSuccessMessage("Membresía revocada exitosamente!");
            setmembershipsSelected(newListSelected);

            setTimeout(() => {
                setalertSuccessMessage("");
            }, 5000);

            setsending(false);
            getMemberships();

        }).catch((err) => {
            setsending(false);
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

    let itemsCompleted  = 0;
    const revokeAll = () => {
        let itemslength     = RoleListByUser.length;
        setsending(true);

        for (let i = 0; i < RoleListByUser.length; i++) {
            itemsCompleted ++ ;
            let isvalid = itemsCompleted === itemslength;

            const membership = RoleListByUser[i];
            let sendData = {
                accountId:  data.accountId,
                roleId:     membership,
                isActived:  false
            };
                
            axios({
                method: "post",
                url:    urlAsignRevoke,
                data:   sendData
            }).then((res) => {

                if(isvalid){
                    setsending(false);
                    
                    setalertSuccessMessage("Membresías revocadas exitosamente!");
                    setmembershipsSelected([]);

                    setTimeout(() => {
                        setalertSuccessMessage("");
                    }, 3000);
                    getMemberships();
                }

            }).catch((err) => {
                setsending(false);
            });
        }

        itemsCompleted = 0;

    }

    const updateAllData = () => {
        let list            = membershipsSelected;
        let newMembershipsList         = [];

        setsending(true);

        // items in true
        for (let i = 0; i < list.length; i++) {
            const membership        = list[i];
            let isInclude           = RoleListByUser.includes(membership);

            let newActionMembership = {};

            if(!isInclude){
                newActionMembership.role   = membership;
                newActionMembership.action = true;
                newMembershipsList.push(newActionMembership);
            }
        }

        // items in false
        for (let i = 0; i < RoleListByUser.length; i++) {
            const membership        = RoleListByUser[i];
            let isInclude           = membershipsSelected.includes(membership);

            let newActionMembership = {};

            if(!isInclude){
                newActionMembership.role   = membership;
                newActionMembership.action = false;
                newMembershipsList.push(newActionMembership);
            }
        }

        let itemslength             = newMembershipsList.length;
        // console.log(newMembershipsList);

        if(itemslength > 0){
            for (let i = 0; i < newMembershipsList.length; i++) {
                itemsCompleted++;
                const membership        = newMembershipsList[i];
                let isvalid             = itemsCompleted === itemslength;

                let sendData = {
                    accountId:  data.accountId,
                    roleId:     membership.role,
                    isActived:  membership.action
                };
                    
                axios({
                    method: "post",
                    url:    urlAsignRevoke,
                    data:   sendData
                }).then((res) => {
        
                    if(isvalid){
                        setsending(false);
                        
                        setalertSuccessMessage("Membresías actualizadas exitosamente!");
                        getMemberships();

                        setTimeout(() => {
                            setalertSuccessMessage("");
                        }, 3000);
                    }
        
                }).catch((err) => {
                    setsending(false);
                });
            }
        }else{
            setsending(false);
            setalertErrorMessage("No hay cambios por realizar");

            setTimeout(() => {
                setalertErrorMessage("");
            }, 5000);
        }

        itemsCompleted = 0;
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

                                <Grid item xs={12} md={5}>

                                    <Typography variant="h5" align="center" sx={{mb: 3, mt: 2, fontWeight: "bold"}}>
                                        Grupos
                                    </Typography>

                                    {roleList !== null 
                                        ?
                                        <div> 
                                            <List>
                                                {roleList.length > 0 &&
                                                    
                                                        <Scrollbar
                                                            sx={{
                                                                height: 320,
                                                                '& .simplebar-content': { maxHeight: 320 ,height: 320,  display: 'flex', flexDirection: 'column' }
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
                                            
                                        </div>
                                        :
                                        <Alert sx={{my: 3}} severity="info">
                                            Seleccione un usuario para ver sus membresías.
                                        </Alert>  
                                    }

                                </Grid>       
                                
                            
                                <Divider orientation="vertical" flexItem />                                    
                                    <Grid item xs={12} md={6}>                                    
                                        <Box sx={{ pb: 3 }}>
                                            <Typography variant="h5" align="center" sx={{mb: 3, mt: 2, fontWeight: "bold"}}>
                                                Contenido
                                            </Typography>
                                        </Box> 
                                        <FormControl fullWidth sx={{ m: 1 }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Mensaje</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            startAdornment={<InputAdornment position="start">Texto a enviar</InputAdornment>}
                                            label="Amount"
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
                                                // onClick={() => updateAllData()}
                                                loading={sending}
                                                disabled={sending || (membershipsSelected.length === 0 && membershipsList.length === 0)}
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
