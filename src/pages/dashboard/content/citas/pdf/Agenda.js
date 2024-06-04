import React from "react";
import moment from "moment";

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

export function AgendaPdf(props) {

  console.log("pdf props", props.data);

  let actualDay = moment();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
     
          <View style={styles.section}>

            <Image style={styles.logo} src={logo} />
            
            <Text style={{ ...styles.title,  marginBottom: 30, fontSize: 18, fontFamily: "Helvetica-Bold" }}>
              Agenda 
            </Text>

            {props.data !== null &&
              <View>

                  <View style={{ flexDirection: 'row', alignItems: "center", marginBottom: 15 }}>
                    <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                      Fecha:
                    </Text>
                    <Text style={{ ...styles.text, marginLeft: 3 }}>
                      {moment(props.data.date).format("MM/DD/YYYY")}
                    </Text>
                  </View>

                  <View style={{ ...styles.theader, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ ...styles.thw, ...styles.text, fontFamily: "Helvetica-Bold", width: 50, maxWidth: 50 }}>
                      Hora
                    </Text>
                    <Text style={{ ...styles.thw, ...styles.text, fontFamily: "Helvetica-Bold", width: 75, maxWidth: 75 }}>
                      Tipo
                    </Text>
                    <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica-Bold" }}>
                      Doctor
                    </Text>
                    <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica-Bold" }}>
                      Paciente
                    </Text>
                    <Text style={{ ...styles.thw, ...styles.text, fontFamily: "Helvetica-Bold", width: 150, maxWidth: 150 }}>
                      Dirección
                    </Text>
                  </View>
                  {Array.isArray(props.data.rows) && props.data.rows.length > 0 && props.data.rows.map((item, key) => {
                    let dataItem = item;
                    let doctorInDateSelected    = "";
                    doctorInDateSelected = props.data.doctors.find(doctor => Number(doctor.account.employeeFiles[0].id) === Number(item.medialPersonal.doctor.employeeId));
                    doctorInDateSelected = doctorInDateSelected.account.employeeFiles[0].fisrtName+" "+doctorInDateSelected.account.employeeFiles[0].lastName;

                    return  <View key={key} style={{ ...styles.tcell, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                              <Text style={{ ...styles.tdw, ...styles.text, fontFamily: "Helvetica", width: 50, maxWidth: 50 }}>
                                {moment(item.hourAppointment).format("hh:mm")}
                              </Text>
                              <Text style={{ ...styles.tdw, ...styles.text, fontFamily: "Helvetica", width: 75, maxWidth: 75 }}>
                                {props.data.appointmentTypes.find(type => type.id === Number(item.appointmentTypeId)).name}
                              </Text>
                              <Text style={{ ...styles.td, ...styles.text, fontFamily: "Helvetica" }}>
                                {doctorInDateSelected}
                              </Text>
                              <Text style={{ ...styles.td, ...styles.text, fontFamily: "Helvetica" }}>
                                {item.patient.nombre+" "+item.patient.apellido}
                              </Text>
                              <Text style={{ ...styles.tdw, ...styles.text, fontFamily: "Helvetica", width: 150, maxWidth: 150 }}>
                                {item.address.estado.name+","+item.address.ciudad.name+","+item.address.address}
                              </Text>
                            </View>
                  })}
              </View>
            }

            {
            /*

              {moment(item.hourAppointment).format("hh:mm")}
              {item.patient.nombre+" "+item.patient.apellido}

              {Array.isArray(props.rows) && props.rows.length > 0 && props.rows.map((item, key) => {
                    let dataItem = item;
                    return  <View key={key} style={{ ...styles.tbody, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                              <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica" }}>
                                {moment(item.hourAppointment).format("hh:mm")}
                              </Text>
                              <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica" }}>
                                Doctor
                              </Text>
                              <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica" }}>
                                {item.patient.nombre+" "+item.patient.apellido}
                              </Text>
                            </View>
                  })}
            */}
            
          </View>
        
      </Page>
    </Document>
  );
}
