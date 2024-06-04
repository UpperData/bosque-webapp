import React, {useEffect, useState} from 'react'
import {Select, MenuItem, InputLabel, FormControl, FormHelperText} from "@mui/material"
import axios from "../../auth/fetch"

const AnioSelect = (props) => {

    const {value, onChange, reset, cancelReset, disabled, id, helperText, error} = props;

    const [list, setlist]           = useState([]);
    const [actualId, setactualId]   = useState("");
    const [canReset, setcanReset]   = useState(false);

    const [loading, setloading]     = useState(true);
    const [search, setsearch]       = useState(true);

    const getData = async () => {
        axios.get("/CarS/YEARS").then((res) => {
            
            console.log("Anio", res.data);

            let datalist = res.data.data.map((item) => ({
                name:   item, 
                id:     item
            }));

            setlist(datalist);
            setcanReset(true);
            setloading(false);
           
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
                Año
            </InputLabel>
            <Select
                size="small"
                fullWidth
                value={value.toString()}
                onChange={(e) => onChange(e.target.value)}
                label="Año"
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

export default AnioSelect