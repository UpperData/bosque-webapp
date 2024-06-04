import React, { useEffect, useState } from 'react'
import axios from "../../../../auth/fetch"
import moment from "moment";
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { CardContent, Hidden, Box, Grid, Container, Typography, Card, Button, Modal, TextField, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import Loader from '../../../../components/Loader/Loader';
import Page from '../../../../components/Page';


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

export default function PatientHistory() {

    const params                = useParams();

    const [sending, setsending] = useState(false);
    const [loading, setloading] = useState(true);
    const [search, setsearch]   = useState(true);
    const [data, setdata]       = useState(null);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    // console.log(params.id);
    let urlGetData          = "/PaTIENT/medicaL/HistoRy/"+params.id;

    const LoginSchema =     Yup.object().shape({
        text:               Yup.string().required('')
    });

    const formik = useFormik({
        initialValues: {
            text:      ""
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, {resetForm}) => {
          try {

            setsending(true);
            setalertErrorMessage("");
            setalertSuccessMessage("");
            
          } catch(e) {
            setsending(false);
          }
        }
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

    const getList = async () => {
        if(params.id){
            axios.get(urlGetData)
            .then((res) => {

                console.log("---Data---");
                console.log(res.data);

                setdata(res.data.data);
                setsending(false);
                setloading(false);

            }).catch((err) => {

                let error = err.response;
                if(error){
                    if(error.data){
                        setloading(true);
                    }
                }
                
            });
        }
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await getList();
            }
        }
    }, []);


    let columns = [
        /*
        { 
            field: 'appoitnmentId',     
            headerName: `#`,
            width: 30,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                return <Typography color="primary" sx={{fontWeight: 'bold', mb:0}} variant="body">
                    {data.row.appoitnmentId}
                </Typography>
            }
        },
        */
        { 
            field: 'dateAppointment',     
            headerName: `Fecha`,
            width: 100,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                    {moment(data.row.dateAppointment).format("DD/MM/YYYY")}
                </Typography>
            }
        },
        { 
            field: 'appointmentType',     
            headerName: `Hora`,
            width: 60,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                    {moment(data.row.dateAppointment).format("hh:mm")}
                </Typography>
            }
        },
        { 
            field: 'description',     
            headerName: `Reporte del medico`,
            width: 200,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                    {data.row.medicalReports[0].description}
                </Typography>
            },
            cellClassName: "normalLineHeight"
        },
        { 
            field: 'medicines',     
            headerName: `Medicinas`,
            width: 230,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                let list = data.row.medicalReports[0].medicines;
                let i    = 0;

                return <div>
                            {list.map((item, key) => {
                                let itemId = item.id;
                                i++;
                                return <Typography key={key} sx={{fontWeight: 'normal', mb:0}} variant="span">
                                    {item.name + ((list.length === i) ? "." : ",")}
                                </Typography>
                            })}
                        </div> 
            },
            cellClassName: "normalLineHeight"
        },
        { 
            field: 'exams',     
            headerName: `Examenes`,
            width: 230,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                let list = data.row.medicalReports[0].exams;
                let i    = 0;

                return <div>
                            {list.map((item, key) => {
                                let itemId = item.id;
                                i++;
                                return <Typography key={key} sx={{fontWeight: 'normal', mb:0}} variant="span">
                                    {item.name + ((list.length === i) ? "." : ",")}
                                </Typography>
                            })}
                        </div> 
            },
            cellClassName: "normalLineHeight"
        }
    ];

    return (
        <Page title="Historia del paciente | RepuestosGo">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4">
                    Historia del paciente
                </Typography>
            </Box>

            <Grid sx={{ pb: 3 }} item xs={12}>
                {!loading &&
                    <Card>
                        <CardContent>

                            {alertSuccessMessage !== "" &&
                                <Alert sx={{my: 3}} severity="success">
                                    {alertSuccessMessage}
                                </Alert>
                            }

                            {alertErrorMessage !== "" &&
                                <Alert sx={{my: 3}} severity="error">
                                    {alertErrorMessage}
                                </Alert>
                            }

                            {data !== null 
                            ?
                                <div>
                                    <Typography variant="h4">
                                        Nombre: 
                                        <Typography sx={{fontWeight: 800, ml: 1}} variant="h5" component="span">{data.nombre+" "+data.apellido}</Typography>
                                        <Typography color="primary" variant="span" sx={{ml: 1}}>
                                            {"( "+(data.document.nationality+"-"+data.document.number).toLocaleLowerCase()+" )"}
                                        </Typography>
                                    </Typography>

                                    
                                    <Typography component="p" sx={{mb: 3, fontWeight: 700}}>
                                    
                                        <Typography variant="span" sx={{mr: 1}}>
                                            Edad:
                                        </Typography>
                                        <Typography variant="span" sx={{mr: 1}}>
                                            {moment().diff(moment(data.edad.split("T")[0], "YYYY-MM-DD"), 'years')},
                                        </Typography>

                                        <Typography variant="span" sx={{mr: 1}}>
                                            Sexo:
                                        </Typography>
                                        <Typography variant="span" sx={{mr: 1}}>
                                            {data.document.gender === "H" ? "Masculino" : "Femenino"}
                                        </Typography>

                                    </Typography>
                                    

                                    <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>   
                                        <DataGrid
                                            sx={{mb:4}}
                                            rows={data.appointments}
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
                                            DataGridViewTextBoxColumn

                                            getRowId={row => row.appoitnmentId}
                                            // checkboxSelection
                                        />
                                    </div>
                                </div>
                            :
                                <Alert sx={{my: 3}} severity="info">
                                    No ha sido posible obtener la data solicitada.
                                </Alert>
                            }

                        </CardContent>
                    </Card>
                }

                {loading &&
                    <Card>
                        <Loader />
                    </Card>
                }
            </Grid>
        </Container>
        </Page>
    );
}
