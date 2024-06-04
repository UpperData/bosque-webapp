import React, {useState, useRef} from 'react'
import { Card, CardContent, Hidden, Box, Typography, Container, Alert, Grid, Stack, TextField, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Page from '../../../../components/Page';
import { useSelector } from "react-redux";
import DepartmentsSelect from '../../../../components/selects/Departments';
import axios from '../../../../auth/fetch';
import SubDepartmentsSelect from '../../../../components/selects/SubDepartments';
import CargoSelect from '../../../../components/selects/Cargo';

function Cargos() {

    const [sending, setsending]                         = useState(false);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const [selectedDirection, setselectedDirection]     = useState("");
    const [selectedDepartment, setselectedDepartment]   = useState("");
    const [selectedCargo, setselectedCargo]             = useState("");

    const [direction, setdirection]                     = useState("");
    const [department, setdepartment]                   = useState("");
    const [cargo, setcargo]                             = useState("");

    const [resetDirection,  setresetDirection]          = useState(false);
    const [resetDepartment, setresetDepartment]         = useState(false);
    const [resetCargo,      setresetCargo]              = useState(false);

    const cancelReset = async (type) => {
        if(type === "direction"){
            setresetDirection(false);
        }

        if(type === "department"){
            setresetDepartment(false);
        }

        if(type === "cargo"){
            setresetCargo(false);
        }
    }

    const urlCreateDirection                            = "/DePT/NEW/";
    const urlUpdateDirection                            = "/DEpT/UPdate/";
    const urlCreateDepartment                           = "/DePT/sub/NEW/";
    const urlUpdateDepartment                           = "/DEpT/sub/UPdate/";
    const urlCreateCargo                                = "/DePT/sub/Cargo/NEW/";
    const urlUpdateCargo                                = "/DEpT/sub/Cargo/UPdate/";

    const goToCreate = (type) => {
        let url = "";
        let data = {};

        switch (type) {
            case "direction":
                url = urlCreateDirection;
                data = {
                    name: direction
                };
                    
                break;

            case "department":
                url = urlCreateDepartment;
                data = {
                    departamentId:  selectedDirection,
                    name:           department
                };
                break;

            case "cargo":
                url = urlCreateCargo;
                data = {
                    departamentId:  selectedDirection,
                    name:           cargo
                };
                break;
        
            default:
                url = "";
                break;
        }

        setsending(true);
        setalertSuccessMessage("");
        setalertErrorMessage("");

        axios({
            url,
            method: "post",
            data
        }).then((res) => {
            console.log(res);
            if(res.data.result){
                setalertSuccessMessage(res.data.message);
                setsending(false);

                setdirection("");
                setdepartment("");
                setcargo("");

                switch (type) {
                    case "direction":
                        setresetDirection(true);
                        break;
                
                    case "department":
                        setresetDepartment(true);
                        break;

                    case "cargo":
                        setresetCargo(true);
                        break;

                    default:
                        setresetDirection(true);
                        setresetDepartment(true);
                        setresetCargo(true);
                        break;
                }

                setTimeout(() => {
                    setalertSuccessMessage("");
                }, 5000);
            }
        }).catch((err) => {
            console.error(err);
            setsending(false);
        });
    }

    const goToUpdate = (type) => {
        let url = "";
        let data = {};

        switch (type) {
            case "direction":
                url = urlUpdateDirection;
                data = {
                    id:   selectedDirection,
                    name: direction
                };
                    
                break;

            case "department":
                url = urlUpdateDepartment;
                data = {
                    id:   selectedDepartment,
                    name: department
                };
                break;

            case "cargo":
                url = urlUpdateCargo;
                data = {
                    id:   selectedCargo,
                    name: cargo
                };
                break;
        
            default:
                url = "";
                break;
        }

        setsending(true);
        setalertSuccessMessage("");
        setalertErrorMessage("");

        axios({
            url,
            method: "put",
            data
        }).then((res) => {
            console.log(res.data);
            if(res.data.result){
                setalertSuccessMessage(res.data.message);
                setsending(false);

                setdirection("");
                setdepartment("");
                setcargo("");

                switch (type) {
                    case "direction":
                        setresetDirection(true);
                        break;
                
                    case "department":
                        setresetDepartment(true);
                        break;

                    case "cargo":
                        setresetCargo(true);
                        break;

                    default:
                        setresetDirection(true);
                        setresetDepartment(true);
                        setresetCargo(true);
                        break;
                }

                setTimeout(() => {
                    setalertSuccessMessage("");
                }, 5000);
            }
        }).catch((err) => {
            console.error(err);
            setsending(false);
        });
    }

    return (
        <Page title="Cargos | Cema">
            <Container maxWidth="xl">
                <Box sx={{ pb: 3 }}>
                    <Typography variant="h4">
                        Dependencias y cargos
                    </Typography>
                </Box>
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

                        <Typography variant="h6">
                            Dirección
                        </Typography>
                        
                        <Grid container columnSpacing={3}>
                            <Grid item xs={12} md={6} sx={{my: 2}}>
                                <Stack sx={{mb: 2}}>
                                    <DepartmentsSelect 
                                        disabled={sending}
                                        reset={resetDirection} 
                                        cancelReset={() => cancelReset("direction")}
                                        value={selectedDirection} 
                                        onChange={(value) => setselectedDirection(value)} 
                                    />
                                </Stack>
                                <Stack>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        autoComplete="Dirección"
                                        type="text"
                                        value={direction}
                                        onChange={(e) => setdirection(e.target.value)}
                                        disabled={sending}
                                        // label="Descripción"
                                        // multiline
                                        // minRows={4}
                                        // maxRows={6}
                                        // {...getFieldProps('description')}
                                        // error={Boolean(touched.description && errors.description)}
                                        // helperText={touched.description && errors.description}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={3} sx={{my: 2}}>
                                <Grid container columnSpacing={3}>
                                    <Grid item md={12} xs={6}>
                                        <LoadingButton
                                            size="small"
                                            variant="contained"
                                            loading={sending}
                                            color="primary" 
                                            fullWidth
                                            disabled={(direction === "" || direction.length < 5) || selectedDirection === ""}
                                            onClick={() => goToUpdate("direction")}
                                            sx={{py: 1.1, mb: 2}}
                                        >
                                            Actualizar
                                        </LoadingButton>
                                    </Grid>
                                
                                    <Grid item md={12} xs={6}>
                                        <LoadingButton
                                            size="small"
                                            variant="contained"
                                            fullWidth
                                            loading={sending}
                                            color="primary" 
                                            onClick={() => goToCreate("direction")}
                                            sx={{py: 1.1}}
                                            disabled={direction === "" || direction.length < 5}
                                        >
                                            Crear
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Divider sx={{mb: 2}} />

                        <Typography variant="h6">
                            Departamento
                        </Typography>
                        
                        <Grid container columnSpacing={3}>
                            <Grid item xs={12} md={6} sx={{my: 2}}>
                                <Stack sx={{mb: 2}}>
                                    <SubDepartmentsSelect 
                                        id={selectedDirection}
                                        disabled={sending}
                                        reset={resetDepartment} 
                                        cancelReset={() => cancelReset("department")}
                                        value={selectedDepartment} 
                                        onChange={(value) => setselectedDepartment(value)} 
                                    />
                                </Stack>
                                <Stack>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        autoComplete="Department"
                                        type="text"
                                        value={department}
                                        onChange={(e) => setdepartment(e.target.value)}
                                        disabled={sending || selectedDirection === ""}
                                        // label="Descripción"
                                        // multiline
                                        // minRows={4}
                                        // maxRows={6}
                                        // {...getFieldProps('description')}
                                        // error={Boolean(touched.description && errors.description)}
                                        // helperText={touched.description && errors.description}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={3} sx={{my: 2}}>
                                <Grid container columnSpacing={3}>
                                    <Grid item md={12} xs={6}>
                                        <LoadingButton
                                            size="small"
                                            variant="contained"
                                            loading={sending}
                                            color="primary" 
                                            fullWidth
                                            disabled={(department === "" || department.length < 5) || selectedDirection === "" || selectedDepartment === "" || selectedDepartment === null}
                                            onClick={() => goToUpdate("department")}
                                            sx={{py: 1.1, mb: 2}}
                                        >
                                            Actualizar
                                        </LoadingButton>
                                    </Grid>
                                
                                    <Grid item md={12} xs={6}>
                                        <LoadingButton
                                            size="small"
                                            variant="contained"
                                            fullWidth
                                            loading={sending}
                                            color="primary" 
                                            onClick={() => goToCreate("department")}
                                            sx={{py: 1.1}}
                                            disabled={department === "" || department.length < 5 || selectedDirection === ""}
                                        >
                                            Crear
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Divider sx={{mb: 2}} />

                        <Typography variant="h6">
                            Cargo
                        </Typography>
                        
                        <Grid container columnSpacing={3}>
                            <Grid item xs={12} md={6} sx={{my: 2}}>
                                <Stack sx={{mb: 2}}>
                                    <CargoSelect 
                                        id={selectedDirection}
                                        disabled={sending}
                                        reset={resetCargo} 
                                        cancelReset={() => cancelReset("cargo")}
                                        value={selectedCargo} 
                                        onChange={(value) => setselectedCargo(value)} 
                                    />
                                </Stack>
                                <Stack>
                                    <TextField
                                        size='small'
                                        fullWidth
                                        autoComplete="Cargo"
                                        type="text"
                                        value={cargo}
                                        onChange={(e) => setcargo(e.target.value)}
                                        disabled={sending || selectedDirection === "" || selectedDepartment === ""}
                                        // label="Descripción"
                                        // multiline
                                        // minRows={4}
                                        // maxRows={6}
                                        // {...getFieldProps('description')}
                                        // error={Boolean(touched.description && errors.description)}
                                        // helperText={touched.description && errors.description}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={3} sx={{my: 2}}>
                                <Grid container columnSpacing={3}>
                                    <Grid item md={12} xs={6}>
                                        <LoadingButton
                                            size="small"
                                            variant="contained"
                                            loading={sending}
                                            color="primary" 
                                            fullWidth
                                            disabled={(cargo === "" || cargo.length < 5) || selectedDirection === "" || selectedDepartment === "" || selectedCargo === "" || selectedDepartment === null}
                                            onClick={() => goToUpdate("cargo")}
                                            sx={{py: 1.1, mb: 2}}
                                        >
                                            Actualizar
                                        </LoadingButton>
                                    </Grid>
                                
                                    <Grid item md={12} xs={6}>
                                        <LoadingButton
                                            size="small"
                                            variant="contained"
                                            fullWidth
                                            loading={sending}
                                            color="primary" 
                                            onClick={() => goToCreate("cargo")}
                                            sx={{py: 1.1}}
                                            disabled={cargo === "" || cargo.length < 5 || selectedDepartment === "" || selectedDirection === ""}
                                        >
                                            Crear
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Page>
    );
}

export default Cargos