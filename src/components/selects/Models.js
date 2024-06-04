import React, {useEffect, useState} from 'react'
import {Select, MenuItem, InputLabel, FormControl, FormHelperText} from "@mui/material"
import axios from "../../auth/fetch"

const ModelSelect = (props) => {

    const {value, onChange, reset, cancelReset, disabled, id, helperText, error} = props;

    const [list, setlist]           = useState([]);
    const [actualId, setactualId]   = useState("");
    const [canReset, setcanReset]   = useState(false);

    const [loading, setloading]     = useState(true);
    const [search, setsearch]       = useState(true);

    const getData = () => {
        if(id && id !== ""){
            axios.get(`/CaRS/MoDelS/id/${id}`).then((res) => {
                
                console.log('models', res.data);
                if(res.data.hasOwnProperty('data')){
                    setlist(res.data.data.data);
                    setcanReset(true);
                    setloading(false);
                }
                
            }).catch((err) => {
                console.error(err);
            });
        }
    }
    
    // console.log(reset, canReset, search);

    useEffect(async () => {

        if(loading && id !== null && id !== ""){
            console.log('id marca: ', id);

            setcanReset(false);
            setactualId(id);

            if(search){
                setsearch(false);
                getData();
            }
        }

        if(!loading && id !== actualId && id !== ""){
            onChange("");
            setsearch(true);
            setloading(true);
        }

        if(reset && canReset){
            cancelReset();
            setloading(true);
            setsearch(true);
        }

    }, [loading, search, reset, id]);
    

    return (
        <FormControl fullWidth size="small" error={error}>
            <InputLabel id="department-select">
                Modelo
            </InputLabel>
            <Select
                size="small"
                fullWidth
                value={value.toString()}
                onChange={(e) => onChange(e.target.value)}
                label="Modelo"
                displayEmpty
                disabled={disabled || id === "" || id === null || list.length === 0}
                error={error}
                helperText={helperText}
            >
                {list.length > 0 && list.map((item, key) => {
                    let itemData = item;
                    return  <MenuItem key={key} value={itemData.id.toString()}>
                                {itemData.id.toString()}
                            </MenuItem>
                })}
            </Select>
            {helperText &&
                <FormHelperText>
                    {helperText}
                </FormHelperText>
            }
        </FormControl>
    );
};

export default ModelSelect