import React, {useState, useEffect} from "react"
import { Box, Grid, Container, Typography, Card, CardContent, Alert, Button, Modal, TextField } from '@mui/material';
import axios from "../../../../auth/fetch"

import { DataGrid } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import moment from "moment";

// components
import Page from '../../../../components/Page';
import Loader from "../../../../components/Loader/Loader";

function CurrencyExchange() {

    const [loading, setloading]             = useState(true);
    const [search, setsearch]               = useState(true);
    const [sending, setsending]             = useState(false);

    const [data, setdata]                   = useState([]);
    const [currentType, setcurrentType]     = useState(null);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const [newValue, setNewValue] = useState("");

    const urlGet                        =  "/change/Type/get/";
    const urlGetCurrentCurrencyChange   =  "/change/Type/current";
    const urlAdd                        = "/change/Type/add";

    const getData = () => {
        axios.get(urlGet+"*")
        .then((res) => {
            if(res.data.result){
                // console.log(res.data.data);
                setdata(res.data.data);

                axios.get(urlGetCurrentCurrencyChange)
                .then((res) => {
                    if(res.data.result){
                        // console.log(res.data.data);
                        setcurrentType(res.data.data);
                        setloading(false);
                    }
                }).catch((err) => {
                    let error = err.response; 
                });
            }
        }).catch((err) => {
            let error = err.response; 
        });
    }

    const addItem = () => {
        if(newValue !== ""){
            let dataPost = {
                value: newValue.toString()
            }

            setsending(true);
            setalertSuccessMessage("");
            setalertErrorMessage("");

            axios({
                method: "post",
                data:   dataPost,
                url:    urlAdd
            }).then((res) => {
                if(res.data.result){

                    setalertSuccessMessage(res.data.message);
                    setsending(false);
                    setNewValue("");
                    getData();

                    setTimeout(() => {
                        setalertSuccessMessage("");
                        setalertErrorMessage("");
                    }, 5000);

                }
            }).catch((err) => {
                console.error(err);
                setsending(false);
            });
        }else{
            setalertErrorMessage("Debe ingresar un nombre para crear un nuevo grupo");
        }
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await getData();
            }
        }
    }, []);

    let columns = [
        { 
            field: 'id',          
            headerName: '#', 
            width: 50,
            sortable: true,
        },
        { 
            field: 'value',     
            headerName: `Valor de cambio`,
            // flex: 1,
            minWidth: 200,
            sortable: false,
            renderCell: (cellValues) => {
                let dataItem = cellValues.row.value;
                return <span>Bs. <Typography variant="span" sx={{fontWeight: "bold"}}>{dataItem}</Typography></span>
            }
        },
        { 
            field: 'createdAt',     
            headerName: `Fecha`,
            // flex: 1,
            minWidth: 300,
            sortable: true,
            renderCell: (cellValues) => {
                let dataItem = cellValues.row.createdAt;
                return moment(dataItem).format("DD/MM/YYYY")
            }
        }
    ];

    return (
        <Page title="Tipo de Cambio | RepuestosGo">
            <Container maxWidth="xl">
                <Box sx={{ pb: 3 }}>
                    <Typography variant="h4" color="white.main">
                        Tipo de Cambio
                    </Typography>
                </Box>
                
                {!loading ?
                    <Grid sx={{ pb: 3 }} item xs={12}>
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

                                <div>

                                    <Box sx={{mb: 2}}>
                                        <Grid alignItems="center" justifyContent="space-between" container columnSpacing={3}>
                                            <Grid item md={6} xs={12}>
                                                <Grid container columnSpacing={3}>
                                                    <Grid item md={8} xs={12} sx={{mb: 2}}>
                                                        <TextField
                                                            label="Valor"
                                                            size="small"
                                                            fullWidth
                                                            placeholder="Nuevo valor"
                                                            type="number"
                                                            value={newValue}
                                                            onChange={(e) => setNewValue(e.target.value)}
                                                            disabled={sending}
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={12} sx={{mb: 2}}>
                                                        <LoadingButton 
                                                            variant="contained" 
                                                            color="primary"
                                                            type="button"
                                                            fullWidth
                                                            onClick={() => addItem()}
                                                            loading={sending}
                                                            disabled={newValue === ""}
                                                        >
                                                            Guardar
                                                        </LoadingButton>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item md={5} xs={12} sx={{mb: 2}}>
                                                <Typography align="center" component="h2" variant="h2" sx={{fontWeight: "bold", mb: 0}}>
                                                    Bs. {currentType !== null ? currentType.value : ""}
                                                </Typography>
                                                <Typography align="center" component="h2" variant="h5" sx={{fontWeight: "bold", mb: 0}}>
                                                    Cambio actual
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {data.length > 0
                                    ?
                                        <Box>
                                            <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>        
                                                <DataGrid
                                                    sx={{mb:2}}
                                                    rows={data}
                                                    rowCount={data.length}
                                                    columns={columns}

                                                    // page={0}
                                                    pageSize={10}
                                                    rowsPerPageOptions={[10,20,30]}
                                                    // autoPageSize

                                                    disableColumnFilter
                                                    disableColumnMenu
                                                    autoHeight 
                                                    disableColumnSelector
                                                    disableSelectionOnClick
                                                    // checkboxSelection
                                                />

                                            </div>
                                        </Box>
                                    :
                                        <Alert sx={{mb: 2}} severity="info">
                                            Sin registros encontrados
                                        </Alert>
                                    }
                                </div>

                            </CardContent>
                        </Card>
                    </Grid>
                    :
                    <Grid sx={{ pb: 3 }} item xs={12}>
                        <Card>
                            <CardContent>
                                <Loader />
                            </CardContent>
                        </Card>
                    </Grid>
                }
            </Container>
        </Page>
    );

}

export default CurrencyExchange