import React from "react";
import moment from "moment";
import {format} from 'date-fns'

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import logo from "../../../../../images/logo.png"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: 'Helvetica'
  },
  section: {
    margin: 30,
    padding: 10,
    flexGrow: 1
  },
  image: {
    height: 200,
    width: 150
  },
  subtitle: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: 150,
    alignItems: "center",
    marginBottom: 12
  },
  vote: {
    display: "flex",
    flexDirection: "row"
  },
  overviewContainer: {
    minHeight: 110
  },
  lang: {
    fontSize: 8,
    fontWeight: 700
  },
  text: {
    fontSize: 12
  },
  title: {
    fontSize: 18
  },
  theader: {
    borderTop: '1px solid #000',
    borderBottom: '1px solid #000',
    borderLeft: '1px solid #000',
  },
  tcell: {
    borderBottom: '1px solid #000',
    borderLeft: '1px solid #000',
  },
  td: {
    // width: "20%",
    height: "100%",
    borderRight: '1px solid #000',
    padding: 5,
    flex: 1
  },
  th: {
    // width: "20%",
    borderRight: '1px solid #000',
    padding: 5,
    flex: 1
  },
  tdw: {
    // width: "20%",
    height: "100%",
    borderRight: '1px solid #000',
    padding: 5
  },
  thw: {
    // width: "20%",
    borderRight: '1px solid #000',
    padding: 5
  },
  logo: {
    width: 200,
    marginBottom: 30
    // marginLeft: 'auto',
    // marginRight: 'auto'
  }
});

export function AppointmentsPdf(props) {

  console.log("pdf props", props.data);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
     
          <View style={styles.section}>

            <Image style={styles.logo} src={logo} />
            
            <Text style={{ ...styles.title,  marginBottom: 30, fontSize: 18, fontFamily: "Helvetica-Bold" }}>
                Atención Medica 
            </Text>

            {props.data !== null &&
              <View>

                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: 'row', alignItems: "center", marginBottom: 15 }}>
                            <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                                Tipo de cita:
                            </Text>
                            <Text style={{ ...styles.text, marginLeft: 3 }}>
                                {props.data.appointment.name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: "center", marginBottom: 15 }}>
                            <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                                Fecha:
                            </Text>
                            <Text style={{ ...styles.text, marginLeft: 3 }}>
                                desde: {moment(new Date(props.data.from)).format("DD/MM/YYYY")} hasta: {moment(new Date(props.data.to)).format("DD/MM/YYYY")}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={{ ...styles.theader, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica-Bold"}}>
                        Fecha
                        </Text>
                        <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica-Bold" }}>
                        Hora
                        </Text>
                        <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica-Bold" }}>
                        Paciente
                        </Text>
                    </View>
                    {Array.isArray(props.data.rows) && props.data.rows.length > 0 && props.data.rows.map((item, key) => {
                        let dataItem = item;
                        return <View key={key} style={{ ...styles.tcell, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={{ ...styles.td, ...styles.text, fontFamily: "Helvetica"}}>
                                    {moment(item.fecha).format("DD/MM/YYYY")}
                            </Text>
                            <Text style={{ ...styles.td, ...styles.text, fontFamily: "Helvetica" }}>
                                    {moment(item.hora).format("hh:mm A")}
                            </Text>
                            <Text style={{ ...styles.td, ...styles.text, fontFamily: "Helvetica" }}>
                                    {item.patient.nombre+" "+item.patient.apellido}
                            </Text>
                        </View>
                    })}

              </View>
            }
            
          </View>
        
      </Page>
    </Document>
  );
}
