import React, {useEffect, useState} from 'react'
import {Select, MenuItem, InputLabel, FormControl, FormHelperText} from "@mui/material"
import axios from "../../auth/fetch"

const MarcaSelect = (props) => {

    const {value, onChange, reset, cancelReset, disabled, id, helperText, error} = props;

    const [list, setlist]           = useState([]);
    const [actualId, setactualId]   = useState("");
    const [canReset, setcanReset]   = useState(false);

    const [loading, setloading]     = useState(true);
    const [search, setsearch]       = useState(true);

    const getData = () => {
        axios.get("/CaRS/MAkeS").then((res) => {
            
            // console.log("Makes", res.data);
            if(res.data.hasOwnProperty('data')){
                /*
                let datalist = res.data.data.map((item) => ({
                    label: item['name'], 
                    value: item['id']
                }));
                */

                console.log('makes');
                console.log(res.data.data);
                
                setlist(res.data.data);
                setcanReset(true);
                setloading(false);
            }
        }).catch((err) => {
            console.error(err);
        });
    }
    
    // console.log(reset, canReset, search);

    useEffect(async () => {

        if(loading && id !== null && id !== ""){
            setsearch(false);
            setcanReset(false);
            setactualId(id);

            if(search){
                getData();
            }
        }

        if(!loading && id !== actualId && id !== ""){
            onChange("");
            setloading(true);
            setsearch(true);
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
                Marca
            </InputLabel>
            <Select
                size="small"
                fullWidth
                value={value.toString()}
                onChange={(e) => onChange(e.target.value)}
                label="Marca"
                displayEmpty
                disabled={disabled || id === "" || id === null || list.length === 0}
            >

                {list.length > 0 && list.map((item, key) => {
                    let itemData = item;
                    return  <MenuItem key={key} value={itemData.id.toString()}>
                                {itemData.name}
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

export default MarcaSelect