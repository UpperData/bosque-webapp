// material
import {useState} from "react"
import { Box, Grid, Container, CardContent, Avatar, Typography, Card, Button, Modal, TextField, Tab, Divider, List, ListItemText, ListItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { alpha, styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// components
import Page from '../../../../components/Page';
import { useSelector } from "react-redux";

export default function Perfil() {

    const userData = useSelector(state => state.session.userData.data);
    let dataPeople = userData.people;
    console.log(userData);

    let photoURL = "";
    if(userData.people && (userData.people.photo !== null && userData.people.photo !== "")){
        photoURL = `data:image/png;base64, ${userData.people.photo}`;
    }else if(userData.people && (userData.people.document.gender === "H")){
        photoURL = "/assets/svgimg/user-circle.svg";
    }else if(userData.people && (userData.people.document.gender === "M")){
        photoURL = "/assets/svgimg/user-circle.svg";
    }else{
        photoURL = "/assets/svgimg/user-circle.svg";
    }

    return (
        <Page title="Perfil | Bosque Marino">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4" color="white.main">
                    Perfil
                </Typography>
            </Box>

            <Grid container columnSpacing={3}>
                <Grid sx={{ pb: 3 }} item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            {dataPeople ?
                                <Avatar
                                    alt={dataPeople.firstName ? (dataPeople.firstName+" "+dataPeople.lastName) : "photo"}
                                    src={photoURL}
                                    sx={{ width: 200, height: 200, margin: "auto" }}
                                />
                                :
                                <Avatar
                                    // alt={dataPeople.firstName ? (dataPeople.firstName+" "+dataPeople.lastName) : "photo"}
                                    src="/assets/svgimg/user-circle.svg"
                                    sx={{ width: 200, height: 200, margin: "auto" }}
                                />
                            }
                        </CardContent>
                    </Card>
                </Grid>

                <Grid sx={{ pb: 3 }} item xs={12} md={8}>

                    <Card>
                        <CardContent>
                            {dataPeople &&
                                <Typography variant="h3" sx={{mb: 0}}>
                                    {dataPeople.firstName ? (dataPeople.firstName+" "+dataPeople.lastName) : userData.account.name}
                                </Typography>
                            }
                            <Typography variant="h6" color="text.secondary" sx={{mb: 0}}>
                                <Typography color="primary" variant="span" sx={{mr: 1}}>
                                <i className="mdi mdi-email" />
                            </Typography> ({userData.account.email})
                            </Typography>

                            <Box sx={{py: 1}} />
                            <Divider />
                            <Box sx={{py: 1}} />
                            {dataPeople &&
                                <>
                                    {dataPeople.document.hasOwnProperty("birthday") &&
                                        <Typography variant="h6">
                                            Fecha de nacimiento: 
                                            <Typography color="primary" variant="span" sx={{mx: 1}}>
                                                <i className="mdi mdi-cake-variant-outline" />
                                            </Typography>
                                            {dataPeople.document.hasOwnProperty("birthday") ? dataPeople.document.birthday.split("T")[0] : ""}
                                        </Typography>
                                    }
                                    <Typography variant="h6">
                                        Género: 
                                        {dataPeople.document.gender === "H" ?
                                            <span><Typography color="primary" variant="span" sx={{mx: 1}}><i className="mdi mdi-human-male" /></Typography>Hombre</span>
                                        :
                                            <span><Typography color="primary" variant="span" sx={{mx: 1}}><i className="mdi mdi-human-female" /></Typography>Mujer</span>
                                        }
                                    </Typography>
                                    
                                    <Typography variant="h6">
                                        Documento de identificación:
                                        <Typography color="primary" variant="span" sx={{mx: 1}}>
                                            <i className="mdi mdi-card-account-details-outline" />
                                        </Typography>
                                        {dataPeople.document.nationality.toLowerCase()} - {dataPeople.document.hasOwnProperty("number") ? dataPeople.document.number : dataPeople.document.numbre}
                                    </Typography>
                                </>
                            }
                        </CardContent>
                    </Card>

                    <Card sx={{mt: 3}}>
                        <CardContent>
                            <Typography variant="h5" sx={{mb: 0}}>
                                Roles de trabajo:
                            </Typography>

                            <List>
                                {userData.role.map((role, key) => <ListItem color="primary" key={key} >
                                        <ListItemText color="primary" primary={"- "+role.name} />
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
        </Page>
    );
}
