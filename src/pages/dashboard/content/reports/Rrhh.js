import React, {useState, useEffect} from 'react'

// material
import { Box, Grid, Stack, ButtonGroup, Tooltip, Container, Typography, Alert,  Card, CardContent, Hidden, Button, Modal, TextField, Checkbox, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { LoadingButton, DatePicker, LocalizationProvider, TimePicker  } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import addDays from 'date-fns/addDays'
import {format, isBefore} from 'date-fns'

// components
import Page from '../../../../components/Page';
import moment from "moment";
import axios from "../../../../auth/fetch"
import Loader from '../../../../components/Loader/Loader';

import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";

import ExportExcel from "react-export-excel"
import { AppointmentsPdf } from './pdf/Appointments';

const ExcelFile     = ExportExcel.ExcelFile;
const ExcelSheet    = ExportExcel.ExcelSheet;
const ExcelColumn   = ExportExcel.ExcelColumn;

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

const types = [
    {
        id: 0,
        name: "Personal activo",
        url: "/reporTs/rrhh/ActiveD/"
    },
    {
        id: 1,
        name: "Personal inactivo",
        url: "/reporTs/rrhh/inActiveD/"
    },
    {
        id: 2,
        name: "Personal Femenino",
        url: "/reporTs/RRhh/female/"
    },
    {
        id: 3,
        name: "Personal Masculino",
        url: "/reporTs/RRhh/male/"
    }
]

function Rrhh() {
    const [loading, setloading]                         = useState(false);
    const [search, setsearch]                           = useState(false);

    const [appointmenttype, setappointmenttype]         = useState("");

    const [dateFrom, setdateFrom]                       = useState(new Date());
    const [dateTo, setdateTo]                           = useState(addDays(new Date(), 1));

    const [data, setdata]                               = useState(null);
    const [list, setlist]                               = useState([]);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const searchAppointments = () => {
        if(appointmenttype !== ""){
            setsearch(true);
            let url = types[appointmenttype].url+format(dateFrom, "yyyy-MM-dd")+"/"+format(dateTo, "yyyy-MM-dd");

            axios.get(url).then((res) => {
                console.log(res);

                setdata(res);
                setsearch(false);

            }).catch((err) => {
                console.error(err);
            });
        }
    }

    useEffect(() => {
        if(!search){
            searchAppointments();
        }
    }, [dateFrom ,dateTo, appointmenttype]);
    

    const changeDateFrom = (value) => {
        setdateFrom(value);

        if(dateTo === "" || isBefore(dateTo, value)){
            let newDate = addDays(new Date(value), 1);
            setdateTo(newDate);
        }

        console.log(value);
    }

    let columns = [
        { 
            field: 'id',     
            headerName: `#`,
            width: 70,
            sortable: false,
        },
        { 
            field: 'fechaRegistro',     
            headerName: `Fecha de registro`,
            width: 150,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                    {moment(data.row.fechaRegistro).format("DD/MM/YYYY")}
                </Typography>
            }
        },
        { 
            field: 'fisrtName',     
            headerName: `Nombre`,
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                    {data.row.fisrtName+" "+ data.row.lastName}
                </Typography>
            }
        },
        { 
            field: 'documentId',     
            headerName: `Cédula`,
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                    {data.row.documentId.nationality.toLowerCase()+"-"+ data.row.documentId.number}
                </Typography>
            }
        },
        { 
            field: 'cargo',     
            headerName: `Departamento`,
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
                let data = cellValues;
                return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                    {data.row.cargo.direccion.name+", "+data.row.cargo.departamento.name}
                </Typography>
            }
        }
    ];

    return (
        <Page title="Reportes - Atención Medica | RepuestosGo">
            <Container maxWidth="xl">
                <Box sx={{ pb: 3 }}>
                    <Typography variant="h4">
                        Personal Médico
                    </Typography>
                </Box>

                <Grid sx={{ pb: 3 }} item xs={12}>
                    <Card>
                        <CardContent>
                            
                            <Typography variant="h6" sx={{mb: 2}}>
                                Elija reporte
                            </Typography>

                            <Grid container justifyContent="end" columnSpacing={3}> 
                                <Grid item md={4} sx={{ mb:2 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="appointment">
                                            Tipo de personal
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="appointment"
                                            id="appointment-type-select"
                                            value={appointmenttype}
                                            onChange={(e) => setappointmenttype(e.target.value)}
                                            label="Tipo de personal"
                                            MenuProps={MenuProps}
                                        >
                                            {types.map((item, key) => {
                                                let dataItem = item;
                                                return <MenuItem key={key} value={dataItem.id}>
                                                            {dataItem.name}
                                                        </MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sx={{ mb:2 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Desde"
                                            value={dateFrom}
                                            onChange={(value) => changeDateFrom(value)}
                                            renderInput={
                                                (params) => <TextField 
                                                            fullWidth
                                                            size='small' 
                                                            // {...getFieldProps('dateAppointment')}
                                                            // helperText={touched.dateAppointment && errors.dateAppointment} 
                                                            // error={Boolean(touched.dateAppointment && errors.dateAppointment)} 
                                                            {...params} 
                                                />
                                            }
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item md={4} sx={{ mb:2 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Hasta"
                                            value={dateTo}
                                            onChange={(value) => setdateTo(value)}
                                            shouldDisableDate={(date) => isBefore(date, new Date(dateFrom))}
                                            renderInput={
                                                (params) => <TextField 
                                                            fullWidth
                                                            size='small' 
                                                            // {...getFieldProps('dateAppointment')}
                                                            // helperText={touched.dateAppointment && errors.dateAppointment} 
                                                            // error={Boolean(touched.dateAppointment && errors.dateAppointment)} 
                                                            {...params} 
                                                />
                                            }
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>

                            {appointmenttype === "" &&
                                <Alert severity="info">
                                    Seleccione un tipo de cita.
                                </Alert>
                            }

                            {data !== null && !search &&  
                                <Box>
                                    {data.count > 0 
                                        ?
                                        <div>
                                            <Grid justifyContent="end"  container columnSpacing={3}> 
                                                <Grid item md={3} sx={{ mb:2 }}>
                                                    {/* 
                                                    <ExcelFile
                                                        filename="Reporte de citas"
                                                        element={
                                                            <Button variant="contained" fullWidth color="primary">
                                                                Descargar Excel
                                                            </Button>
                                                        }
                                                    >
                                                        <ExcelSheet data={data.rows} name={`Reporte de citas desde: ${moment(new Date(dateFrom)).format("DD/MM/YYYY")} hasta: ${moment(new Date(dateTo)).format("DD/MM/YYYY")}`}>
                                                            
                                                            <ExcelColumn label="#" value="id" />
                                                            <ExcelColumn label="Fecha" value={(col)     => moment(col.fecha).format("DD/MM/YYYY")} />
                                                            <ExcelColumn label="Hora" value={(col)      => moment(col.hora).format("hh:mm A")} />    
                                                            <ExcelColumn label="Nombre del paciente" value={(col)  => col.patient.nombre+" "+ col.patient.apellido} />
                                                                                                                    
                                                        </ExcelSheet>
                                                    </ExcelFile>
                                                    */}
                                                </Grid>
                                                <Grid item md={3} sx={{ mb:2 }}>
                                                    {/*
                                                    dateFrom && dateTo &&
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary" 
                                                            fullWidth    
                                                            className={data !== null ? "pdf-download-link" : ""}
                                                        >   
                                                            <PDFDownloadLink
                                                                document={<AppointmentsPdf data={{ rows: data.rows, from: dateFrom, to: dateTo, appointment: types[appointmenttype] }} />}
                                                                fileName="reporte_de_citas.pdf"
                                                            >
                                                                Descargar Pdf
                                                            </PDFDownloadLink>
                                                        </Button>
                                                    */}
                                                </Grid>
                                            </Grid>

                                            <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>
                                                <DataGrid
                                                    sx={{mb:4}}
                                                    rows={data.rows}
                                                    columns={columns}

                                                    // page={0}
                                                    pageSize={5}
                                                    rowsPerPageOptions={[5,10,15]}
                                                    // autoPageSize
                                                    rowCount={data.rows.length}

                                                    disableColumnFilter
                                                    disableColumnMenu
                                                    autoHeight 
                                                    disableColumnSelector
                                                    disableSelectionOnClick
                                                    // hideFooter
                                                    // checkboxSelection
                                                />
                                            </div>

                                        </div>
                                        :
                                        <Alert severity="info">
                                            No se han encontrado coincidencias.
                                        </Alert>
                                    }
                                </Box>
                            }

                            {search &&
                                <Loader />
                            }
                            
                        </CardContent>
                    </Card>
                </Grid>
            </Container>
        </Page>
    )
}

export default Rrhh