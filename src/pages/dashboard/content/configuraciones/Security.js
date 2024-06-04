// material
import {useState} from "react"
import { Box, Grid, Container, Typography, Card, CardContent, Button, Modal, TextField, Tab, Tabs } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { alpha, styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';


// components
import Page from '../../../../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../../../../components/_dashboard/app';
import Info from "./tabs/Info";
import Password from "./tabs/Password";
import Email from "./tabs/Email";
import Secret from "./tabs/Secret";


export default function Security() {

    const [tab, setTab] = useState('1');

    const handleChange = (event, value) => {
        setTab(value);
    };

    return (
        <Page title="Seguridad | RepuestosGo">
        <Container maxWidth="xl">
            <Box sx={{ pb: 3 }}>
                <Typography variant="h4" color="white.main">
                    Seguridad
                </Typography>
            </Box>

            <Grid sx={{ pb: 3 }} item xs={12}>
                <Card>
                    <CardContent>
                        <TabContext value={tab}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList 
                                scrollButtons
                                allowScrollButtonsMobile 
                                onChange={handleChange} 
                                aria-label="lab API tabs example"
                            >
                                <Tab label="Info."      value="1" />
                                <Tab label="Password"   value="2" />
                                <Tab label="Email"      value="3" />
                                <Tab label="Secret"     value="4" />
                            </TabList>

                            {/* 
                                <Tabs
                                    // value={value}
                                    // onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                >

                                    <Tab label="Item One" />
                                    <Tab label="Item Two" />
                                    <Tab label="Item Three" />
                                    <Tab label="Item Four" />
                                    <Tab label="Item Five" />

                                </Tabs>
                            */}

                            </Box>
                            <TabPanel value="1">
                                <Info />
                            </TabPanel>
                            <TabPanel value="2">
                                <Password />
                            </TabPanel>
                            <TabPanel value="3">
                                <Email />
                            </TabPanel>
                            <TabPanel value="4">
                                <Secret />
                            </TabPanel>
                        </TabContext>
                    </CardContent>
                </Card>
            </Grid>
        </Container>
        </Page>
    );
}
