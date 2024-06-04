import React, {useState} from 'react'
import { 
    Button,
    Box 
} from '@mui/material';
import { toast } from 'react-toastify';
import { Document, Page } from 'react-pdf';
import { base64toBlob } from '../../../../../utils/functions';

import {SizeMe} from 'react-sizeme';

function ContractUploader({onChange = () => 0, value = ""}) {

    const [pdfFile, setpdfFile] = useState(null);
    const [urlPreview, seturlPreview] = useState(null);
    const validTypesList = ['application/pdf'];

    const getUnit8Array = async (file) => {
        const fileData = await file.arrayBuffer();
        let ArrayFileData = new Uint8Array(fileData);
        console.log(ArrayFileData);
        return ArrayFileData;
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

    const handleChangeInputFile = async (e) => {
        if (e.target.files) {
            const {files}       = e.target;
            const file          = files[0];
            let dataFileStr    = '';
            
            if(validTypesList.includes(file['type'])){
                dataFileStr        = await toBase64(file);

                const blob          = base64toBlob(dataFileStr);
                const url           = URL.createObjectURL(blob);    

                setpdfFile(dataFileStr);
                seturlPreview(url);
                onChange(dataFileStr);
            }else{
                toast.error('Tipo de archivo no admitido');
                setpdfFile(null);
            }
        }else{
            setpdfFile(null);
        }
    }

    // console.log(pdfFile);

    return (
        <div>
            {value && value !== "" &&
                <Box sx={{mb: 2}} boxShadow={5}>
                    <SizeMe
                        monitorHeight
                        refreshRate={128}
                        refreshMode="debounce"
                        render={({ size }) => (
                            <Document 
                                file={urlPreview} 
                                // onLoadSuccess={onDocumentLoadSuccess}
                            >
                                <Page 
                                    wrap
                                    width={size.width}
                                    pageNumber={1} 
                                />
                            </Document>
                        )}
                    />
                </Box>
            }

            <Button
                variant="contained"
                component="label"
                fullWidth
            >
                Subir contrato
                <input
                    type="file"
                    hidden
                    id='contract-file-input'
                    onChange={(e) => handleChangeInputFile(e)}
                />
            </Button>
        </div>
    );
}

export default ContractUploader