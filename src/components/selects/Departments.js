import React, {useEffect, useState} from 'react'
import {Select, MenuItem, InputLabel, FormControl} from "@mui/material"
import axios from "../../auth/fetch"

const DepartmentsSelect = (props) => {

    const {value, onChange, reset, cancelReset, disabled} = props;

    const [list, setlist]           = useState([]);
    const [canReset, setcanReset]   = useState(false);
    const [loading, setloading]     = useState(true);
    const [search, setsearch]       = useState(true);

    let url = "/departament/get/*";

    const getData = () => {
        axios.get(url).then((res) => {
            // console.log("Get departments");
            if(res.data.result){
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

        if(loading){
            setsearch(false);
            setcanReset(false);

            if(search){
                getData();
            }
        }

        if(reset && canReset){
            cancelReset();
            setloading(true);
            setsearch(true);
        }

    }, [loading, search, reset]);
    

    return (
        <FormControl fullWidth size="small">
            <InputLabel id="department-select">
                Dirección
            </InputLabel>
            <Select
                size="small"
                fullWidth
                value={value.toString()}
                onChange={(e) => onChange(e.target.value)}
                label="Dirección"
                displayEmpty
                disabled={disabled}
            >
                {list.map((item, key) => {
                    let itemData = item;
                    return  <MenuItem key={key} value={itemData.id.toString()}>
                                {itemData.name}
                            </MenuItem>
                })}
            </Select>
        </FormControl>
    );
};

export default DepartmentsSelect