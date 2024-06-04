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
import { InventoryPdf } from './pdf/Inventory';

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
        name: "Art. stock bajo",
        url: "/rePorTs/iNVEntory/low/stock"
    },
    {
        id: 1,
        name: "Art. Agotados",
        url: "/rePorTs/iNvEntory/sold/out"
    },
    {
        id: 2,
        name: "Art. sin existencia en almacén",
        url: "/rePorTs/iNvEntory/out/wharehouse"
    },
    {
        id: 3,
        name: "Art. en transito",
        url: "/rePorTs/iNvEntory/in/aSIGnmenT"
    }
]

function Inventory() {
    const [loading, setloading]                         = useState(false);
    const [search, setsearch]                           = useState(false);

    const [appointmenttype, setappointmenttype]         = useState("");
    const [productType, setproductType]                 = useState("");

    const [dateFrom, setdateFrom]                       = useState(new Date());
    const [dateTo, setdateTo]                           = useState(addDays(new Date(), 1));

    const [data, setdata]                               = useState(null);
    const [list, setlist]                               = useState([]);

    const [alertSuccessMessage, setalertSuccessMessage] = useState("");
    const [alertErrorMessage,   setalertErrorMessage]   = useState("");

    const searchAppointments = () => {
        if(appointmenttype !== ""){
            setsearch(true);
            // let url = types[appointmenttype].url+format(dateFrom, "yyyy-MM-dd")+"/"+format(dateTo, "yyyy-MM-dd");

            let url = types[appointmenttype].url;
            axios.get(url).then((res) => {
                console.log(res);
                
                if(Array.isArray(res)){
                    setdata(res);
                    setsearch(false);
                }else{
                    setdata(res.rows);
                    setsearch(false);
                }

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
    }

    let columns = [
        { 
            field: 'article',     
            headerName: `Artículo`,
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
              let data = cellValues;
              return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                  {data.row.article.name}
              </Typography>
          }
        },
        { 
          field: 'price',     
          headerName: `Precio`,
          minWidth: 150,
          flex: 1,
          sortable: false,
          renderCell: (cellValues) => {
            let data = cellValues;
            return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                {data.row.price}
            </Typography>
        }
      },
        { 
            field: 'existence',     
            headerName: `Existencia`,
            minWidth: 150,
            flex: 1,
            sortable: false,
            renderCell: (cellValues) => {
              let data = cellValues;
              return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                  {data.row.existence}
              </Typography>
          },
        },
        { 
          field: 'minStock',     
          headerName: `Min stock`,
          minWidth: 150,
          flex: 1,
          sortable: false,
          renderCell: (cellValues) => {
            let data = cellValues;
            return <Typography sx={{fontWeight: 'normal', mb:0}} variant="body">
                {data.row.minStock}
            </Typography>
        },
      },
    ];

    return (
        <Page title="Reportes - Inventario | RepuestosGo">
            <Container maxWidth="xl">
                <Box sx={{ pb: 3 }}>
                    <Typography variant="h4">
                      Inventario
                    </Typography>
                </Box>

                <Grid sx={{ pb: 3 }} item xs={12}>
                    <Card>
                        <CardContent>
                            
                            <Typography variant="h6" sx={{mb: 2}}>
                                Elija reporte
                            </Typography>

                            <Grid container justifyContent="start" columnSpacing={3}> 
                                <Grid item md={6} sx={{ mb:2 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="appointment">
                                            Tipo de artículo
                                        </InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="appointment"
                                            id="appointment-type-select"
                                            value={appointmenttype}
                                            onChange={(e) => setappointmenttype(e.target.value)}
                                            label="Tipo de artículo"
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
                            </Grid>

                            {appointmenttype === "" &&
                                <Alert severity="info">
                                    Seleccione un tipo de artículo.
                                </Alert>
                            }

                            {data !== null && !search &&  
                                <Box>
                                    {data.length > 0 
                                        ?
                                        <div>
                                            <Grid justifyContent="end"  container columnSpacing={3}> 
                                                <Grid item md={3} sx={{ mb:2 }}>
                                                    <ExcelFile
                                                        filename={`Reporte de inventario ${types[appointmenttype].name}`}
                                                        element={
                                                            <Button variant="contained" fullWidth color="primary">
                                                                Descargar Excel
                                                            </Button>
                                                        }
                                                    >
                                                        <ExcelSheet data={data} name={`Reporte de inventario ${types[appointmenttype].name}`}>
                                                            
                                                            <ExcelColumn label="Artículo"   value={(col)        => col.article.name} />
                                                            <ExcelColumn label="Precio"     value={(col)        => col.price} />
                                                            <ExcelColumn label="Existencia" value={(col)        => col.existence} />    
                                                            <ExcelColumn label="Min stock"  value={(col)        => col.minStock} />
                                                                                                                    
                                                        </ExcelSheet>
                                                    </ExcelFile>
                                                </Grid>
                                                <Grid item md={3} sx={{ mb:2 }}>
                                                    <Button 
                                                        variant="contained" 
                                                        color="primary" 
                                                        fullWidth    
                                                        className={data !== null ? "pdf-download-link" : ""}
                                                    >   
                                                        <PDFDownloadLink
                                                            document={<InventoryPdf data={{ rows: data, appointment: types[appointmenttype] }} />}
                                                            fileName="inventario.pdf"
                                                        >
                                                            Descargar Pdf
                                                        </PDFDownloadLink>
                                                    </Button>
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

export default Inventory