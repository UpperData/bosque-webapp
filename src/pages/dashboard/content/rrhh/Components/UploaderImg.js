import { useState, useEffect } from "react"
import { Modal, Input,Box, Typography, Card, TextField,  Grid, ButtonGroup, Button, FormControl, Stack } from '@mui/material';

import { toast } from 'react-toastify';

import { Icon } from '@iconify/react';
import Delete from "@iconify/icons-ic/delete"

function UploaderImg(props) {

    const [file, setfile]                       = useState(null);
    const [fileDataByProps, setfileDataByProps] = useState(null);
    const showPreview                   = props.showPreview     ? props.showPreview : false;
    const [dataPreview, setdataPreview] = useState(null);
    let id                              = props.id  ? props.id : "uploader";
    let placeholder                     = props.placeholder  ? props.placeholder : "search";
    let returnFileType                  = props.returnFileType  ? props.returnFileType : "base64";
    let typeRender                      = props.renderType      ? props.renderType : "Stack";

    const [showModalPreview, setshowModalPreview] = useState(false);

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
                    resolve(base64);
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

    function convertTo(filesSelected) {
        // console.log('convirtiendo files:', filesSelected);

        let fileData = new Blob([filesSelected[0]]);
        setfile(filesSelected[0]);
        
        let promise  = new Promise(getBuffer(fileData));

        // Wait for promise to be resolved, or log error.
        promise.then((data) => {

            // console.log(data);
            if(props.onChange){
                props.onChange(data);
                setfileDataByProps(data);
            }
            // props.onChange(filesSelected);

            let preview  = new Promise(getPreview(fileData));
            preview.then((data) => {
            
                setdataPreview(data);
    
            }).catch((err) => {
                // console.log('Error: ',err);
            });

        }).catch((err) => {
            // console.log('Error: ',err);
        });
    }

    const handleImageUpload = (e) => {
        e.preventDefault();
        let filesSelected = e.target.files;

        if(filesSelected.length > 0){
            // seterrorMessage('');
            // Eventhandler for file input. 
            let type = filesSelected[0].name.split('.').pop();

                if((props.accept && props.accept.includes(type)) || props.accept === undefined){
                
                    // console.log(filesSelected[0].size);

                    let maxsize = props.maxsize;
                    // console.log(maxsize * 1024);
                    // console.log(filesSelected[0].size);

                    let sizeInBytes = filesSelected[0].size;
                    let sizeInMB = (sizeInBytes / (1024*1024)).toFixed(2);
                    // console.log("size: "+sizeInMB);

                    if((maxsize && sizeInMB <= maxsize) || maxsize === undefined){
                        
                        // console.log('convirtiendo archivo');
                        console.log(filesSelected[0].size);
                        convertTo(filesSelected);
                    
                    }else{

                        toast.error("El tamaño del archivo es superior al permitido (2mb)");
                        // seterrorMessage('El tamaño de archivo es demasiado grande');
                        // setpreview(null);
                        // props.setBinary(null);
                        // props.onChange(null);
                    }
                }else{
                    toast.error(`Formato ${type} no permitido para este archivo.`);
                }
                

            /*
                }else{
                    seterrorMessage('El formato del archivo es invalido');
                    setpreview(null);
                    props.setBinary(null);
                    props.onChange(null);
                }
            */

        }else{

            if(props.onChange){
                props.onChange(null);
            }

            setdataPreview(null);
            // props.setBinary(null);
            // props.onChange(null);
        }
    }

    const deleteFile = () => {
        // setfile(null);
        // setdataPreview(null);
        if(props.onChange){
            props.onChange(null);
        }
    }

    useEffect(() => {
        if(fileDataByProps !== null && props.file === null){
            setTimeout(() => {
                setfile(null);
                setfileDataByProps(null);
                setdataPreview(null); 
            }, 40);
        }

        if(fileDataByProps === null && props.file !== null){
            setTimeout(() => {

                setfileDataByProps(props.file);
                setdataPreview(props.file);
                
            }, 40);
        }
    });
    

    // console.log(file);

    return (
        <div>
            {typeRender === "Stack" &&
                <div>
                    {showPreview &&
                        <Stack spacing={3} sx={{my: 2}}>
                            <div className="content-img-uploaded">
                                {file === null && dataPreview === null &&
                                    <Typography sx={{mb:0, fontWeight: "bold"}}>
                                        Foto
                                    </Typography>
                                }

                                {dataPreview !== null && 
                                    <div 
                                        className="img-preview-data" 
                                        style={{backgroundImage: 'url("data:image/png;base64,'+dataPreview+'")'}} 
                                    />
                                }
                            </div>
                        </Stack>
                    }
                    <Stack spacing={3} sx={{my: 2}}>
                        {file === null && dataPreview === null &&
                            <label className="content-upload-label" htmlFor={id}>
                                <Input 
                                    accept="image/*" 
                                    id={id}
                                    multiple 
                                    type="file" 
                                    onChange={(e) => handleImageUpload(e)} 
                                />
                                
                                <Button fullWidth variant="contained" component="span">
                                    {placeholder}
                                </Button>
                            </label>
                        }   

                        {dataPreview !== null && 
                            <Button onClick={() => deleteFile()} fullWidth variant="contained" component="span">
                                Eliminar
                            </Button>
                        }                    
                    </Stack>
                </div>
            }

            {typeRender === "Linear" &&
                <div>
                    <Stack spacing={3} sx={{my: 2}}>
                        <Grid container alignItems="start" columnSpacing={0}>
                            <Grid item xs={8}>
                                <TextField
                                    size='small'
                                    fullWidth
                                    type="text"
                                    label=""
                                    InputProps={{
                                        readOnly: true,
                                        placeholder: file !== null ? file.name : placeholder
                                    }}
                                    hiddenLabel
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <ButtonGroup  color="primary" sx={{my:0, py:0}}>
                                    {file === null && dataPreview === null &&
                                        <Button fullWidth sx={{py: 1}} variant="contained">
                                            
                                                <Input
                                                    className="input-file-absolute"
                                                    sx={{m:0}} accept="image/*" 
                                                    id={id} 
                                                    multiple 
                                                    type="file" 
                                                    onChange={(e) => handleImageUpload(e)} 
                                                />
                                                <span>...</span>
                                            
                                        </Button>
                                    }

                                    {dataPreview !== null && 
                                        <Button onClick={() => deleteFile()} fullWidth variant="contained" component="span">
                                            <Icon icon={Delete} />
                                        </Button>
                                    }

                                    {showPreview &&
                                        <Button onClick={() => setshowModalPreview(true)} disabled={file === null && dataPreview === null} fullWidth sx={{py: 1}} variant="contained">
                                            Ver
                                        </Button>
                                    }

                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </Stack>

                    {showPreview &&
                        <Modal
                            open={showModalPreview}
                            onClose={() => setshowModalPreview(false)}
                            onClick={event => event.stopPropagation()}
                            onMouseDown={event => event.stopPropagation()}
                            keepMounted 
                            style={{ 
                                display:'flex', 
                                alignItems:'center', 
                                justifyContent:'center' 
                            }}
                        >
                            <div>
                                {dataPreview !== null && 
                                    <Box>
                                        <img className="img-fluid" src={`data:image/png;base64,${dataPreview}`} alt={id+" preview"} />
                                    </Box>
                                }
                            </div>
                        </Modal>
                    }
                </div>
            }
        </div>
    )
}

export default UploaderImg