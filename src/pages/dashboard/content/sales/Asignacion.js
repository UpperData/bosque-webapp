import {useState, useEffect,useRef,useMemo} from "react"
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Divider,CardContent, Hidden, Box, Grid,   Container, Typography,Alert,  Card, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

// components
import Page from '../../../../components/Page';
import ReleaseItemModal from "./modal/ReleaseItemModal";
import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';
// import { getPermissions } from "../../../../utils/getPermissions";
import AddOrderModal from "./modal/AddOrderModal";


import { useSelector } from "react-redux";

import ExportExcel from "react-export-excel"

import { Icon } from '@iconify/react';
import CaretRight from "@iconify/icons-ant-design/caret-right"
import CaretLeft from "@iconify/icons-ant-design/caret-left"
/* import { BorderAll } from "@material-ui/icons";
import { defaultFormat } from "numeral"; */

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
let products=[];
function Asignacion() {

    // const [data, setdata]                            = useState(rows);
    const [count, setcount]                             = useState(0);

    const [loading, setloading]                         = useState(true);
    const [search, setsearch]                           = useState(true);
    const [searchData, setsearchData]                   = useState(false);

    const [doctors, setdoctors]                         = useState(null);
    const [items, setitems]                             = useState(null);
    const [totalOrder,setTotalOrder]                    = useState(null);
    
    const [sending, setsending]                         = useState(false);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const [doctor, setdoctor]                           = useState(null);

    const [openModalAddItem, setopenModalAddItem]       = useState(false);
    const [typeForm, settypeForm]                       = useState("create");

    const [openModalItemReturn, setopenModalItemReturn] = useState(false);
    const [typeReturn, settypeReturn]                   = useState("one");
    const [selectedItem, setselectedItem]               = useState(null); // <-- Eliminar
    const [curerntItem, setCurerntItem]               = useState(null); 

    const [searchItemsToInventory, setsearchItemsToInventory] = useState(false);
    const [inventoryItems, setinventoryItems]                 = useState(null);
    const [openModalReleaseItem, setopenModalReleaseItem]   = useState(false);
    const [totalAccount,setTotalAccount]                  =useState(0);
    const [currentClient, setCurrentClient]              =useState(null);
    


    const urlGetPersonal            =  "/sales/userWithOrder"; // "/EMplOyeFIle/BYGRoUP/get/?grp=7&grp=6";
    const urlGetItemFromClient      =  "/sales/all/"; // "/invENtOrY/aSSGNmEnT/byDoCTOR/";
    const urlGetDataInventory       = "/InveTorY/get/ALL";

    // Permissions
    const location                              = useLocation();
    let MenuPermissionList                      = useSelector(state => state.dashboard.menu);
    // let permissions                             = getPermissions(location, MenuPermissionList);
    const releaseItem = (itemLot) => {
        // setitemToEdit(data);
        setCurerntItem(itemLot);
        setopenModalReleaseItem(true);
    }

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
        axios.get(urlGetPersonal)
        .then((res) => {          
            let dataList = res.data.rows;            
            if(dataList.length > 0){
                setdoctors(dataList);                
                setloading(false);
            }

        }).catch((err) => {
            console.error(err);
        });
    }
 
    useEffect(async () => {
        if(loading){
            if(search){
               
                getDoctors();                 
                setsearch(false);              
            }
        }
    });

    const getItemsByDoctor = (id) => {
        axios.get(urlGetItemFromClient+id)
        .then((res) => {     
            console.log("Data completa")
            console.log(res.data.rows)       
            for (let index = 0; index < res.data.rows.length; index++) {
                res.data.rows[index].id=res.data.rows[index]['itemLot.id']                         
            }            
            setitems(res.data.rows);
            setTotalOrder({"totalOrder":res.data.totalOrder,"count":res.data.count})
            setsearchData(false);

        }).catch((err) => {
            console.log(err);
        });
    }

    const changeDoctor = (clicID) => {             
        // inventoryItems.filter(item => Number(item.quantity) > 0);        
        let curr=doctors.find(x=>x.id===Number(clicID))          
        console.log(curr);
        setCurrentClient(curr)
        setdoctor(clicID);
        setsearchData(true);
        getItemsByDoctor(clicID);
        
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
       // getItemsList(); //--> hacerlo en nueva pantalla
        // settypeForm("create");
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
            
            item.quantity   = newCount;
            list[index]     = item;

            setinventoryItems(list);
            setcount(count * 20);
        }
    }
    
    const updateOrder=(items)=>{
        console.log("items") 
        console.log(items)        
        axios.put("CAR/ediT/ONE", items).then((res) => {
            if(res.data.result){
                setalertSuccessMessage(res.data.message);
                setsending(false);

                setTimeout(() => {
                    setalertSuccessMessage("");
                }, 20000);
            }
        }).catch((err) => {
           console.log(err)
        });
    }
    let columns = [
        { field: 'itemLot.id',          headerName: 'ID Lote', width: 120,  hide: true},
        { field: 'shoppingCarId',          headerName: 'ID Pedido', width: 70 },
        { 
            field: 'itemLot.lot.article.name',     
            headerName: `Especie`,
            maxWidth: 250,
            minWidth: 100,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;   
                let cant=!data.row["itemLot.lot.article.isSUW"]?+parseFloat(data.row["qty"]).toFixed(2):parseFloat(data.row["itemLot.weight"]) ;
                
                return <Tooltip title={cant.toFixed(2) +" kg en pedido"} placement="top">
                    <Typography sx={{fontWeight: 'bold', mb:0}} variant="body">
                        {data.row["itemLot.lot.article.name"]+" #"+ data.row['itemLot.numItem'] +" - "+cant.toFixed(2) +" Kg" }
                    </Typography>
                </Tooltip>
            }
        },
        { 
            field: 'itemLot.lot.article.price',     
            headerName: `Precio`,
            maxWidth: 80,
            minWidth: 80,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;                
                return <Typography sx={{fontWeight: 'bold', mb:0}} variant="body">
                    {"$"+parseFloat(data.row["itemLot.lot.article.price"]).toFixed(2)||0.0}
                </Typography>
            }
        },
        { 
            field: 'finalWeigth',     
            headerName: `Peso kg`,
            maxWidth: 100,
            minWidth: 100,
            flex: 1,
            sortable: false,
            align:'center',
            BorderAll:4,
            editable:true,
            renderCell: (cellValues) => {
                let data = cellValues;                    
                return  <Typography sx={{fontWeight: 'bold', mb:0}} variant="body">
                            {parseFloat(data.row.finalWeigth || 1).toFixed(2) }                        
                        </Typography>   
            
            /* <TextField
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
                            value={parseFloat(data.row.finalWeigth || 1).toFixed(2) }
                        /> */
                            
                                  },

            // valueGetter: (params) =>`${parseFloat(params.row.weigth || 1).toFixed(2)}`
           
        },{ 
            field: 'discount',     
            headerName: `Descuento $`,
            editable:true,
            maxWidth: 150,
            minWidth: 150,
            flex: 1,
            sortable: false,
            align:'left',
            BorderAll:4,
            renderCell: (cellValues) => {
                let data = cellValues;    
                let dataItem =items; 
                let currentIndex;               
                for (let index = 0; index < dataItem.length; index++) {                   
                    if(dataItem[index]['itemLot.id']===data.row['itemLot.id']) {
                        currentIndex=index;
                        dataItem[index].discount=(parseFloat(data.row.discount || 0).toFixed(2))
                    }
                    
                } 
                
                return <Typography sx={{fontWeight: 'bold', mb:0}} variant="body">
                    {parseFloat(items[currentIndex].discount || 0).toFixed(2) }
                   
                </Typography>
            }            
            
        },{ 
            field: 'subSaleTotal',     
            headerName: `Sub total`,
            maxWidth: 80,
            minWidth: 80,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues; 
                let dataItem =items;
                let grantTotal=Number("0.00");
                for (let index = 0; index < dataItem.length; index++) {                   
                    if(dataItem[index]['itemLot.id']===data.row['itemLot.id']) {
                        dataItem[index].subSaleTotal=((parseFloat(data.row.finalWeigth || 1).toFixed(2)*parseFloat(data.row['itemLot.lot.article.price']).toFixed(2)) - parseFloat(data.row.discount || 0).toFixed(2)).toFixed(2)                                               
                    }
                    grantTotal+=Number(parseFloat(dataItem[index].subSaleTotal).toFixed(2))
                    setitems(dataItem);
                }  
                setTotalAccount(grantTotal)
                return <Typography sx={{fontWeight: 'bold', mb:0, fontSize:[18]}} variant="body">
                    {`${"$"+((parseFloat(data.row.finalWeigth || 1).toFixed(2)*parseFloat(data.row['itemLot.lot.article.price']).toFixed(2)) - parseFloat(data.row.discount || 0).toFixed(2)).toFixed(2)}` }
                   
                </Typography>
            },
            // valueGetter: (params) => `${"$"+((parseFloat(params.row.weigth || 1).toFixed(2)*parseFloat(params.row['itemLot.lot.article.price']).toFixed(2)) - parseFloat(params.row.discount || 0).toFixed(2)).toFixed(2)}`
            /* renderCell: (cellValues) => {
                let data = cellValues;                
                return <Typography sx={{fontWeight: 'bold', mb:0}} variant="body">
                    {"$" + data.row.subTotal - data.field.discount}
                </Typography>
            } */
        },
        {  field: 'release',
            headerName: ``,  
            width: 80,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;                
                return <Button  onClick={() => releaseItem(data.row)} sx={{fontWeight: 'normal', mb:0}} variant="contained">
                    Liberar
                </Button>
            }
        }
    ];

    let inventorycolumns = [        
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

    const resetList = () => {
        changeDoctor(doctor);
        // setopenModalAddItem(false);
        setopenModalReleaseItem(false);
        // setitemToEdit(null);
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
        <Page title="Pedidos | Bosque Marino">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4" color="white.main">
                    Pedidos
                </Typography>
            </Box>
            {openModalReleaseItem &&
                <ReleaseItemModal 
                    show={openModalReleaseItem}
                    handleShowModal={(show) => {
                        setopenModalReleaseItem(false);
                    }}
                    item={curerntItem}
                    reset={() => resetList()}
                />
            }
            {openModalAddItem && 
                <AddOrderModal
                    show={openModalAddItem}
                    handleShowModal={(show) => {
                        setopenModalAddItem(false);
                    }}
                    // permissions={permissions}                  
                    reset={() => resetList()}
                    client={currentClient}
                    actionType={typeForm}
                
                />
            }
           

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
                        ¿Esta seguro de anular pedido?
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
                                        // onClick={() => openModal({id:0})} // pasar cliente actual
                                        variant="contained" 
                                        color="primary" 
                                        fullWidth 
                                        sx={{px : 3}} 
                                        size="normal"
                                    >
                                        Nuevo pedido
                                    </Button>
                                    
                                </Grid>
                                {/* <Grid item md={4} xs={12} sx={{mb: 2}}>
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
                                            Descargar pedidos
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
                                                    Descargar pedidos
                                                </Button>
                                            }
                                        >
                                            <ExcelSheet data={items} name="Asignación">
                                                <ExcelColumn label="Producto"       value={(col) => col["itemLot.lot.article.name"].toString()} />
                                                <ExcelColumn label="Descripción"    value={(col) => col["orderStatus.name"].toString()}/>
                                                <ExcelColumn label="Cantidad"       value="quantity" />
                                            </ExcelSheet>
                                        </ExcelFile>
                                    }
                                </Grid> */}
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
                                        Seleccione un cliente:
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="doctors">
                                            Cliente
                                        </InputLabel>
                                        <Select
                                            
                                            labelId="Cliente"
                                            id="doctorsSelect"
                                            defaultValue=""
                                            value={doctor === null ? "" : doctor}
                                            onChange={(e) => changeDoctor(e.target.value)}
                                            label="Cliente"
                                            // MenuProps={MenuProps}
                                            // disabled={municipios.length === 0}

                                            // {...getFieldProps('departamento')}
                                            // error={Boolean(touched.municipio && errors.municipio)}
                                            // helperText={touched.departamento && errors.departamento}
                                        >
                                            {doctors.map((item, key) => {
                                                let dataItem = item;
                                                // console.log(dataItem.account.employeeFiles);
                                                return <MenuItem key={key} value={dataItem.id.toString()}>
                                                            {dataItem.id +" - "+ dataItem.phone +" - "+ 
                                                                dataItem.people.document.firstName  + " " +dataItem.people.document.lastName 
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
                                                <Grid container columnSpacing={3} justifyContent="space-around">
                                                    <Grid md="auto" item xs={12} sx={{mb: 2}}>
                                                        <Box >
                                                        <Typography  sx={{
                                                                        fontWeight: 'bold', 
                                                                        mb:0, 
                                                                        
                                                                    }} 
                                                                    fullWidth 
                                                                    variant="body"color="primary" >
                                                            Total pedido:
                                                            </Typography>
                                                            <Typography  sx={{
                                                                        fontWeight: 'bold', 
                                                                        mb:0, 
                                                                        fontSize:[20]
                                                                        
                                                                    }} 
                                                                    fullWidth 
                                                                    variant="body"color="primary" >
                                                            {" $ "+totalAccount}
                                                            </Typography>
                                                        </Box>  
                                                    </Grid> 
                                                    <Divider orientation="vertical" flexItem /> 
                                                    <Grid md="auto" item xs={12} sx={{mb: 2}}>
                                                    
                                                        <Box>
                                                            <Typography   sx={{
                                                                        fontWeight: 'bold', 
                                                                        mb:0, 
                                                                        
                                                                    }} 
                                                                    fullWidth 
                                                                    variant="body"color="primary" >
                                                                Cant. Items: 
                                                            </Typography>
                                                            <Typography  sx={{
                                                                        fontWeight: 'bold', 
                                                                        mb:0, 
                                                                        
                                                                    }} 
                                                                    fullWidth 
                                                                    variant="body"color="primary" >
                                                            {" "+totalOrder.count}
                                                            </Typography>
                                                            
                                                        </Box>
                                                    </Grid>    
                                                    <Divider orientation="vertical" flexItem />                                                 
                                                    <Grid md="auto" item xs={12} sx={{mb: 2}}>   <Box>
                                                        <Button   onClick={() => changeDoctor(doctor)}  /* onClick={() => startToReturnItem(null)} */ type="button" size="small" sx={{py: 1, px: 5}} color="primary" variant="contained">
                                                                Actualizar
                                                            </Button>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                                <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}> 
                                                    <DataGrid
                                                        // onRowEditCommit={updateOrder(data.row)}
                                                        // onCellEditCommit={totalOrder}
                                                        // onStateChange={alert("Aplicar onChange")}
                                                        // onCellEditStop={alert("Aplicar onChange")}
                                                       //  onCellKeyDown={alert("Aplicar onChange")}
                                                        onCellEditCommit={(cellValues) => updateOrder(cellValues)}
                                                        // onRowEditCommit={(params) => handleCellEditStop(params)}
                                                        // onCellFocusOut={(params)   => validateChanges(params)}
                                                        sx={{mb:8}}
                                                        rows={items}
                                                        columns={columns}
                                                        // editMode="row"               
                                                        page={0}
                                                        pageSize={10}
                                                        rowsPerPageOptions={[10,20,30]}
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
                                                <LoadingButton
                                                fullWidth
                                                size="large"
                                                type="submit"
                                                variant="contained"
                                                loading={sending}
                                                color="primary"
                                                form="form1"
                                            /* disabled={
                                                    (!permissions.crea && typeForm === "create") || 
                                                    (!permissions.edita && typeForm === "edit")  || 
                                                    (values.name === "" || values.description === "")
                                                } */
                                            >
                                                {"Confirmar pago - $" +  totalAccount}

                                            </LoadingButton>
                                            </div>
                                        :
                                            <div>
                                                {doctor !== null &&
                                                    <Alert severity="info">
                                                        No se han encontrado productos reservador para este cliente.
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