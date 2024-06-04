import React, {useState, useEffect} from "react"
import { Box, Grid, Container, Typography, Card, CardContent, Alert, Button, Modal, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from "../../../../auth/fetch"

import { DataGrid } from '@mui/x-data-grid';
import moment from "moment";

// components
import Page from '../../../../components/Page';
import Loader from "../../../../components/Loader/Loader";

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


function Administracion() { 

    const [loading, setloading]                 = useState(true);
    const [search, setsearch]                   = useState(true);
    const [sending, setsending]                 = useState(false);

    const [list, setlist]                       = useState([]);

    const getData = () => {
        const url = '/InVETorY/aRIcLe/list/*';
        axios.get(url).then((res) => {
            if(res.data.result){
                console.log('=============');
                console.log(res.data);

                setlist(res.data.data);
                setloading(false);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(async () => {
        if(loading){
            if(search){
                await getData();
            }
        }
    })

    return (
        <Page title="Contratos | RepuestosGo">
            <Container maxWidth="xl">
                <Box sx={{ pb: 3 }}>
                    <Typography variant="h4" color="white.main">
                        Administración de inventario
                    </Typography>
                </Box>
                <Grid sx={{ pb: 3 }} item xs={12}>
                    <Card>
                        {!loading ? 
                            <CardContent>
                                <Typography variant="h5" alignItems="center" sx={{mb: 3}}>
                                    Listado de artículos
                                </Typography>
                            </CardContent>
                            :
                            <Loader /> 
                        }
                    </Card>
                </Grid>
            </Container>
        </Page>
    )
}

export default Administracion