import React, { useEffect, useState } from 'react'
import axios from "../../../../auth/fetch"

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

import { CardContent, Hidden, Box, Stack, Grid, Container, Typography, Card, MenuItem, Button, Modal, TextField, Alert, FormControl,InputLabel,Select } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

import Loader from '../../../../components/Loader/Loader';
import Page from '../../../../components/Page';

import { RecibosPdf } from "./pdf/Recibos";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import printJS from 'print-js'

let dummyData = [
    {
        id: 1, 
        description: "Citas 01235",
        price: 100,
        quantity: 1
    }
]

export default function Bills() {

    const [sending, setsending] = useState(false);
    const [loading, setloading] = useState(true);
    const [search, setsearch]   = useState(true);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const [doctorAmount, setdoctorAmount]   = useState("");
    const [amount, setAmount]               = useState("");

    const [searchData, setsearchData]   = useState(false);
    const [data, setdata]               = useState([]);
    const [dataDoctor, setDataDoctor]   = useState(null);
    const [doctors, setdoctors]         = useState([]);
    const [doctor, setdoctor]           = useState(null);

    const [idToSearch, setidToSearch]       = useState("");
    const [billSelected, setbillSelected]   = useState(null);

    const [showModalCancelBill, setshowModalCancelBill] = useState(false);

    let urlGetData                  = "/aPpoInTMent/by/pAY/";
    let urlGetUsersWithAccount      = "/EMplOyeFIle/StATUS/gET/true";
    let urlUpdateAmount             = "/EMplOyefIle/update/fee/";
    let urlCreateBill               = "/vouchEr/NeW/";

    const style = {
        width: "95%",
        margin: "auto",
        maxWidth: "600px",
        backgroundColor: "#fff",
        userSelect: "none",
        boxShadow: 'none',
        textAlign: 'center',
    };

    const LoginSchema =     Yup.object().shape({
        description:        Yup.string().required('Debe ingresar una descripción'),
        amount:             Yup.string().required('Precio'),
        quantity:           Yup.string().required('Cantidad')
    });

    const formik = useFormik({
        validateOnChange: false,
        initialValues: {
            description:    "",
            amount:         "",
            quantity:       ""
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
          try {

            let data =  {
                concept:        values.description,
                description:    values.description,
                appointmentId:  null,
                amount:         values.amount,
                quantity:       values.quantity
            }

            let actualList = [...dataDoctor];
            if(actualList.length === 0){
                data.id     = 1;
                actualList.push(data);
                setDataDoctor(actualList);
            }else{
                data.id = actualList[actualList.length - 1].id + 1;
                actualList.push(data);
                setDataDoctor(actualList);
            }
            
            resetForm();
            
          } catch(e) {
            console.log(e);
          }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue, resetForm } = formik;

    const updateAmount = async () => {

        let datasend = {
            employeeFileId: doctor,
            amount:         amount.toString()
        }

        setsending(true);
        axios({
            method: "put",
            url:    urlUpdateAmount,
            data:   datasend
        }).then((res) => {
            console.log(res.data);
            setsending(false);

            let newDoctorsList  = [...doctors];
            let doctorData      = newDoctorsList.find(item => item.employeeFileId.toString() === datasend.employeeFileId);
            let index           = newDoctorsList.indexOf(doctorData);

            newDoctorsList[index].amount = datasend.amount;
            setdoctors(newDoctorsList);
            setalertSuccessMessage(res.data.message);

            setdoctorAmount(datasend.amount);
            updateTable(dataDoctor, datasend.employeeFileId);

            setTimeout(() => {
                setalertSuccessMessage("");
            }, 4000);

        }).catch((err) => {
            console.error(err);
            setsending(false);
        });

    }

    const updateTable = (dataDoctorList, idDoctor) => {
        console.log("Actualizando tabla");
        
        let doctorAmountData = 0;
        let doctorData = doctors.find(item => item.employeeFileId.toString() === idDoctor);
        if(doctorData.fees.length > 0){
            doctorAmountData = doctorData.fees[0].amount;
        }

        let newList         = [];
        for (let i = 0; i < dataDoctorList.length; i++) {
            const dataDoctorListItem = dataDoctorList[i];
            let newItem = {...dataDoctorListItem};
            newItem.id  = i + 1;

            if(!newItem.hasOwnProperty("quantity")){
                newItem.quantity = 1;
            }

            /*
                if(!newItem.hasOwnProperty("amount")){
                    newItem.amount = doctorAmountData;
                }
            */

            newList.push(newItem);
        }

        console.log(newList);
        setDataDoctor(newList);
        setsearchData(false);
    }

    const getBills = async (idDoctor) => {
        setsearchData(true);

        setdoctor(idDoctor);
        let doctorData = doctors.find(item => item.employeeFileId.toString() === idDoctor);
        if(doctorData.fees.length > 0){
            setdoctorAmount(doctorData.fees[0].amount);
            setAmount(doctorData.fees[0].amount);
        }

        axios.get(urlGetData+idDoctor)
        .then((res) => {

            console.log("---Data---");
            console.log(res.data);

            let dataDoctorList  = res.data.data;
            updateTable(dataDoctorList, idDoctor);

        }).catch((err) => {

            let error = err.response;
            if(error){
                if(error.data){
                    setloading(true);
                }
            }
        });
    }

    const getBillById = async () => {
        let urlCreateBill               = `/VouCHER/GEt/${doctor}/${idToSearch}/`;

        setsearch(true);

        axios.get(urlCreateBill)
        .then((res) => {
            
            console.log("Data search");
            console.log(res.data);
            setsearch(false);

            if(res.data.data !== null){

                setbillSelected(res.data.data);
                updateTable(res.data.data.details, doctor);

            }else{
                setalertErrorMessage("No se ha podido encontrar el voucher");

                setTimeout(() => {
                    setalertErrorMessage("");
                }, 4000);
            }

        }).catch((err) => {
            let fetchError = err;
            console.error(fetchError);
            if(fetchError.response){

                setsearch(false);
                setalertErrorMessage(err.response.data.data.message);

            }
        });
    }

    const getDoctors = async () => {
        axios.get(urlGetUsersWithAccount)
        .then((res) => {

            console.log("---Data---");
            console.log(res.data);

            setdoctors(res.data.data);
            setsending(false);
            setloading(false);
            setsearch(false);

        }).catch((err) => {

            let error = err.response;
            if(error){
                if(error.data){
                    setloading(true);
                }
            }
            
        });
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await getDoctors();
            }
        }
    }, []);

    const deleteBill = (id) => {
        let actualList  = [...dataDoctor];
        let newList     = actualList.filter(item => Number(item.id) !== Number(id));

        setDataDoctor(newList);
    }

    const saveData = () => {
        setsending(true);

        let totalAmount = 0;

        for (let i = 0; i < dataDoctor.length; i++) {
            const dataBill = dataDoctor[i];
            if(dataBill.hasOwnProperty("quantity")){
                totalAmount += (Number(dataBill.amount) * Number(dataBill.quantity));
            }else{
                totalAmount += Number(dataBill.amount);
            }
        }

        let formattedData = {
            employeeFileId: doctor,
            amount:         doctorAmount,
            details:        dataDoctor
        }

        axios({
            method: "post",
            url:    urlCreateBill,
            data:   formattedData
        }).then((res) => {

            console.log(res.data);

            setalertSuccessMessage(res.data.message);
            setsending(false);
            resetForm();
            setAmount("");
            setdoctorAmount("");
            setDataDoctor([]);
            setdoctor(null);

            setidToSearch("");
            setbillSelected(null);

            setTimeout(() => {
                setalertSuccessMessage("");
            }, 4000);

        }).catch((err) => {
            console.error(err);
            setsending(false);
        });
    }

    const CancelBill = () => {
        if(billSelected !== null){
            let url = `/VOUCHER/UPDATE/${billSelected.voucherId}`;
            setsending(true);

            axios.get(url).then((res) => {

                console.log(res.data);

                setshowModalCancelBill(false);

                setalertSuccessMessage(res.data.message);
                setsending(false);
                resetForm();
                setAmount("");
                setdoctorAmount("");
                setDataDoctor([]);
                setdoctor(null);

                setidToSearch("");
                setbillSelected(null);

                setTimeout(() => {
                    setalertSuccessMessage("");
                }, 4000);

            }).catch((err) => {
                console.error(err);
            });
        }
    }

    let columns = [
        /*
            { 
                field: 'id',          
                headerName: '#', 
                width: 50,
                headerAlign: 'center',
                sortable: false,
                align: "center"
            },
        */
        { 
            editable: false,
            field: 'articleId',     
            headerName: `Descripción`,
            minWidth: 300, 
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                // console.log(data);
                return  <Typography sx={{fontWeight: "bold"}}>
                    {data.row.description} 
                    <Button 
                        variant="contained" 
                        size="small" 
                        color="primary" 
                        sx={{px: 1, ml: 3}}
                        onClick={() => deleteBill(data.row.id)}
                        disabled={sending}
                    >
                        Eliminar
                    </Button>
                </Typography> 
            }
        },
        { 
            field: 'amount',    
            headerName: 'Precio',
            sortable: false,
            minWidth: 150, 
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (cellValues) => {
                let data = cellValues;
                let amount = data.row.amount;
                if(!amount){
                    amount = doctorAmount;
                }

                return  <Typography>
                    {"Bs." + amount}
                </Typography> 
            }
        },
        { 
            field: 'quantity',    
            headerName: 'Cantidad',
            sortable: false,
            minWidth: 120, 
            flex: 1,
            headerAlign: 'center',
            align: 'center',
        },
        { 
            field: 'sub-total',     
            headerName: `Sub Total`,
            minWidth: 200, 
            flex: 1,
            headerAlign: 'right',
            align: "right",
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                let quantity = data.row.quantity;
                let amount = data.row.amount;

                if(!amount){
                    amount = doctorAmount;
                }

                let result  = amount*quantity;
                // console.log(quantity, amount, result);
                
                return  <Typography sx={{fontWeight: "bold"}} align="right">
                    Bs. {result}
                </Typography>
            }
        }
    ];

    let totalAmount = 0;

    if(dataDoctor !== null && dataDoctor.length > 0){
        for (let i = 0; i < dataDoctor.length; i++) {
            const dataBill = dataDoctor[i];
            let dataamount = 0;
    
            if(dataBill.hasOwnProperty("amount") && dataBill.amount !== null){
                dataamount = dataBill.amount;
            }else if(billSelected === null){
                    dataamount = doctorAmount;
            }
    
            totalAmount += dataamount * Number(dataBill.quantity);
            
        }
    }

    const printFile = async (blob) => {
        let pdfUrl    = await window.URL.createObjectURL(blob);
        await printJS(pdfUrl);
        window.URL.revokeObjectURL(pdfUrl);
    }

    return (
        <Page title="Recibos | RepuestosGo">
            <Modal
                open={showModalCancelBill}
                onClose={() => setshowModalCancelBill(false)}
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
                        ¿Desea anular este recibo?
                    </Typography>
                    <div>
                        <LoadingButton
                            size="large"
                            variant="contained"
                            loading={sending}
                            color="primary" 
                            onClick={() => CancelBill()}
                            sx={{mx: 1}}
                        >
                            Sí, anular
                        </LoadingButton>
                        <Button disabled={sending} size="large" sx={{mx: 1}} onClick={() => setshowModalCancelBill(false)}>
                            Cancelar
                        </Button>
                    </div>
                </Box>
            </Modal>

            <Container maxWidth="xl">
                <Box sx={{ pb: 3 }}>
                    <Typography variant="h4">
                        Recibos
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

                                <Box>
                                    <Typography sx={{fontWeight: "bold", mb: 2 }}>
                                        Seleccione
                                    </Typography>

                                    <Grid container columnSpacing={3}>
                                        <Grid item lg={8} xs={12} sx={{mb: 2}}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel id="bill-user-id">
                                                    Empleado / Contratado
                                                </InputLabel>
                                                <Select
                                                    fullWidth
                                                    labelId="Doctor"
                                                    id="bill-user-id"
                                                    defaultValue=""
                                                    value={doctor === null ? "" : doctor}
                                                    onChange={(e) => getBills(e.target.value)}
                                                    label="Empleado / Contratado"
                                                    // MenuProps={MenuProps}
                                                    // disabled={municipios.length === 0}

                                                    // {...getFieldProps('departamento')}
                                                    // error={Boolean(touched.municipio && errors.municipio)}
                                                    // helperText={touched.departamento && errors.departamento}
                                                >
                                                    {
                                                        doctors.map((item, key) => {
                                                            let dataItem = item;
                                                            // console.log(dataItem.account.employeeFiles);
                                                            return <MenuItem key={key} value={dataItem.employeeFileId.toString()}>
                                                                        {dataItem.fisrtName + " " + dataItem.lastName}
                                                                    </MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item lg={4} xs={12} sx={{mb: 2}}>
                                            <Grid container columnSpacing={1}>
                                                <Grid item lg={7} xs={8}>
                                                    <TextField
                                                        label="Honorario"
                                                        size="small"
                                                        disabled={doctor === null || sending || billSelected !== null}
                                                        value={ billSelected !== null ? billSelected.amount : amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        type="number"
                                                    />
                                                </Grid>
                                                <Grid item lg={5} xs={4}>
                                                    <LoadingButton 
                                                        variant="contained" 
                                                        color="primary"
                                                        type="button"
                                                        sx={{ minWidth: "100%", width: "100%", py: 1}}
                                                        disabled={doctor === null || (doctor !== null && amount === "") || billSelected !== null}
                                                        onClick={() => updateAmount()}
                                                        loading={sending}
                                                        // disabled={textSearchData === "" || !permissions.consulta}
                                                    >
                                                        Actualizar
                                                    </LoadingButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {doctor !== null &&
                                        <Grid sx={{mb: 5, mt:2}} container columnSpacing={3}>
                                            <Grid item md={2} xs={4}>
                                                <Button 
                                                    disabled={billSelected === null}
                                                    // onClick={() => reset()} 
                                                    onClick={() => setshowModalCancelBill(true)}
                                                    variant="contained" 
                                                    fullWidth
                                                    disabed
                                                    sx={{ py: 1 }}
                                                >
                                                    Anular
                                                </Button>
                                            </Grid>
                                            <Grid item md={2} xs={4}>
                                                {billSelected !== null ?
                                                    <BlobProvider 
                                                        document={<RecibosPdf data={{ dataVoucher: {...billSelected}, items: dataDoctor, doctor: doctors.find(item => item.employeeFileId.toString() === doctor) }} />}
                                                    >
                                                        {({ blob, url, loading, error }) => {
                                                            console.log(blob);
                                                            // Do whatever you need with blob here
                                                            return <Button 
                                                                sx={{ py: 1 }}
                                                                onClick={() => printFile(blob)} 
                                                                // disabled={!permissions.imprime || typeForm === "create"} 
                                                                variant="contained" fullWidth color="secondary"
                                                            >
                                                                Imprimir
                                                            </Button>
                                                        }}
                                                    </BlobProvider>
                                                :
                                                    <Button 
                                                        disabled
                                                        variant="contained" fullWidth color="secondary"
                                                        sx={{ py: 1 }}
                                                    >
                                                        Imprimir
                                                    </Button>
                                                }
                                            </Grid>
                                            <Grid item md={2} xs={4}>
                                                <Button 
                                                    disabled={(dataDoctor !== null && dataDoctor.length === 0) || billSelected !== null} 
                                                    variant="contained" 
                                                    fullWidth
                                                    color='secondary'
                                                    onClick={() =>  saveData()}
                                                    sx={{ py: 1 }}
                                                >
                                                    Guardar
                                                </Button>
                                            </Grid>
                                            <Grid item md={2} xs={12}>
                                                &nbsp;
                                            </Grid>
                                            <Grid item md={4} xs={12}>
                                                <Grid container columnSpacing={1}>
                                                    <Grid item md={8} xs={8}>
                                                        <TextField
                                                            label="Recibo #"
                                                            size="small"
                                                            value={idToSearch}
                                                            onChange={(e) => setidToSearch(e.target.value)}
                                                            // disabled={!permissions.consulta}
                                                        />
                                                    </Grid>
                                                    <Grid item md={4} xs={4}>
                                                        <LoadingButton 
                                                            variant="contained" 
                                                            color="primary"
                                                            type="button"
                                                            sx={{ minWidth: "100%", width: "100%", py: 1}}
                                                            onClick={() => getBillById()}
                                                            loading={search}
                                                            disabled={idToSearch === ""}
                                                        >
                                                            Buscar
                                                        </LoadingButton>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    }
                                </Box>

                                {searchData 
                                    ?
                                        <Box>
                                            <Loader />
                                        </Box>
                                    :
                                    <div>

                                        {doctor !== null &&
                                            <div>
                                                <Box>
                                                    <Typography sx={{fontWeight: "bold", mb: 2 }}>
                                                        Items
                                                    </Typography>
                                                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}> 
                                                        <DataGrid
                                                            rows={dataDoctor}
                                                            columns={columns}
                                                            components={{
                                                                NoRowsOverlay: () => (
                                                                <Stack height="100%" alignItems="center" justifyContent="center">
                                                                    No se han encontrado datos de recibo
                                                                </Stack>
                                                                )
                                                            }}

                                                            // onCellEditStop={(params) => handleCellEditStop(params)}
                                                            // experimentalFeatures={{ newEditingApi: true }}
                                                            // onCellEditStart={(params) => handleCellEditStart(params)}
                                                            // processRowUpdate={processRowUpdate}

                                                            // onCellEditCommit={(params) => handleCellEditStop(params)}
                                                            // onCellFocusOut={(params)   => validateChanges(params)}

                                                            hideFooter
                                                            page={0}
                                                            pageSize={6}
                                                            rowsPerPageOptions={[6,10,20]}
                                                            // autoPageSize
                                                            rowCount={dataDoctor.length}

                                                            disableColumnFilter
                                                            disableColumnMenu
                                                            autoHeight 
                                                            disableColumnSelector
                                                            disableSelectionOnClick
                                                            // checkboxSelection
                                                        />
                                                    </div>
                                                    {(dataDoctor.length > 0) &&
                                                        <div>
                                                            <Typography sx={{fontWeight: "bold", mt: 2}} align="right">
                                                                Sub Total : Bs. {totalAmount}
                                                            </Typography>
                                                        </div>
                                                    }
                                                </Box>

                                                <Typography sx={{mb: 3, mt: 3,  fontWeight: "bold"}}>
                                                    Agregar item
                                                </Typography>

                                                <FormikProvider value={formik}>
                                                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                                                        <Box>
                                                            <Grid container columnSpacing={3}>
                                                                <Grid item md={6} xs={12} sx={{mb: 2}}>
                                                                    <TextField
                                                                        size='small'
                                                                        fullWidth
                                                                        autoComplete="description"
                                                                        type="text"
                                                                        label="Descripción"
                                                                        // multiline
                                                                        // minRows={4}
                                                                        // maxRows={6}
                                                                        {...getFieldProps('description')}
                                                                        error={Boolean(touched.description && errors.description)}
                                                                        helperText={touched.description && errors.description}
                                                                    />
                                                                </Grid>
                                                                <Grid item md={2} xs={12} sx={{mb: 2}}>
                                                                    <TextField
                                                                        size='small'
                                                                        fullWidth
                                                                        autoComplete="amount"
                                                                        type="text"
                                                                        label="Precio"
                                                                        // multiline
                                                                        // minRows={4}
                                                                        // maxRows={6}
                                                                        {...getFieldProps('amount')}
                                                                        error={Boolean(touched.amount && errors.amount)}
                                                                        helperText={touched.amount && errors.amount}
                                                                    />
                                                                </Grid>
                                                                <Grid item md={2} xs={12} sx={{mb: 2}}>
                                                                    <TextField
                                                                        size='small'
                                                                        fullWidth
                                                                        autoComplete="address"
                                                                        type="text"
                                                                        label="Cantidad"
                                                                        // multiline
                                                                        // minRows={4}
                                                                        // maxRows={6}
                                                                        {...getFieldProps('quantity')}
                                                                        error={Boolean(touched.quantity && errors.quantity)}
                                                                        helperText={touched.quantity && errors.quantity}
                                                                    />
                                                                </Grid>
                                                                <Grid item md={2} xs={12} sx={{mb: 2}}>
                                                                    <LoadingButton 
                                                                        variant="contained" 
                                                                        color="primary"
                                                                        type="submit"
                                                                        sx={{ minWidth: "100%", width: "100%"}}
                                                                        // disabled={doctor === null || (doctor !== null && amount === "")}
                                                                        // onClick={() => updateAmount()}
                                                                        // loading={sending}
                                                                        // disabled={textSearchData === "" || !permissions.consulta}
                                                                    >
                                                                        Agregar
                                                                    </LoadingButton>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>

                                                    </Form>
                                                </FormikProvider>
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
