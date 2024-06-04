import React, {useState, useEffect} from "react"
import { Box, Grid, Container, Typography, Card, CardContent, Alert, Button, Modal, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from "../../../../auth/fetch"

import { DataGrid } from '@mui/x-data-grid';
import moment from "moment";

// components
import Page from '../../../../components/Page';
import Loader from "../../../../components/Loader/Loader";
import ModalContract from "./modals/contract";
import ModalStore from "./modals/store";
import ChangeStatusStoreModal from "./modals/changeStatusStoreModal";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
};

function AdmTiendas() {
    const [loading, setloading]                 = useState(true);
    const [search, setsearch]                   = useState(true);
    const [sending, setsending]                 = useState(false);

    const [showModalCreate, setshowModalCreate] = useState(false);
    const [showModalStatus, setshowModalStatus] = useState(false);

    const [list, setlist]                       = useState([]);
    const [storeToEdit, setstoreToEdit]         = useState(null);

    const getData = () => {
        const url = '/adMin/SToRE/get/*';
        axios.get(url).then((res) => {

            console.log(res.data);
            const result = res.data.result;
            if(result){
                setlist(res.data.data);
            }

            setloading(false);
            
        }).catch((err) => {
            console.error(err);
        });
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await getData();
            }
        }
    });

    const changeStatusToStore = (storedata) => {
        setstoreToEdit(storedata);
        setshowModalStatus(true);
    }

    const editStore = (storedata) => {
        setstoreToEdit(storedata);
        setshowModalCreate(true);
    }

    let columns = [
        { 
            headerName: `Nombre`,
            field: 'name',     
            flex: 1,
            // minWidth: 120,
            sortable: false,
            renderCell: (cellValues) => {
                let dataItem = cellValues.row.name;
                return dataItem
            },
        },
        { 
            headerName: `Dirección`,
            field: 'address',     
            flex: 1,
            // minWidth: 120,
            sortable: false,
            renderCell: (cellValues) => {
                let dataItem = cellValues.row.address;
                return dataItem
            },
        },
        { 
            headerName: `Rif`,
            field: 'storeTypeId',     
            flex: 1,
            // minWidth: 120,
            sortable: false,
            renderCell: (cellValues) => {
                let dataItem = `${cellValues.row.fiscalInfo.rif.sigla}-${cellValues.row.fiscalInfo.rif.number}`;
                return dataItem
            },
        },
        { 
            headerName: `Status`,
            field: 'isActived',     
            flex: 1,
            // minWidth: 120,
            width: 100,
            maxWidth: 100,
            sortable: false,
            renderCell: (cellValues) => {
                let dataItem = cellValues.row.isActived ? 'Activa' : 'Inactiva';
                return dataItem
            },
        },
        { 
            headerName: ``,   
            field: 'id', 
            flex: 1,
            innerWidth: 400,
            width: 400,
            maxWidth: 400,
            sortable: false,
            renderCell: (cellValues) =>  {
                const id = cellValues.row.id;
                let text = cellValues.row.isActived ? 'Desactivar' : 'Activar';

                return (
                    <>
                        <Button 
                            sx={{mr: 1}}
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            onClick={() => changeStatusToStore(cellValues.row)}
                        >
                            {text}
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            onClick={() => editStore(cellValues.row)}
                        >
                            Editar
                        </Button>
                    </>
                )
            }
        },
    ];

    const resetList = () => {
        setshowModalCreate(false);
        getData();
    }

    console.log(list);

    return (
        <Page title="Contratos | RepuestosGo">
            <Container maxWidth="xl">
                <Box sx={{ pb: 3 }}>
                    <Typography variant="h4" color="white.main">
                        Administración de tiendas
                    </Typography>
                </Box>
                <Grid sx={{ pb: 3 }} item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" alignItems="center" sx={{mb: 3}}>
                                Lista de tiendas
                            </Typography>
                            {!loading ? 
                                <div>
                                    <Box sx={{mb: 2}}>
                                            <Grid container justifyContent="space-between" columnSpacing={3}>
                                                <Grid item md={2} xs={12} sx={{mb: 2}}>
                                                    <Button 
                                                        variant="contained" 
                                                        color="primary" 
                                                        fullWidth 
                                                        onClick={() => {
                                                            setstoreToEdit(null);
                                                            setshowModalCreate(true);
                                                        }}
                                                    >
                                                        Nueva tienda
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box>
                                            {list.length > 0 ?
                                                <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>        
                                                    <DataGrid
                                                        sx={{mb:2}}
                                                        rows={list}
                                                        rowCount={list.length}
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
                                            :
                                                <Alert sx={{mb: 2}} severity="info">
                                                    No existen contratos registrados.
                                                </Alert>
                                            }
                                        </Box>
                                        
                                        {showModalCreate &&
                                            <ModalStore
                                                show={showModalCreate}     
                                                handleShowModal={(show) => setshowModalCreate(show)}    
                                                reset={() => resetList()}
                                                edit={storeToEdit}
                                                // storeId={storeSelected}       
                                            />
                                        }

                                        {showModalStatus &&
                                            <ChangeStatusStoreModal
                                                show={showModalStatus}     
                                                handleShowModal={(show) => setshowModalStatus(show)}    
                                                reset={() => resetList()}
                                                store={storeToEdit}
                                                active={storeToEdit['isActived']}
                                                // storeId={storeSelected}       
                                            />
                                        }
                                </div>
                            :
                                <Loader />
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Container>
        </Page>
    )
}

export default AdmTiendas