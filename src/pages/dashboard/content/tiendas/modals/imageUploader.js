import React, {useState} from 'react'
import { 
    Button,
    Box 
} from '@mui/material';
import { toast } from 'react-toastify';
import { base64toBlob, toBase64 } from '../../../../../utils/functions';

function ImageUploader({onChange, value}) {  
    const validTypesList = ['image/jpeg', 'image/jpg', 'image/png','image/gif','image/bmp'];
    const [file, setfile] = useState(null);
    const [urlPreview, seturlPreview] = useState(null);

    const handleChangeInputFile = async (e) => {
        if (e.target.files) {
            const {files}       = e.target;
            const file          = files[0];
            let dataFileStr    = '';
            
            if(validTypesList.includes(file['type'])){
                dataFileStr        = await toBase64(file);
                const blob         = base64toBlob(dataFileStr, file['type']);
                const url          = URL.createObjectURL(blob);  

                seturlPreview(url);
                onChange(dataFileStr);

            }else{
                toast.error('Tipo de archivo no admitido');
                setfile(null);
            }
        }else{
            setfile(null);
        }
    }

    return (
        <div>
            {value && value !== "" &&
                <Box sx={{pb: 2, width: '75%', margin: 'auto'}}>
                    <img src={value} alt='preview' />
                </Box>
            }

            <Button
                sx={{mb: 2}}
                variant="contained"
                component="label"
                fullWidth
            >
                Subir logo
                <input
                    type="file"
                    hidden
                    id='contract-file-input'
                    onChange={(e) => handleChangeInputFile(e)}
                />
            </Button>
        </div>
    )
}

export default ImageUploader