import {useState, useEffect} from "react"
// material
import { Box, Grid, Container, Typography,Alert,  Card, CardContent, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import { alpha, styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// components
import Page from '../../../../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../../../../components/_dashboard/app';

import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 5),
    width: "95%",
    margin: "auto",
    maxWidth: "600px",
    backgroundColor: "#fff",
}));

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

function Permissions() {

    // const [data, setdata]               = useState(rows);
    const [count, setcount]             = useState(0);

    const [loading, setloading]         = useState(true);
    const [search, setsearch]           = useState(true);
    const [data, setdata]               = useState(null);

    const [modules, setmodules]         = useState(null);
    const [groups, setgroups]           = useState(null);

    const [module, setmodule]           = useState("");
    const [group,  setgroup]            = useState("");

    const [tasks, settasks]             = useState(null);
    const [searchTasks, setsearchTasks] = useState(false);

    const [openSaveChanges, setopenSaveChanges] = useState(false);
    const [sending, setsending]                 = useState(false);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const urlGetModules     = "/froNT/ModUle/GeT/*";
    const urlGetGroups      = "/front/Role/get/*";
    const urlGetTasks       = "/aDmIn/MoDuLe/submodUle/";

    function changePermission (id, permission, isChecked) {
        
        // console.log(id,permission, isChecked);        
        let thisGroup = data.find(item => item.id === id);
        let index     = data.indexOf(thisGroup);
        thisGroup.permissions[permission].active = isChecked;
        let newTable    =  [...data];
        newTable[index] = thisGroup;
        // console.log(thisGroup);
        setdata(data);
        setcount(count + 1);
    }

    const changeModule = async (idModule) => {
        setmodule(idModule);
        settasks(null);
        setsearchTasks(true);
       
        axios.get(urlGetTasks+idModule)
        .then(async (res) => {

            let dataTasks = res.data.data;
            console.log(dataTasks);

            settasks(dataTasks);
            let subModules = dataTasks[0].subModules;
            let dataItems = [];

            for (let i = 0; i < subModules.length; i++) {
                const subModule = subModules[i];

                let newModule           = {};
                newModule.id            = subModule.subModuleId;
                newModule.name          = subModule.name;
                newModule.permissions   = {};
                // newModule.permissions   = [];

                let urlGetPermissions = `/admin/PERMISSION/end/${group}/${idModule}/${subModule.subModuleId}`;
                axios.get(urlGetPermissions)
                .then((res) => {

                   // console.log(res.data);
                    let permissionsList = res.data.data;

                    for (let j = 0; j < permissionsList.length; j++) {
                        const permission            = permissionsList[j];
                        let formatPermission        = {};

                        formatPermission.id         = permission.permissionId;
                        formatPermission.name       = permission.permission.operation.name;
                        formatPermission.active     = permission.isActived;

                        newModule.permissions[formatPermission.name.toLowerCase()] = formatPermission;
                    
                    }

                    dataItems.push(newModule);

                    if(dataItems.length === subModules.length){
                        // console.log(dataItems);
                        setdata(dataItems);
                        setsearchTasks(false);
                    }

                }).catch((err) => {
                    console.log(err)
                    let error = err.response; 
                });  
            }
        }).catch((err) => {
            console.log(err)
            let error = err.response; 
        });
    }

    const changeGroup = (idGroup) => {
        setgroup(idGroup);
        setmodule("");
        settasks(null);
        setdata(null);
    }

    const getSelects = async () => {
        axios.get(urlGetGroups)
        .then((res) => {

            // console.log("-----");
            // console.log(res.data.data);
            let dataGroups = res.data.data;

            if(res.data.result){
                axios.get(urlGetModules)
                .then((res) => {
        
                    // console.log("-----");
                    // console.log(res.data.data);

                    setgroups(dataGroups);
                    setmodules(res.data.data);
                    setloading(false);
        
                }).catch((err) => {
                    let error = err.response; 
                });
            }

        }).catch((err) => {
            let error = err.response; 
        });
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await getSelects();
            }
        }
    });

    let moduleName  = "";
    let groupName   = "";

    if(module !== "" && modules.length > 0){
        let getModule = modules.find(item => Number(item.id) === Number(module));
        // console.log(getModule);
        moduleName = getModule.name;
    }

    if(group !== "" && groups.length > 0){
        let getGroup = groups.find(item => Number(item.id) === Number(group));
        // console.log(getGroup);
        groupName = getGroup.name;
    }

    let columns = [
        // { field: 'id',          headerName: 'ID', width: 70 },
        { 
            field: 'name',     
            headerName: `Tareas para modulo: ${moduleName}`,
            width: 300,
            renderCell: (cellValues) => {
                let data = cellValues;
                // console.log(data);
                return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                    {data.row.name}
                </Typography>
            }
        },
         { 
            field: 'permissions.crea',    
            headerName: 'Crea',
            sortable: false,
            // width: 300,
            renderCell: (cellValues) => {
                let data = cellValues;
                let ischecked = data.row.permissions.crea.active;
                return <Checkbox onChange={() => changePermission(data.row.id, "Crea", !ischecked)} checked={ischecked} />
            }
        },
         { 
            field: 'permissions.edita',    
            headerName: 'Edita',
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                let ischecked = data.row.permissions.edita.active;
                return <Checkbox onChange={() => changePermission(data.row.id, "Edita", !ischecked)} checked={ischecked} />
            }
            // width: 300
        },
         { 
            field: 'permissions.ver',    
            headerName: 'Ver',
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                let ischecked = data.row.permissions.ver.active;
                return <Checkbox onChange={() => changePermission(data.row.id, "Ver", !ischecked)} checked={ischecked} />
            }
            // width: 300
        }, 
        /* { 
            field: 'permissions.imprime',    
            headerName: 'Imprime',
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                let ischecked = data.row.permissions.imprime.active;
                return <Checkbox onChange={() => changePermission(data.row.id, "Imprime", !ischecked)} checked={ischecked} />
            }
            // width: 300
        },
         { 
            field: 'permissions.referencia',    
            headerName: 'Referencia',
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                let ischecked = data.row.permissions.referencia.active;
                return <Checkbox onChange={() => changePermission(data.row.id, "Referencia", !ischecked)} checked={ischecked} />
            }
            // width: 300
        } */
    ];
    console.log("////////////////////////////////////////////")
    console.log(columns)
    console.log("////////////////////////////////////////////")
    const handleCloseModalSaveChanges = () => {
        setopenSaveChanges(false);
    }

    const savePermissions = () => {
        setsending(true);
        let urlSavePermissions = "/AdmIn/grANTROle/adD";

        let formatPermissions = [];
        for (let i = 0; i < data.length; i++) {
            const task = data[i];
            let taskpermissions = task.permissions;

            Object.keys(taskpermissions).forEach((key) => {
                let newPermission   =       {};
                newPermission.id    =       taskpermissions[key].id;
                newPermission.isActived =   taskpermissions[key].active;

                formatPermissions.push(newPermission);
            });
        }

        let formatData = {
            roleId: group,
            permission: formatPermissions
        }

        setalertSuccessMessage("");
        setalertErrorMessage("");

        axios({
            method: "POST",
            url: urlSavePermissions,
            data: formatData
        }).then((res) => {

            console.log(res.data);
            setsending(false);

            if(res.data.result){
                setalertSuccessMessage(res.data.message);
                handleCloseModalSaveChanges();

                setTimeout(() => {
                    setalertSuccessMessage("");
                }, 20000);
            }

        }).catch((err) => {

            let fetchError = err;

            console.error(fetchError);
            if(fetchError.response){
                console.log(err.response);
                setalertErrorMessage(err.response.data.data.message);
                setTimeout(() => {
                    setalertErrorMessage("");
                }, 20000);
                handleCloseModalSaveChanges();
                setsending(false);
                // return Promise.reject(err.response.data.data);
            }

        });
    }   
    return (
        <Page title="Permisos | Bosque Marino">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4" color="white.main">
                    Gestión de Permisos
                </Typography>
            </Box>

            <Modal
                open={openSaveChanges}
                onClose={handleCloseModalSaveChanges}
                aria-labelledby="modal-modal-change-role-title"
                aria-describedby="modal-modal-change-role-description"
                style={{ display:'flex', alignItems:'center', justifyContent:'center' }}
            >
                <RootStyle>
                    <Typography variant="h5" sx={{mb: 4}}>
                       ¿Desea guardar esta configuración para el grupo: "{groupName}" en el modulo: "{moduleName}"?
                    </Typography>
                    <LoadingButton loading={sending} onClick={() => savePermissions()} sx={{px : 3, mx: 2}} variant="contained" color="primary" size="large">
                        Sí, confirmar
                    </LoadingButton>
                    <Button onClick={() => handleCloseModalSaveChanges()} sx={{px : 3, mx: 2}} size="large">
                        No, cancelar
                    </Button>
                </RootStyle>
            </Modal>

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

                            <div>
                                <Typography sx={{mb: 2}} variant="h6">
                                    Seleccione
                                </Typography>
                                <Grid container columnSpacing={3}>
                                    <Grid item sx={{pt: 0, mb: 2}} xs={12} md={6}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id="demo-simple-select-autowidth-label">
                                                Grupos
                                            </InputLabel>
                                            <Select
                                                fullWidth
                                                labelId="demo-simple-select-autowidth-label"
                                                id="demo-simple-select-autowidth"
                                                value={group}
                                                onChange={(e) => changeGroup(e.target.value)}
                                                label="Grupos"
                                                MenuProps={MenuProps}
                                            >
                                                {groups.map((item, key) => {
                                                    let dataItem = item;
                                                    return <MenuItem key={key} value={dataItem.id}>
                                                                {dataItem.name}
                                                            </MenuItem>
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item sx={{pt: 0, mb: 2}} xs={12} md={6}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id="demo-simple-select-autowidth-label">
                                                Módulos
                                            </InputLabel>
                                            <Select
                                                fullWidth
                                                labelId="demo-simple-select-autowidth-label"
                                                id="demo-simple-select-autowidth"
                                                value={module}
                                                onChange={(e) => changeModule(e.target.value)}
                                                label="Módulos"
                                                MenuProps={MenuProps}
                                                disabled={group === ""}
                                            >
                                                {modules.map((item, key) => {
                                                    let dataItem = item;
                                                    return <MenuItem key={key} value={dataItem.id}>
                                                                {dataItem.name}
                                                            </MenuItem>
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </div>
                        
                            {module !== "" && group !== "" && tasks !== null && !searchTasks &&
                                <div>
                                    <Grid alignItems="center" justifyContent="space-between" container sx={{mb: 4}} columnSpacing={3}>
                                        <Grid sx={{pt: 0}} item md={6} xs={12}>
                                            <Typography sx={{mb: 0}} variant="h6">
                                                Administrar Grupo {`"${groupName}"`}
                                            </Typography>
                                        </Grid>
                                        <Grid sx={{pt: 0}} item md={4} xs={12}>
                                            <Box sx={{ textAlign: "right" }} item>
                                                <Button onClick={() => setopenSaveChanges(true)} sx={{px: 5}} variant="contained" color="primary">
                                                    Guardar
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>
                                    
                                        <DataGrid
                                            sx={{mb:4}}
                                            rows={data}
                                            columns={columns}

                                            page={0}
                                            pageSize={6}
                                            rowsPerPageOptions={[6,10,20]}
                                            // autoPageSize
                                            rowCount={data.length}

                                            disableColumnFilter
                                            disableColumnMenu
                                            autoHeight 
                                            disableColumnSelector
                                            disableSelectionOnClick
                                            hideFooter
                                            // checkboxSelection
                                        />

                                    </div>
                                    
                                    <Box sx={{ textAlign: "right" }} item xs={12}>
                                        <Button 
                                            onClick={() => setopenSaveChanges(true)} 
                                            sx={{px: 5}} 
                                            variant="contained" 
                                            color="primary"
                                        >
                                            Guardar
                                        </Button>
                                    </Box>
                                    
                                </div>
                            }

                            {searchTasks &&
                                <Loader />
                            }
                        
                        </CardContent>
                    </Card>
                }

                {loading &&
                    <Card sx={{py: 3, px: 5}}>
                        <Loader />
                    </Card>
                }
            </Grid>
        </Container>
        </Page>
    );
}


export default Permissions;