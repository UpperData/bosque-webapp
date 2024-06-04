import { useState, useEffect } from "react"
import { Modal, Input,Box, Typography, Card, TextField,  Grid, ButtonGroup, Button, FormControl, Stack, Alert } from '@mui/material';

import { toast } from 'react-toastify';

import { Icon } from '@iconify/react';
import Delete from "@iconify/icons-ic/delete"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function UploaderProductImg(props) {

    const accept    = '.jpg, .jpeg, .png';
    const maxsize   = 2;
    const maxFiles  = 3;
    const [files, setfiles] = useState([]);

    let id                              = props.id  ? props.id : "uploader";
    let placeholder                     = props.placeholder  ? props.placeholder : "search";
    let returnFileType                  = props.returnFileType  ? props.returnFileType : "base64";
    let typeRender                      = props.renderType      ? props.renderType : "Stack";

    function getPreview(fileData) {
        return function(resolve) {
            let readerPreview   = new FileReader();

            readerPreview.readAsDataURL(fileData);
            readerPreview.onloadend = () => {
                const result = readerPreview.result;
                const base64 = result.split(',')[1];
                
                // console.log(result);
                resolve(base64);
            };
        }
    }

    function getBuffer(fileData) {
        return function(resolve) {
            let reader          = new FileReader();

            /*
                if(showPreview){
                    
                        var auxreader = new FileReader();
                        auxreader.readAsDataURL(fileData);

                        auxreader.onloadend = () => {
                            var result = auxreader.result;
                            //props.handlePreview(result);
                        };
                    
                    console.log('mostrando preview');
                }
            */

            if(returnFileType === 'binary'){
                // console.log('binary');
                reader.readAsArrayBuffer(fileData);

                reader.onload = function() {
                    const result = this.result;
                    const array = new Uint8Array(result);
                    // var binaryString = String.fromCharCode.apply(null, array);
                    resolve(array);
                }
            }

            if(returnFileType === 'base64'){
                // console.log('base64');
                // console.log(fileData);

                reader.readAsDataURL(fileData);
                reader.onloadend = () => {
                    const result = reader.result;
                    const base64 = result.split(',')[1];
                    
                    // console.log(result);
                    resolve(result);
                };
            }

            if(returnFileType === 'base64complete'){
                // console.log('base64');
                // console.log(fileData);

                reader.readAsDataURL(fileData);
                reader.onloadend = () => {
                    const result = reader.result;
                    // var base64 = result.split(',')[1];
                    
                    // console.log(result);
                    resolve(result);
                };
            }

            /*
                if(returnFileType === 'base64-binary'){
                    console.log('base64 to binary');
                    console.log(fileData);

                    reader.readAsDataURL(fileData);
                    reader.onloadend = () => {
                        const result = reader.result;
                        const base64 = result.split(',')[1];
                        let binary   = binEncode(base64);

                        resolve(binary);
                    };
                } 
            */
        }
    }

    function convertTo(fileSelected) {
        let fileData = new Blob([fileSelected]);
        let promise  = new Promise(getBuffer(fileData));

        // Wait for promise to be resolved, or log error.
        promise.then((data) => {
            /*
                if(props.onChange){
                    props.onChange(data);
                    setfileDataByProps(data);
                }
            */
            
            console.log(data);

            let filesArr = [...files];
            filesArr.push(data);
            setfiles(filesArr);

            console.log(filesArr);

            /*
                let preview  = new Promise(getPreview(fileData));
                preview.then((data) => {
                    let filesArr = [...files];
                    filesArr.push(data);
                    setfiles(filesArr);

                    console.log(filesArr);
                    // setdataPreview(data);
                }).catch((err) => {
                    console.log('Error: ',err);
                });
            */

        }).catch((err) => {
            console.log('Error: ',err);
        });
    }

    const handleImageUpload = (e) => {
        e.preventDefault();
        let filesSelected   = e.target.files;
        let filesInArr      = files.length;
        
        for (let i = 0; i < filesSelected.length; i++) {
            const file  = filesSelected[i];
            let type    = file.name.split('.').pop();

            if(filesInArr < maxFiles){
                if(accept.includes(type)){

                    let sizeInBytes = file.size;
                    let sizeInMB = (sizeInBytes / (1024*1024)).toFixed(2);

                    if(sizeInMB <= maxsize){
                        filesInArr++;
                        convertTo(file);
                    }else{
                        toast.error(`El tamaño del archivo es superior al permitido (${maxsize}mb)`);
                    }
                }else{
                    toast.error(`Error: ${file.name} Formato ${type} no permitido para este archivo.`);
                }
            }else{
                toast.error(`Solo puede cargar un máximo de ${maxFiles} imagenes`);
            }
        }

        document.getElementById("article-photo-file-uploader").value = "";
    }

    return (
        <div>
            <Box sx={{width: '100%', textAlign: 'left'}}>
                <Typography 
                    color='text.secondary' 
                    id="modal-modal-title" 
                    variant="h6" 
                    component="h6"  
                    sx={{mb: 2}}
                >
                    Imagenes
                </Typography>

                {files.length === 0 &&
                    <Alert color="info" sx={{mb: 2}}>
                        Sin imagenes seleccionadas
                    </Alert>
                }

                {files.length >= 1 &&
                    <Box sx={{px: 3, py: 3}}>
                        <Swiper
                            spaceBetween={50}
                            slidesPerView={1}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                        >
                            {files.map((item, key) => (
                                <SwiperSlide key={key}>
                                    <img 
                                        src={item} 
                                        alt={`article-dataimg-${key}`} 
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Box>
                }
                
                <Grid container columnSpacing={3} alignItems="center" sx={{mb: 3}}>
                    <Grid item md={4} xs={12}>
                        <Typography>
                            {files.length} de {maxFiles}
                        </Typography>
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <label className="content-upload-label" htmlFor='article-photo-file-uploader'>
                            <Input 
                                accept="image/*" 
                                id='article-photo-file-uploader'
                                multiple 
                                type="file" 
                                onChange={(e) => handleImageUpload(e)} 
                                disabled={files.length === maxFiles}
                            />
                            
                            <Button 
                                fullWidth 
                                variant="contained" 
                                component="span"
                                disabled={files.length === maxFiles}
                            >
                                Agregar imagen
                            </Button>
                        </label>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}