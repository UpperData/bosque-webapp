import React, {useState, useEffect} from "react"
import { Box, Grid, Container, Typography, Card, CardContent, Alert, Button, Modal, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from "../../../../auth/fetch"

import { DataGrid } from '@mui/x-data-grid';
import moment from "moment";

// components
import Page from '../../../../components/Page';
import Loader from "../../../../components/Loader/Loader";
import ModalContract from "./modals/contract";
import ChangeStatusContractModal from "./modals/changeStatusContractModal";

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

function Contracts() {

    const [loading, setloading]                 = useState(true);
    const [search, setsearch]                   = useState(true);
    const [sending, setsending]                 = useState(false);

    const [searchStore, setsearchStore]         = useState(false);
    
    const [list, setlist]                       = useState([]);

    const [showModalCreate, setshowModalCreate] = useState(false);
    const [showModalStatus, setshowModalStatus] = useState(false);

    const [storeList, setstoreList]             = useState([]);
    const [storeSelected, setstoreSelected]     = useState(null);
    const [contractToEdit, setcontractToEdit]   = useState(null);

    const validCreation = (storeList.length > 0 && storeList.filter(item => item.isActived === true).length > 0);

    const editContract = (contract) => {
        setcontractToEdit(contract);
        setshowModalCreate(true);
    }

    const changeStatusContract = (contract) => {
        setcontractToEdit(contract);
        setshowModalStatus(true);
    }

    let columns = [
        { 
            field: 'startDate',     
            headerName: `Fecha inicio`,
            flex: 1,
            minWidth: 120,
            sortable: false,
            renderCell: (cellValues) => {
                let dataItem = cellValues.row.startDate;
                return moment(dataItem).format("DD/MM/YYYY")
            },
        },
        { 
            field: 'endDate',     
            headerName: `Fecha fin`,
            flex: 1,
            minWidth: 130,
            sortable: false,
            renderCell: (cellValues) => {
                let dataItem = cellValues.row.endDate;
                return moment(dataItem).format("DD/MM/YYYY")
            },
        },
        { 
            field: 'isActived',     
            headerName: `Status`,
            flex: 1,
            minWidth: 300,
            sortable: false,
            renderCell: (cellValues) => {
                let active = cellValues.row.isActived;
                return active ? 'Activo' : 'Inactivo';
            },
        },
        { 
            headerName: ``,   
            field: 'id', 
            flex: 1,
            width: 150,
            maxWidth: 150,
            sortable: false,
            renderCell: (cellValues) =>  {
                let active  = cellValues.row.isActived;
                let text    = active ? 'Revocar' : 'Activar';

                return <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={() => changeStatusContract(cellValues.row)}
                >
                    {text}
                </Button>
            }
        },
    ];

    const getData = (id) => {
        const url = `/admin/SToRE/CONTRACT/find/${id}`;
        setsearchStore(true);

        axios.get(url).then((res) => {

            if(res.data.result){
                console.log('=============');
                console.log(res.data);
                setlist(res.data.data);
            }

            setsearchStore(false);

        }).catch((err) => {
            console.log(err);
            setsearchStore(false);
        });
    }

    const resetList = () => {
        setshowModalCreate(false);
        getData(storeSelected);
    }

    const selectStore = (store) => {
        if(store){
            console.log('STORE', store);
            setstoreSelected(store);
            getData(store);
        }else{
            setstoreSelected(null);
        }
    }

    const getStoresList = () => {
        const url = '/adMin/SToRE/get/*';
        axios.get(url).then((res) => {

            console.log(res.data);
            if(res.data.result){
                setstoreList(res.data.data);
                setsearch(false);
                setloading(false);
            }

        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await getStoresList();
            }
        }
    })

    return (
        <Page title="Contratos | RepuestosGo">
            <Container maxWidth="xl">
                <Box sx={{ pb: 3 }}>
                    <Typography variant="h4" color="white.main">
                        Contratos
                    </Typography>
                </Box>
                <Grid sx={{ pb: 3 }} item xs={12}>
                    <Card>
                        {!loading ? 
                            <CardContent>
                                <Typography variant="h5" alignItems="center" sx={{mb: 3}}>
                                    Historial de contratos
                                </Typography>
                                <FormControl fullWidth size="small" sx={{mb:2}}>
                                    <InputLabel id="demo-simple-select-autowidth-label">
                                        Seleccione una tienda
                                    </InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="tienda-select-autowidth-label"
                                        id="tienda-select-autowidth"
                                        value={storeSelected}
                                        onChange={(e) => selectStore(e.target.value)}
                                        label="Seleccione una tienda"
                                        MenuProps={MenuProps}
                                    >
                                        {storeList.map((item, key) => {
                                            let dataItem = item;
                                            return <MenuItem 
                                                key={key} 
                                                value={dataItem.id}
                                            >
                                                {dataItem.name}
                                            </MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                {storeSelected &&
                                    <>
                                        <Box sx={{mb: 2}}>
                                            {validCreation &&
                                                <Grid container justifyContent="space-between" columnSpacing={3}>
                                                    <Grid item md={2} xs={12} sx={{mb: 2}}>
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary" 
                                                            fullWidth 
                                                            onClick={() => setshowModalCreate(true)}
                                                        >
                                                            Nuevo contrato
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            }
                                        </Box>
                                        {!searchStore ?
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
                                        :
                                            <Loader />
                                        }
                                    </>
                                }
                            </CardContent>
                        :
                            <Loader />
                        }
                    </Card>
                </Grid>

                {showModalCreate &&
                    <ModalContract 
                        show={showModalCreate}     
                        handleShowModal={(show) => setshowModalCreate(show)}    
                        storeId={storeSelected} 
                        reset={() => resetList()}    
                        edit={contractToEdit}  
                    />
                }

                {showModalStatus &&
                    <ChangeStatusContractModal 
                        show={showModalStatus}     
                        handleShowModal={(show) => {
                            setshowModalStatus(show);
                            setcontractToEdit(null);
                        }}    
                        storeId={storeSelected} 
                        reset={() => resetList()}    
                        edit={contractToEdit}  
                        active={contractToEdit.isActived}
                    />
                }
            </Container>
        </Page>
    );
}

export default Contracts;