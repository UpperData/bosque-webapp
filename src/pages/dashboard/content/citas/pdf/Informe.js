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
    borderRight: '1px solid #000',
    padding: 5,
  },
  th: {
    borderRight: '1px solid #000',
    padding: 5,
  }
});

export function InformePdf(props) {

  console.log("pdf props", props.data);

  let doctorInDateSelected    = "";
  doctorInDateSelected = props.data.doctors.find(doctor => Number(doctor.account.employeeFiles[0].id) === Number(props.data.appointment.medialPersonal.doctor.employeeId));
  doctorInDateSelected = doctorInDateSelected.account.employeeFiles[0].fisrtName+" "+doctorInDateSelected.account.employeeFiles[0].lastName;

  let nurseInDateSelected    = "";
  nurseInDateSelected = props.data.nurses.find(nurse => Number(nurse.account.employeeFiles[0].id) === Number(props.data.appointment.medialPersonal.nurses.employeeId));
  nurseInDateSelected = nurseInDateSelected.account.employeeFiles[0].fisrtName+" "+nurseInDateSelected.account.employeeFiles[0].lastName;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
          <View style={styles.section}>

            <Image style={styles.logo} src={logo} />

            <Text style={{ ...styles.title,  marginBottom: 30, fontSize: 18, fontFamily: "Helvetica-Bold" }}>
              Informe médico
            </Text>

            {props.data !== null &&
                <View>

                  <View style={{borderBottom: '1px solid #000', marginBottom: 15,  flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                      <View>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold", marginBottom: 15 }}>
                          Doctor
                        </Text>
                        <Text style={{ ...styles.text}}>
                          {doctorInDateSelected}
                        </Text>
                      </View>
                      
                      <View style={{marginLeft: 15}}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold", marginBottom: 15}}>
                          Enfermera / personal medico
                        </Text>
                        <Text style={{ ...styles.text }}>
                          {nurseInDateSelected}
                        </Text>
                      </View>
                  </View>

                  <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold" }}>
                    Descripcion:
                  </Text>
                  <Text style={{ borderBottom: '1px solid #000', ...styles.text,  marginBottom: 15}}>
                    {props.data.description}
                  </Text>

                  <View style={{borderBottom: '1px solid #000', marginBottom: 15,  flexDirection: 'row', alignItems: "center", justifyContent: "flex-start" }}>
                      <View>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold", marginBottom: 15 }}>
                          ¿Se aplicaron medicamentos?
                        </Text>
                        <Text style={{ ...styles.text}}>
                          {props.data.withMedicine ? "si" : "no"}
                        </Text>
                      </View>
                      
                      <View style={{marginLeft: 15}}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold", marginBottom: 15}}>
                          ¿Requiere exámenes médicos?
                        </Text>
                        <Text style={{ ...styles.text }}>
                          {props.data.withExams ? "si" : "no"}
                        </Text>
                      </View>
                  </View>

                  {props.data.exams !== null && props.data.exams.length > 0 &&
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold" }}>
                          Examenes:
                        </Text>
                        <View style={{ ...styles.theader, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                          <Text style={{ ...styles.th, ...styles.text, width: "15%", fontFamily: "Helvetica-Bold" }}>
                            #
                          </Text>
                          <Text style={{ ...styles.th, ...styles.text, width: "85%", fontFamily: "Helvetica-Bold", textAlign: "left" }}>
                            Nombre
                          </Text>
                        </View>
                        {Array.isArray(props.data.exams) && props.data.exams.length > 0 && props.data.exams.map((item, key) => {
                          let dataItem = item;

                          return  <View key={key} style={{ ...styles.tcell, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                                    <Text style={{ ...styles.td, ...styles.text, width: "15%", fontFamily: "Helvetica" }}>
                                      {dataItem.id}
                                    </Text>
                                    <Text style={{ ...styles.td, ...styles.text, width: "85%", fontFamily: "Helvetica", textAlign: "left" }}>
                                      {dataItem.name}
                                    </Text>
                                  </View>
                        })}
                    </View>
                  }

                  <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold" }}>
                    Otros examenes:
                  </Text>
                  <Text style={{ ...styles.text, marginBottom: 15, borderBottom: '1px solid #000'}}>
                    {props.data.otherExams}
                  </Text>

                  {props.data.medicines !== null && props.data.medicines.length > 0 &&
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold" }}>
                          Medicinas:
                        </Text>
                        <View style={{ ...styles.theader, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                          <Text style={{ ...styles.th, ...styles.text, width: "15%", fontFamily: "Helvetica-Bold" }}>
                            #
                          </Text>
                          <Text style={{ ...styles.th, ...styles.text, width: "65%", fontFamily: "Helvetica-Bold", textAlign: "left" }}>
                            Nombre
                          </Text>
                          <Text style={{ ...styles.th, ...styles.text, width: "20%", fontFamily: "Helvetica-Bold", textAlign: "left" }}>
                            Cantidad
                          </Text>
                        </View>
                        {Array.isArray(props.data.medicines) && props.data.medicines.length > 0 && props.data.medicines.map((item, key) => {
                          let dataItem = item;

                          return  <View key={key} style={{ ...styles.tcell, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                                    <Text style={{ ...styles.td, ...styles.text,width: "15%", fontFamily: "Helvetica" }}>
                                      {dataItem.id}
                                    </Text>
                                    <Text style={{ ...styles.td, ...styles.text,width: "65%", fontFamily: "Helvetica", textAlign: "left" }}>
                                      {dataItem.name}
                                    </Text>
                                    <Text style={{ ...styles.td, ...styles.text,width: "20%", fontFamily: "Helvetica", textAlign: "left" }}>
                                      {dataItem.cantidad}
                                    </Text>
                                  </View>
                        })}
                    </View>
                  }

              </View>
            }
            
          </View>
      </Page>

      {props.data.dosage !== "" && props.data.dosage !== null &&
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>

              <Image style={styles.logo} src={logo} />

              <Text style={{ ...styles.title,  marginBottom: 30, fontSize: 18, fontFamily: "Helvetica-Bold" }}>
                Informe médico
              </Text>

              {props.data !== null &&
                  <View>

                    <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold" }}>
                      Posología:
                    </Text>
                    <Text style={{ ...styles.text,  marginBottom: 15}}>
                      {props.data.dosage}
                    </Text>

                </View>
              }
              
            </View>
        </Page>
      }
    </Document>
  );
}
