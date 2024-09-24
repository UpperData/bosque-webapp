import React, { useEffect, useState } from 'react'
import axios from "../../../../auth/fetch"

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

import { Box, Grid, Divider, Container, Typography, Card, CardContent, Hidden, Button, Modal, TextField, Alert, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
import Scrollbar from "../../../../components/Scrollbar";

import Loader from '../../../../components/Loader/Loader';
import Page from '../../../../components/Page';
import { useSelector } from 'react-redux';

export default function Membership() {

    const [loading, setloading] = useState(false);
    const [search, setsearch]   = useState(false);

    const [data, setdata]       = useState(null);

    const [phone, setphone]                     = useState("");
    const [membershipsList, setmembershipsList] = useState([]);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const memberships                                   = useSelector(state => state.dashboard.memberships);
    const [membershipsSelected, setmembershipsSelected] = useState([]);

    const [count, setcount]                             = useState(0);
    const [sending, setsending]                         = useState(false);

    let urlGetData              = "/AcCoUnt/GET/ROLE/byAccoUnT/:accountId";
    let urlValidateEmail        = "/accoUnt/EmAIl/VALIDAtor/";
    let urlValidatePhone        = "/accoUnt/phone/VALIDAtor/";
    let getMembershipsByEmail   = "/memBeRship/Get/Byemail/";
    let getMembershipsByPhone   = "/memBeRship/Get/ByPhone/";

    let urlAsignRevoke          = "membeRship/asing/revoque/";

    const LoginSchema =     Yup.object().shape({
        text:               Yup.string().required('')
    });

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
        console.log(newList);
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

    
    return (
        <Page title="Membresías | Bosque Marino">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4" color="white.main">
                    Membresías
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

                                <Grid item xs={12} md={6}>

                                    <Typography variant="h5" align="center" sx={{mb: 3, mt: 2, fontWeight: "bold"}}>
                                        Usuario
                                    </Typography>

                                    <Grid container columnSpacing={3}>
                                        <Grid item md={9} xs={12}>
                                            <TextField
                                                label="Número de teléfono"
                                                size="small"
                                                fullWidth
                                                value={phone}
                                                onChange={(e) => setphone(e.target.value)}
                                                disabled={search}
                                            />
                                        </Grid>
                                        <Grid item md={3} xs={12}>
                                            <LoadingButton 
                                                variant="contained" 
                                                color="primary"
                                                type="button"
                                                fullWidth
                                                sx={{py: .9}}
                                                onClick={() => getUser()}
                                                loading={search}
                                                // disabled={textSearchData === "" || !permissions.consulta}
                                            >
                                                validar
                                            </LoadingButton>
                                        </Grid>
                                    </Grid>

                                    {data !== null 
                                        ?
                                        <div>
                                            <div>
                                                <Typography style={{fontWeight:'bold'}} sx={{mb: 2, mt: 3}}>
                                                    Actuales: 
                                                </Typography>
                                                {RoleListByUser.length > 0
                                                ?
                                                <Box sx={{ px: 3, mb:5 }}>
                                                    <ul className="list-unstyled">
                                                        {membershipsList.map((item, key) => {
                                                            let dataItem = item;
                                                            return  <li
                                                                        key={key}
                                                                    >
                                                                    <Grid container alignItems="center" columnSpacing={3} sx={{mb: 1}}>
                                                                        <Grid item md={9}>
                                                                            <Typography sx={{fontWeight: "bold"}}>
                                                                                - {item.role.name}
                                                                                {/* 
                                                                                    <Typography variant="span" sx={{fontWeight: "normal", ml: 1}}>
                                                                                        desde 01-02-2022
                                                                                    </Typography>
                                                                                */}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item md={3}>
                                                                            <LoadingButton 
                                                                                variant="contained" 
                                                                                color="primary"
                                                                                type="button"
                                                                                sx={{py: .6, px: 2, ml: 2}}
                                                                                size="small"

                                                                                onClick={() => revokeMembership(item.role.roleId)}
                                                                                fullWidth
                                                                                loading={sending}
                                                                                disabled={sending}
                                                                            >
                                                                                Revocar
                                                                            </LoadingButton>
                                                                        </Grid>
                                                                    </Grid>
                                                                </li>
                                                            })}
                                                    </ul>
                                                </Box>
                                                :
                                                <Alert sx={{my: 3}} severity="info">
                                                    No ha sido asignada ninguna membresía para este usuario.
                                                </Alert>  
                                                }
                                            </div>

                                            <LoadingButton 
                                                variant="contained" 
                                                color="primary"
                                                type="button"
                                                fullWidth
                                                sx={{py: .9}}
                                                disabled={sending || RoleListByUser.length === 0}
                                                onClick={() => revokeAll()}
                                                loading={sending}
                                                // disabled={textSearchData === "" || !permissions.consulta}
                                            >
                                                Revocar todo
                                            </LoadingButton>
                                        </div>
                                        :
                                        <div>
                                            &nbsp;
                                        </div>  
                                    }

                                </Grid>

                                <Divider orientation="vertical" flexItem />

                                <Grid item xs={12} md={5}>

                                    <Typography variant="h5" align="center" sx={{mb: 3, mt: 2, fontWeight: "bold"}}>
                                        Grupos
                                    </Typography>

                                    {data !== null 
                                        ?
                                        <div>
                                            <List>
                                                {memberships.length > 0 &&
                                                    
                                                        <Scrollbar
                                                            sx={{
                                                                height: 250,
                                                                '& .simplebar-content': { maxHeight: 320 ,height: 250, display: 'flex', flexDirection: 'column' }
                                                            }}
                                                        >
                                                            {memberships.map((role, key) => {
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
                                            <LoadingButton 
                                                variant="contained" 
                                                color="primary"
                                                type="button"
                                                fullWidth
                                                sx={{py: .9, mt:2}}
                                                onClick={() => updateAllData()}
                                                loading={sending}
                                                disabled={sending || (membershipsSelected.length === 0 && membershipsList.length === 0)}
                                            >
                                                Actualizar
                                            </LoadingButton>
                                        </div>
                                        :
                                        <Alert sx={{my: 3}} severity="info">
                                            Seleccione un usuario para ver sus membresías.
                                        </Alert>  
                                    }

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
