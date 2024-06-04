import {useState, useEffect} from "react"
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { CardContent, Hidden, Box, Grid, Stack, ButtonGroup, Container, Typography,Alert,  Card, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import { alpha, styled } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';

// components
import Page from '../../../../components/Page';

import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';
import { getPermissions } from "../../../../utils/getPermissions";
import { useSelector } from "react-redux";

import ExportExcel from "react-export-excel"

import { Icon } from '@iconify/react';
import CaretRight from "@iconify/icons-ant-design/caret-right"
import CaretLeft from "@iconify/icons-ant-design/caret-left"

const ExcelFile     = ExportExcel.ExcelFile;
const ExcelSheet    = ExportExcel.ExcelSheet;
const ExcelColumn   = ExportExcel.ExcelColumn;

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 5),
    width: "95%",
    margin: "auto",
    maxWidth: "750px",
    backgroundColor: "#fff",
}));

const RootStyleFromModalSmall = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 5),
    width: "95%",
    margin: "auto",
    maxWidth: "600px",
    backgroundColor: "#fff",
}));

function Asignacion() {

    // const [data, setdata]                            = useState(rows);
    const [count, setcount]                             = useState(0);

    const [loading, setloading]                         = useState(true);
    const [search, setsearch]                           = useState(true);
    const [searchData, setsearchData]                   = useState(false);

    const [doctors, setdoctors]                         = useState(null);
    const [items, setitems]                             = useState(null);

    const [openSaveChanges, setopenSaveChanges]         = useState(false);
    const [sending, setsending]                         = useState(false);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const [doctor, setdoctor]                           = useState(null);

    const [openModalAddItem, setopenModalAddItem]       = useState(false);
    const [typeForm, settypeForm]                       = useState("create");

    const [openModalItemReturn, setopenModalItemReturn] = useState(false);
    const [typeReturn, settypeReturn]                   = useState("one");
    const [selectedItem, setselectedItem]               = useState(null);


    const [searchItemsToInventory, setsearchItemsToInventory] = useState(false);
    const [inventoryItems, setinventoryItems]                 = useState(null);

    const urlGetPersonal            = "/EMplOyeFIle/BYGRoUP/get/?grp=7&grp=6";
    const urlGetItemFromDoctor      = "/invENtOrY/aSSGNmEnT/byDoCTOR/";
    const urlGetDataInventory       = "/InveTorY/get/ALL";

    // Permissions
    const location                              = useLocation();
    let MenuPermissionList                      = useSelector(state => state.dashboard.menu);
    let permissions                             = getPermissions(location, MenuPermissionList);

    const LoginSchema =         Yup.object().shape({
        name:                   Yup.string().required('Debe ingresar un nombre'),  
        description:            Yup.string().required('Debe ingresar una descripción'),
        // existence:           Yup.string().required('Ingrese stock'),
    });

    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            name:             "",
            description:      "",
            existence:        "",
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
            try {
                // form
            } catch(e) {
                // form
            }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik;
    
    const getDoctors = () => {
        // Empleados (medico, enfermera)
        axios.get(urlGetPersonal)
        .then((res) => {
            console.log(res.data);
            let dataList = res.data.data;

            if(dataList.length > 0){

                setdoctors(dataList[0].accountRoles);
                setloading(false);
                
                // setnurses(dataList[1].accountRoles);

            }

        }).catch((err) => {
            console.error(err);
        });
    }

    useEffect(async () => {
        if(loading){
            if(search){
                setsearch(false);
                await getDoctors();
            }
        }
    });

    const getItemsByDoctor = (id) => {
        axios.get(urlGetItemFromDoctor+id)
        .then((res) => {

            console.log(res.data);

            setitems(res.data.data);
            setsearchData(false);

        }).catch((err) => {
            console.error(err);
        });
    }

    const changeDoctor = (id) => {
        console.log("Get items from doctor id:"+ id);
        setdoctor(id);
        setsearchData(true);
        getItemsByDoctor(id);
    }

    const getItemsList = () => {
        setsearchItemsToInventory(true);

        axios.get(urlGetDataInventory)
        .then((res) => {

            console.log(res);

            if(res !== null && res.length > 0){
                let formattedItems = [];

                res.forEach(item => {
                    let newItem      = {...item};
                    newItem.quantity = 0;

                    formattedItems.push(newItem);
                });

                setinventoryItems(formattedItems);
                setsearchItemsToInventory(false);
            }

        }).catch((err) => {
            console.error(err);
        });
    }

    const openModal = () => {
        // setitemToEdit(null);
        // resetForm();
        getItemsList();
        settypeForm("create");
        setopenModalAddItem(true);
    }

    const handleCloseModalAddItem = () => {
        setopenModalAddItem(false);
    }

    const changeQuantity = (id, newCount) => {
        // console.log(newCount);

        if(newCount >= 0){
            // setchangeInputStock(true);

            let list        = [...inventoryItems];
            let item        = list.find(item => Number(item.id) === Number(id));
            let index       = list.indexOf(item);
            
            // console.log(list);
            // console.log(index);
            // console.log(list[index]);

            item.quantity   = newCount;
            list[index]     = item;

            setinventoryItems(list);
            setcount(count * 20);
        }
    }

    let columns = [
        // { field: 'id',          headerName: 'ID', width: 70 },
        { 
            field: 'name',     
            headerName: `Nombre`,
            maxWidth: 250,
            minWidth: 200,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                // console.log(data);
                return <Typography sx={{fontWeight: 'bold', mb:0}} variant="body">
                    {data.row.article.name}
                </Typography>
            }
        },
        { 
            field: 'stock',     
            headerName: `Descripción`,
            maxWidth: 280,
            minWidth: 240,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                // console.log(data);
                return <Typography sx={{fontWeight: 'bold', mb:0}} variant="body">
                    {data.row.article.description}
                </Typography>
            }
        },
        { 
            field: 'quantity',    
            headerName: 'Cantidad',
            sortable: false,
            maxWidth: 130,
            minWidth: 120,
            flex: 1,
            headerAlign: 'center',
            align: "center"
        },
        { 
            field: 'id',    
            headerName: '',
            sortable: false,
            maxWidth: 250,
            minWidth: 200,
            flex: 1,
            headerAlign: 'center',
            renderCell: (cellValues) => {
                let data = cellValues;
                let id   = data.row.id;
                return  <Button onClick={() => startToReturnItem(id)} type="button" size="small" sx={{py: 1, px: 0, minWidth: 0, width: "100%"}} color="primary" variant="contained">
                            Devolver a Almacén
                        </Button>
                            
            }
        }
    ];

    let inventorycolumns = [
        // { field: 'id',          headerName: 'ID', width: 70 },
        { 
            editable: false,
            field: 'articleId',     
            headerName: `Nombre`,
            width: 180,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                // console.log(data);
                return  <Typography sx={{fontWeight: "bold"}}>
                            {data.row.article.name}
                        </Typography>
            }
        },
        { 
            editable:   false,
            field:      'description',     
            headerName: `Descripción`,
            width: 200,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                // console.log(data);
                return  <Typography>
                            {data.row.article.description === null ? "N/A" : data.row.article.description}
                        </Typography>
            }
        },
        { 
            field: 'existence',    
            headerName: 'Existencia',
            sortable: false,
            width: 100,
            headerAlign: 'center',
            align: "center"
        },
        { 
            field: 'quantity',    
            headerName: 'Cantidad',
            sortable: false,
            width: 170,
            headerAlign: 'center',
            renderCell: (cellValues) => {

                let data = cellValues;
                let quantity = data.row.quantity;
                let existence = data.row.existence;

                return  <Grid container alignItems="center">
                            <Grid xs={4} item sx={{px: .5}}>
                                <Button 
                                    disabled={sending} 
                                    onClick={() => changeQuantity(data.row.id, quantity - 1)} 
                                    type="button" 
                                    size="small" sx={{py: 1.5, px: 0, minWidth: 0, width: "100%"}} 
                                    color="primary" 
                                    variant="contained"
                                >
                                    <Icon icon={CaretLeft} />
                                </Button>
                            </Grid>
                            <Grid xs={4} item>
                                <TextField
                                    hiddenLabel
                                    size='small'
                                    fullWidth
                                    autoComplete="lastname"
                                    type="number"
                                    label=""
                                    InputProps={{
                                        readOnly: true,
                                        style: {textAlign: 'center'}
                                    }}
                                    value={quantity}
                                />
                            </Grid>
                            <Grid xs={4} item sx={{px: .5}}>
                                <Button 
                                    disabled={sending || (quantity >= existence)} 
                                    onClick={() => changeQuantity(data.row.id, quantity + 1)} 
                                    type="button" 
                                    size="small" sx={{py: 1.5, px: 0, minWidth: 0, width: "100%"}} 
                                    color="primary" 
                                    variant="contained"
                                >
                                    <Icon icon={CaretRight} />
                                </Button>
                            </Grid>
                        </Grid>
            }
        }
    ];

    // buscar si hay mas de 1 item para asignar

    let itemListByQuantityChange = null;

    if(inventoryItems !== null && inventoryItems.length > 0){
        itemListByQuantityChange = inventoryItems.filter(item => Number(item.quantity) > 0);
        console.log(itemListByQuantityChange);
    }

    const asignItems = () => {

        let url  = "/inVeNtOrY/aSSgNMEnt/New";   

        console.log("Aisgando");
        setsending(true);

        let totalItems          = itemListByQuantityChange.length;
        let totalItemAsigned    = 0;

        itemListByQuantityChange.forEach(item => {
            let data = {
                accountId: doctor,
                articleId: item.articleId,
                quantity:  item.quantity
            }; 

            // console.log(doctor);

            axios({
                url,
                method: "post",
                data
            }).then((res) => {

                console.log(res);
                totalItemAsigned++;
                if(totalItemAsigned === totalItems){
                    setsending(false);
                    settypeForm("create");
                    getItemsByDoctor(doctor);
                    setopenModalAddItem(false);
                }

            }).catch((err) => {
                console.error(err);
            });
        });
    }

    const startToReturnItem = (id) => {
        if(id === null){
            settypeReturn("all");
        }else{
            setselectedItem(id);
            settypeReturn("one");
        }
        
        setopenModalItemReturn(true);
    }

    const returnItems = () => {

        setsending(true);
        if(typeReturn === "one"){
            let urlReturn = "/InvEToRY/revoke/assignament/"+selectedItem;

            axios({
                url:    urlReturn,
                method: "get"
            }).then((res) => {
    
                setsending(false);
                setopenModalItemReturn(false);
                settypeReturn(typeReturn);
                setselectedItem(null);
                getItemsByDoctor(doctor);

                setalertSuccessMessage(res.data.message);
                setTimeout(() => {
                    setalertSuccessMessage("");
                }, 20000);
    
            }).catch((err) => {
                // console.error(err);
            });
        }else{
            // return by array

            let list        = [...items];
            let totalItems  = list.length;
            let totalReturn = 0;
            setsending(true);

            list.forEach(element => {
                let urlReturn = "/InvEToRY/revoke/assignament/"+element.id;

                axios({
                    url:    urlReturn,
                    method: "get"
                }).then((res) => {

                    totalReturn++;

                    if(totalReturn === totalItems){

                        
                        setsending(false);
                        setopenModalItemReturn(false);
                        settypeReturn(typeReturn);
                        setselectedItem(null);
                        getItemsByDoctor(doctor);

                        setalertSuccessMessage(res.data.message);
                        setTimeout(() => {
                            setalertSuccessMessage("");
                        }, 20000);

                    }
        
                }).catch((err) => {
                    // console.error(err);
                });
            });
        }
    }

    return (
        <Page title="Roles | RepuestosGo">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4" color="white.main">
                    Asignación
                </Typography>
            </Box>

            <Modal
                open={openModalAddItem}
                onClose={handleCloseModalAddItem}
                aria-labelledby="modal-add-item-to-asign"
                aria-describedby="modal-add-item-to-asign"
                style={{ 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center' 
                }}
                
            >
                <RootStyle>

                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                    <Typography sx={{mb: 4}} id="modal-modal-title" variant="h3" component="h3">
                        {typeForm === "create" ? "Asignar un producto" : "Editar un producto"}
                    </Typography>

                    {!searchItemsToInventory && inventoryItems !== null && inventoryItems.length > 0
                        ?
                            <div>
                                
                                <div>

                                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}> 
                                        <DataGrid
                                            sx={{mb:4}}
                                            rows={inventoryItems}
                                            columns={inventorycolumns}
                                            hideFooter

                                            // onCellEditStop={(params) => handleCellEditStop(params)}
                                            // experimentalFeatures={{ newEditingApi: true }}
                                            // onCellEditStart={(params) => handleCellEditStart(params)}
                                            // processRowUpdate={processRowUpdate}

                                            // onCellEditCommit={(params) => handleCellEditStop(params)}
                                            // onCellFocusOut={(params)   => validateChanges(params)}

                                            page={0}
                                            pageSize={6}
                                            rowsPerPageOptions={[6,10,20]}
                                            // autoPageSize
                                            rowCount={inventoryItems.length}

                                            disableColumnFilter
                                            disableColumnMenu
                                            autoHeight 
                                            disableColumnSelector
                                            disableSelectionOnClick
                                            // checkboxSelection
                                        />
                                    </div>
                                    
                                    {/*
                                        // (!permissions.crea && typeForm === "create") || 
                                            // (!permissions.edita && typeForm === "edit")  || 
                                            // (values.name === "" || values.description === "")
                                    */}

                                    <LoadingButton
                                        onClick={() => asignItems()}
                                        fullWidth
                                        size="large"
                                        type="button"
                                        variant="contained"
                                        loading={sending}
                                        color="primary"
                                        disabled={itemListByQuantityChange === null || (itemListByQuantityChange !== null && itemListByQuantityChange.length === 0)}
                                    >
                                        Asignar
                                    </LoadingButton>
                                </div>
                            

                            </div>
                        :
                            <Box sx={{my: 3}}>
                                <Loader />
                            </Box>
                    }

                    </Form>
                </FormikProvider>
                    
                </RootStyle>
            </Modal>

            <Modal
                open={openModalItemReturn}
                onClose={() => setopenModalItemReturn(false)}
                aria-labelledby="modal-add-item-to-asign"
                aria-describedby="modal-add-item-to-asign"
                style={{ 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center' 
                }}
                
            >
                <RootStyleFromModalSmall>

                    <Typography sx={{mb: 4}} id="modal-modal-title" variant="h3" component="h3">
                        {typeReturn === "one" ? "Devolver asignación" : "Devolver asignaciones"}
                    </Typography>
                    <Typography sx={{mb: 3}} component="p">
                        ¿Esta seguro de devolver esta{typeReturn === "one" ? " asignación" : "s asignaciones"}?
                    </Typography>
                    <LoadingButton
                        onClick={() => returnItems()}
                        fullWidth
                        size="large"
                        type="button"
                        variant="contained"
                        loading={sending}
                        color="primary"
                    >
                        Aceptar
                    </LoadingButton>

                </RootStyleFromModalSmall>
            </Modal>

            <Grid sx={{ pb: 3 }} item xs={12}>
                {!loading &&
                    <Card>
                        <CardContent>

                            <Grid container justifyContent="space-between" columnSpacing={3}>
                                <Grid item md={3} xs={12}  sx={{mb: 2}}>
                                    <Button 
                                        disabled={doctor === null || searchData} 
                                        onClick={() => openModal()} 
                                        variant="contained" 
                                        color="primary" 
                                        fullWidth 
                                        sx={{px : 3}} 
                                        size="normal"
                                    >
                                        Nueva asignación
                                    </Button>
                                </Grid>
                                <Grid item md={4} xs={12} sx={{mb: 2}}>
                                    {(doctor === null || searchData) 
                                    ?
                                        <Button 
                                            disabled={doctor === null || searchData} 
                                            variant="contained" 
                                            color="secondary" 
                                            fullWidth 
                                            sx={{px : 3}} 
                                            size="normal"
                                        >
                                            Descargar hoja asignación
                                        </Button>
                                    :
                                        <ExcelFile
                                            filename="Asignacion"
                                            element={
                                                <Button 
                                                    variant="contained" 
                                                    color="secondary" 
                                                    fullWidth 
                                                    sx={{px : 3}} 
                                                    size="normal"
                                                >
                                                    Descargar hoja asignación
                                                </Button>
                                            }
                                        >
                                            <ExcelSheet data={items} name="Asignación">
                                                <ExcelColumn label="Producto"       value={(col) => col.article.name.toString()} />
                                                <ExcelColumn label="Descripción"    value={(col) => col.article.description.toString()}/>
                                                <ExcelColumn label="Cantidad"       value="quantity" />
                                            </ExcelSheet>
                                        </ExcelFile>
                                    }
                                </Grid>
                            </Grid>

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

                            <Grid container columnSpacing={3} sx={{mb: 3}}>
                                <Grid item xs={12}>
                                    <Typography sx={{mb: 1, fontWeight: "bold"}}>
                                        Seleccione un doctor:
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="doctors">
                                            Doctor
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="Doctor"
                                            id="doctors"
                                            defaultValue=""
                                            value={doctor === null ? "" : doctor}
                                            onChange={(e) => changeDoctor(e.target.value)}
                                            label="Doctor"
                                            // MenuProps={MenuProps}
                                            // disabled={municipios.length === 0}

                                            // {...getFieldProps('departamento')}
                                            // error={Boolean(touched.municipio && errors.municipio)}
                                            // helperText={touched.departamento && errors.departamento}
                                        >
                                            {doctors.map((item, key) => {
                                                let dataItem = item;
                                                // console.log(dataItem.account.employeeFiles);
                                                return <MenuItem key={key} value={dataItem.account.accountId.toString()}>
                                                            {dataItem.account.employeeFiles.length > 0
                                                                ?
                                                                dataItem.account.employeeFiles[0].fisrtName+ " " +dataItem.account.employeeFiles[0].lastName
                                                                :
                                                                dataItem.account.name
                                                            }
                                                        </MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        

                            {searchData 
                                ?
                                <Loader />
                                :
                                <div>
                                    {(items !== null && items.length > 0 && doctor !== null) 
                                        ?
                                            <div>
                                                <Box sx={{textAlign: "right", mb: 3}}>
                                                    <Button onClick={() => startToReturnItem(null)} type="button" size="small" sx={{py: 1, px: 5}} color="primary" variant="contained">
                                                        Devolver Todo
                                                    </Button>
                                                </Box>

                                                <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}> 
                                                    <DataGrid
                                                        sx={{mb:4}}
                                                        rows={items}
                                                        columns={columns}

                                                        page={0}
                                                        pageSize={6}
                                                        rowsPerPageOptions={[6,10,20]}
                                                        // autoPageSize
                                                        rowCount={items.length}

                                                        disableColumnFilter
                                                        disableColumnMenu
                                                        autoHeight 
                                                        disableColumnSelector
                                                        disableSelectionOnClick
                                                        // checkboxSelection
                                                    />
                                                </div>
                                            </div>
                                        :
                                            <div>
                                                {doctor !== null &&
                                                    <Alert severity="info">
                                                        No se han encontrado productos asignados para este doctor.
                                                    </Alert>
                                                }
                                            </div>
                                    }
                                </div>
                            }
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


export default Asignacion;