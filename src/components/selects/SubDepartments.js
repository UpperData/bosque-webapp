import React, {useEffect, useState} from 'react'
import {Select, MenuItem, InputLabel, FormControl} from "@mui/material"
import axios from "../../auth/fetch"

const SubDepartmentsSelect = (props) => {

    const {value, onChange, reset, cancelReset, disabled, id} = props;

    const [list, setlist]           = useState([]);
    const [actualId, setactualId]   = useState("");
    const [canReset, setcanReset]   = useState(false);

    const [loading, setloading]     = useState(true);
    const [search, setsearch]       = useState(true);

    const getData = () => {
        let url = "/sUBDepartament/get/"+id;
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
                disabled={disabled || id === "" || id === null || list.length === 0}
            >

                {list.length > 0 && list.map((item, key) => {
                    let itemData = item;
                    return  <MenuItem key={key} value={itemData.id.toString()}>
                                {itemData.name}
                            </MenuItem>
                })}

            </Select>
        </FormControl>
    );
};

export default SubDepartmentsSelect