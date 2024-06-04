import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import moment from "moment";
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
  logo: {
    width: 200,
    marginBottom: 30
    // marginLeft: 'auto',
    // marginRight: 'auto'
  }
});

export function CitaPdf(props) {

  let actualDay = moment();

  let doctorInDateSelected    = "";
  doctorInDateSelected        = props.data.doctors.find(doctor => doctor.account.employeeFiles.length > 0 && doctor.account.employeeFiles[0] && (Number(doctor.account.employeeFiles[0].id) === Number(props.data.medialPersonal.doctor.employeeId)));
  if(doctorInDateSelected !== undefined){
    doctorInDateSelected        = doctorInDateSelected.account.employeeFiles[0].fisrtName+" "+doctorInDateSelected.account.employeeFiles[0].lastName;
  }

  let nurseInDateSelected     = "";
  nurseInDateSelected         = props.data.nurses.find(nurse => nurse.account.employeeFiles.length > 0 && nurse.account.employeeFiles[0] && (Number(nurse.account.employeeFiles[0].id) === Number(props.data.medialPersonal.nurses.employeeId)));
  if(nurseInDateSelected !== undefined){
    nurseInDateSelected         = nurseInDateSelected.account.employeeFiles[0].fisrtName+" "+nurseInDateSelected.account.employeeFiles[0].lastName;
  }
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
     
          <View style={styles.section}>

            <Image style={styles.logo} src={logo} />

            <Text style={{ ...styles.title,  marginBottom: 30, fontSize: 18, fontFamily: "Helvetica-Bold" }}>
              Cita
            </Text>

            {props.data !== null &&
                <View>


                  <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold", color: "#767B7B" }}>
                    Datos generales:
                  </Text>

                  <View style={{ borderBottom: '1px solid #000', marginBottom: 30,  flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Fecha:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {moment(props.data.dateAppointment).format("YYYY/MM/DD")}
                        </Text>
                      </View>
                      
                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Hora:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {moment(props.data.hourAppointment).format("hh:mm A")}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Tipo de cita:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data.appointmentType.name}
                        </Text>
                      </View>
                  </View>

                  <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold", color: "#767B7B" }}>
                    Datos del paciente:
                  </Text>

                  <View style={{ borderBottom: '1px solid #000', marginBottom: 30,  flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Nombre:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data.patient.nombre+" "+props.data.patient.apellido}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Cédula:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {(props.data.patient.document.nationality+"-"+props.data.patient.document.number).toLowerCase()}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Género:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data.patient.document.gender === "H" ? "Hombre" : "Mujer"}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Edad:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data !== null && actualDay.diff(moment(props.data.patient.edad.split("T")[0], "YYYY-MM-DD"), "years") + " años"}
                        </Text>
                      </View>
                  </View>


                  <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold", color: "#767B7B" }}>
                    Personal médico:
                  </Text>

                  <View style={{ borderBottom: '1px solid #000', marginBottom: 30,  flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Doctor:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {doctorInDateSelected}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Enfermera:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {nurseInDateSelected}
                        </Text>
                      </View>
                  </View>

                  <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold", color: "#767B7B" }}>
                    Locación:
                  </Text>
                
                  <View style={{ borderBottom: '1px solid #000', marginBottom: 15,  flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Estado:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data.address.estado.name}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Municipio:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data.address.municipio.name}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Parroquia:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data.address.parroquia.name}
                        </Text>
                    </View>
                  </View>
                
                  <View style={{ borderBottom: '1px solid #000', marginBottom: 20,  flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                      <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                        Dirección:
                      </Text>
                      <Text style={{ ...styles.text, marginLeft: 3 }}>
                        {props.data.address.address}
                      </Text>
                    </View>
                  </View>
              </View>
            }
            
          </View>
        
      </Page>
    </Document>
  );
}
