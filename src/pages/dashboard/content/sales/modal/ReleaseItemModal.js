import React, {useEffect, useState} from 'react'

import { 
    Box, 
    Grid, 
    Stack, 
    ButtonGroup, 
    Tooltip, 
    Container, 
    Typography, 
    Alert,  
    Card, 
    CardContent, 
    Hidden, 
    Button, 
    Modal, 
    Select,
    TextField, 
    Checkbox, 
    MenuItem, 
    InputLabel, 
    FormControl,
    FormHelperText
} from '@mui/material';

import { LoadingButton } from '@mui/lab';
import { alpha, styled } from '@mui/material/styles';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import moment from "moment";

import axios from "../../../../../auth/fetch"
import Loader from '../../../../../components/Loader/Loader';
import CategorySelect from '../../../../../components/selects/Category';
import ClaseSelect from '../../../../../components/selects/Clase';
import AnioSelect from '../../../../../components/selects/Anio';
import MarcaSelect from '../../../../../components/selects/Marca';
import ModelSelect from '../../../../../components/selects/Models';
import SubCategorySelect from '../../../../../components/selects/SubCategory';
import UploaderProductImg from '../../rrhh/Components/UploaderProductImages';
import { toast } from 'react-toastify';

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 5),
    width: "95%",
    margin: "auto",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: "#fff",
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        // width: 150,
      },
    },
};

function ReleaseItemModalModal({ 
    show = false, 
    handleShowModal = (show) => {}, 
    reset = () => {}, 
    item = null ,
}) {
    const [sending, setsending] = useState(false);    

    const changeStatus = () => {
        setsending(true);
        let data = {
            "itemLot":{},
            "accountId":null,
            "isSUW":null
            };
            let shoppingCarId=null;
            data.itemLot["shoppingCarId"]= item.id;
            data.itemLot["id"]=item["itemLot.id"];
            data.itemLot["lotId"]=item["itemLot.lot.id"];
            data.accountId=item["account.id"];
            data.isSUW=item["itemLot.lot.article.isSUW"];
        console.log(data)
        axios.put('/CAR/Cancel', data).then((res) => {
          
            toast.success(res.message);
            if(res.result){ // si se pudo liberar
                // envia notificación push
                let dataPush={
                     "msj":"¡Aprovecha!, reserva tu pescado con nuestra App",
                     "title":item["itemLot.lot.article.name"]+ " - "+item["itemLot.weight"] + " Kg  disponible",
                     "largeIcon":item["itemLot.lot.article.image"]
                     
                }
                axios.post('Notifications/SEND/push', dataPush).then((res) => {
                    console.log("Push enviada")
                }).catch((err) => {
                    console.error('Error enviando notificación push a la app');
                    console.error(err);
                });
            } 
            setsending(false);
            reset();            
        }).catch((err) => {
            console.error(err);
        });
    }

    return (
        <Modal     
            open={show}
            onClose={() => handleShowModal(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            style={{ 
                display:'flex', 
                alignItems:'center', 
                justifyContent:'center',
                zIndex: 1200
            }}
        >
            <RootStyle>
                <Typography id="modal-modal-title" variant="h4" component="h4" sx={{mb: 3}}>
                    Liberar pedido
                </Typography>
                <Typography id="modal-modal-title" variant="p" component="p" sx={{mb: 3}}>
                     { "¿Desea liberar "+ item["itemLot.lot.article.name"]+" ( "+parseFloat(item["itemLot.weight"]).toFixed(2) +" Kg ) ?"}?
                </Typography>
                <Box flex justifyContent="center" sx={{mt: 2}}>
                    <LoadingButton 
                        variant="contained" 
                        color="primary"
                        type="submit"
                        sx={{px: 2.5, py: 1.5}}
                        onClick={() => changeStatus()}
                        loading={sending}
                        disabled={sending}
                    >
                        Liberar
                    </LoadingButton>
                    <Button 
                        disabled={sending} 
                        size="large" 
                        sx={{px: 2.5 , mx: 1 }} 
                        onClick={() => handleShowModal(false)}
                    >
                        Cancelar
                    </Button>
                </Box>
            </RootStyle>
        </Modal>
    )
}

export default ReleaseItemModalModal;