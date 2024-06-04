import React, {useState, useEffect} from "react"
import { Box, Grid, Container, Typography, Card, CardContent, Alert, Button, Modal, TextField } from '@mui/material';
import axios from "../../../../auth/fetch"

import { DataGrid } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import moment from "moment";

// components
import Page from '../../../../components/Page';
import Loader from "../../../../components/Loader/Loader";

const style = {
    width: "95%",
    margin: "auto",
    maxWidth: "500px",
    backgroundColor: "#fff",
    userSelect: "none",
    boxShadow: 'none',
    textAlign: 'center',
};

function AccountGroups() {

    const [loading, setloading]             = useState(true);
    const [search, setsearch]               = useState(true);
    const [sending, setsending]             = useState(false);

    const [textSearch, settextSearch]       = useState("");
    const [data, setdata]                   = useState([]);
    const [list, setlist]                   = useState([]);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const [nameNewGroup, setnameNewGroup]   = useState("");

    const [showModalCreate, setshowModalCreate] = useState(false);

    const urlGet            = "/front/Role/get/";
    const urlCreateNewRole  = "/admin/rOle/CREATE";
    const urlUpdateNewRole  = "/adMin/rOLE/updatE";

    const addGroup = () => {
        if(nameNewGroup !== ""){
            let dataPost = {
                name: nameNewGroup,
                isActived: true
            }

            setsending(true);
            setalertSuccessMessage("");
            setalertErrorMessage("");

            axios({
                method: "post",
                data:   dataPost,
                url: urlCreateNewRole
            }).then((res) => {
                if(res.data.result){
                    setalertSuccessMessage(res.data.message);
                    setsending(false);
                    setnameNewGroup("");
                    setshowModalCreate(false);
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

    const getData = () => {
        axios.get(urlGet+"*")
        .then((res) => {
            if(res.data.result){
                console.log(res.data.data);
                setdata(res.data.data);
                setlist(res.data.data);
                settextSearch("");
                setloading(false);
            }
        }).catch((err) => {
            let error = err.response; 
        });
    }

    const filterData = (text) => {
        let actualList = [...list];
        settextSearch(text);

        if(text !== "" && text.length > 0){
            let searchItems = actualList.filter(item => item.name.toString().toLowerCase().includes(text.toLowerCase()));
            setlist(searchItems);
        }else{
            setlist(data);
        }
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await getData();
            }
        }
    }, []);

    const editItemData = (itemData) => {

        let data = {
            id:         itemData.id,
            name:       itemData.name
        }

        setsending(true);
        setalertSuccessMessage("");

        axios({
            method: "PUT",
            url:    urlUpdateNewRole,
            data
        }
            // config
        ).then((res) => {

            setsending(false);
            setalertSuccessMessage(res.data.message);
            setTimeout(() => {
                setalertSuccessMessage("");
            }, 2000);

        }).catch((err) => {
            let fetchError = err;
        });
    }

    const handleCellEditStop = (params) => {
        // console.log(params);
        let dataBeforeEdit = params.row;
        if(dataBeforeEdit[params.field] !== params.value){

            console.log("Edit");
            console.log(dataBeforeEdit);

            // ------------------Edit-------------------------
            dataBeforeEdit[params.field] = params.value;
            let dataToEdit = dataBeforeEdit;
            editItemData(dataToEdit);
        }
    };

    let columns = [
        { 
            field: 'id',          
            headerName: '#', 
            width: 70,
            sortable: false,
        },
        { 
            field: 'name',     
            headerName: `Nombre`,
            flex: 1,
            editable: true,
            minWidth: 300,
            sortable: false,
        },
        { 
            field: 'createdAt',     
            headerName: `Creación`,
            flex: 1,
            minWidth: 120,
            sortable: false,
            renderCell: (cellValues) => {
                let dataItem = cellValues.row.createdAt;
                return moment(dataItem).format("DD/MM/YYYY")
            },
        },
        { 
            field: 'updatedAt',     
            headerName: `Modificación`,
            flex: 1,
            minWidth: 130,
            sortable: false,
            renderCell: (cellValues) => {
                let dataItem = cellValues.row.updatedAt;
                return moment(dataItem).format("DD/MM/YYYY")
            },
        }
    ];

    return (
        <Page title="Grupos de usuario | RepuestosGo">
            <Container maxWidth="xl">
                <Box sx={{ pb: 3 }}>
                    <Typography variant="h4" color="white.main">
                        Grupos de usuario
                    </Typography>
                </Box>

                <Grid sx={{ pb: 3 }} item xs={12}>
                    {!loading ?
                        <Card>
                            <Modal
                                open={showModalCreate}
                                onClose={() => setshowModalCreate(false)}
                                aria-labelledby="modal-cancel-bill-title"
                                aria-describedby="modal-cancel-bill-description"
                                style={{ 
                                    display:'flex', 
                                    alignItems:'center', 
                                    justifyContent:'center' 
                                }}
                            >
                                <Box sx={{...style, p: 5, borderRadius: 2}}>
                                    <Typography variant="h5" alignItems="center" sx={{mb: 3}}>
                                        Nuevo grupo
                                    </Typography>
                                    <div>

                                        <div>

                                            <Grid container columnSpacing={3}>
                                                <Grid item md={12} xs={12} sx={{mb: 2}}>
                                                    <TextField
                                                        label="Nombre del grupo"
                                                        size="small"
                                                        fullWidth
                                                        // placeholder="Nombre del grupo"
                                                        value={nameNewGroup}
                                                        onChange={(e) => setnameNewGroup(e.target.value)}
                                                        // disabled={search}
                                                    />
                                                </Grid>
                                            </Grid>

                                        </div>

                                        <LoadingButton 
                                            variant="contained" 
                                            color="primary"
                                            type="button"
                                            sx={{pmx: 1, py: 1.5}}
                                            onClick={() => addGroup()}
                                            loading={sending}
                                            disabled={nameNewGroup === "" || nameNewGroup.length <= 5}
                                        >
                                            Guardar
                                        </LoadingButton>
                                        <Button 
                                            disabled={sending} 
                                            size="large" 
                                            sx={{mx: 1}} 
                                            onClick={() => setshowModalCreate(false)}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </Box>
                            </Modal>

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

                                <Box sx={{mb: 2}}>

                                    <Grid container justifyContent="space-between" columnSpacing={3}>
                                        <Grid item md={2} xs={12} sx={{mb: 2}}>
                                            <Button variant="contained" color="primary" fullWidth onClick={() => setshowModalCreate(true)}>
                                                Nuevo
                                            </Button>
                                        </Grid>
                                        <Grid item md={4} xs={12} sx={{mb: 2}}>
                                            <TextField
                                                label="Buscar grupo"
                                                size="small"
                                                fullWidth
                                                // placeholder="Nombre del grupo"
                                                value={textSearch}
                                                onChange={(e) => filterData(e.target.value)}
                                                // disabled={search}
                                            />
                                        </Grid>
                                    </Grid>

                                </Box>

                                <Typography component="p" alignItems="center" sx={{mb: 3}}>
                                    Puede editar el nombre de un grupo haciendo click sobre el.
                                </Typography>

                                {data.length > 0
                                ?
                                    <Box>
                                        <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>        
                                            <DataGrid
                                                sx={{mb:2}}
                                                rows={list}
                                                rowCount={list.length}
                                                columns={columns}

                                                onCellEditCommit={(params) => handleCellEditStop(params)}

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
                                        No existen grupos de usuario registrados.
                                    </Alert>
                                }
                            </CardContent>
                        </Card>
                    :    
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

export default AccountGroups