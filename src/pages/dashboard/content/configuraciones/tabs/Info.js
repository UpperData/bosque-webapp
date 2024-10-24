import React, { useEffect, useState } from 'react'
import { Box, Grid, Container, Typography, Divider, Hidden } from '@mui/material';
import ProfileImgUploader from "../../../../../components/uploadImage/ProfileImgUploader"
import {useSelector, useDispatch} from "react-redux"
import axios from "../../../../../auth/fetch"
import Loader from '../../../../../components/Loader/Loader';
import moment from "moment";

require('moment/locale/es');

moment.locale('es-ES');

function Info() {
    const userData              = useSelector(state => state.session.userData.data);
    const [loading, setloading] = useState(true);
    const [search, setsearch]   = useState(true);
    const [data, setdata]       = useState(null);

    let urlProfile = "/accoUNT/pROfiLE";

    const roleList = userData.role;

    useEffect(() => {
       if(loading){
            if(search){
                axios.get(urlProfile)
                .then((res) => {
                    setdata(res.data.data);
                    setloading(false);

                }).catch((err) => {
                    console.error(err);
                });
            }
       }
    }, []);
        

    if(!loading){
        return (
            <Box>
                <Grid sx={{ pb: 3 }} item xs={12}>
                    <Grid container justifyContent="space-between" columnSpacing={3}>
                        <Grid item md={6} xs={12}>

                            <Grid sx={{mb: 3}} container columnSpacing={3}>
                                <Grid item xs={12} md={5}>
                                    <Typography style={{fontWeight:'bold'}}>
                                        Fecha Creación: 
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Typography color="text.secondary">
                                        {moment(data.createdAt.split("T")[0], "YYYY-MM-DD").format("D, MMMM YYYY")} 
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid sx={{mb: 3}} container columnSpacing={3}>
                                <Grid item xs={12} md={5}>
                                    <Typography style={{fontWeight:'bold'}}>
                                        Última modificación:
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Typography color="text.secondary">
                                        {moment(data.updatedAt.split("T")[0], "YYYY-MM-DD").format("D, MMMM YYYY")}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <div>
                                <Typography style={{fontWeight:'bold'}} sx={{mb: 1}}>
                                    Membresías: 
                                </Typography>
                                <Box sx={{px: 3}}>
                                    <ul className="list-unstyled">
                                        {roleList.map((item, key) => {
                                            let data = item;
                                            return (
                                                <li key={key}>
                                                    <Typography color="text.secondary">
                                                        - {data.name}
                                                    </Typography>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </Box>
                            </div>

                        </Grid>
                        <Hidden mdDown>
                            <Divider orientation="vertical" flexItem style={{marginRight:"-1px"}} />
                        </Hidden>
                        <Hidden mdDown>
                            <Grid item md={5} xs={0}>
                                <Box sx={{width: "100%", maxWidth: "450px", margin: "auto"}}>
                                    <img src="/assets/img/user_information.png" alt="Informacion de perfil" width={250} height={250} />                                    
                                </Box>
                            </Grid>
                        </Hidden>
                    </Grid>
                </Grid>
            </Box>
        )
    }

    return <Loader />
}

export default Info