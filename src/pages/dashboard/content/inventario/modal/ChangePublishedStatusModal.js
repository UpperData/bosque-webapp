import React, {useEffect, useState} from 'react'
import AddArticleModal from "./AddArticleModal";
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

function ChangePublishedStatusModal({ 
    show = false, 
    handleShowModal = (show) => {}, 
    reset = () => {}, 
    edit = null ,
}) {
    const [sending, setsending] = useState(false);
    console.log('data edit', edit);

    const changeStatus = () => {
        setsending(true);

        let data = {
            articleId:   edit.article.aricleId, 
            isPublished: !edit.isPublished
        }

        console.log('data', data);
        axios.put('invetory/publishING/set', data).then((res) => {

            console.log(res.data);
            toast.success(res.data.message);
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
                    {edit.isPublished ? 'Ocultar artículo' : 'Publicar artículo'}
                </Typography>
                <Typography id="modal-modal-title" variant="p" component="p" sx={{mb: 3}}>
                    ¿Desea {edit.isPublished ? 'Ocultar' : 'Publicar'} el artículo {edit.article.name}?
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
                        {edit.isPublished ? 'Ocultar' : 'Publicar'}
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

export default ChangePublishedStatusModal;