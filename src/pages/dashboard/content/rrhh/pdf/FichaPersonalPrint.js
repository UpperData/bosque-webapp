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
  movieContainer: {
    backgroundColor: "#f6f6f5",
    display: "flex",
    flexDirection: "row",
    padding: 5
  },
  movieDetails: {
    display: "flex",
    marginLeft: 5
  },
  movieTitle: {
    fontSize: 15,
    marginBottom: 10
  },
  movieOverview: {
    fontSize: 10
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
  rating: {
    height: 10,
    width: 10
  },
  vote_pop: {
    fontSize: 10,
    padding: 2,
    backgroundColor: "#61C74F",
    color: "#fff"
  },
  vote_pop_text: {
    fontSize: 10,
    marginLeft: 4
  },
  overviewContainer: {
    minHeight: 110
  },
  detailsFooter: {
    display: "flex",
    flexDirection: "row"
  },
  lang: {
    fontSize: 8,
    fontWeight: 700
  },
  vote_average: {
    fontSize: 8,
    marginLeft: 4,
    fontWeight: "bold"
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
  photo: {
    width: 100,
    marginLeft: 15
  }
});

export function FichaPersonalPrint(props) {

  console.log("pdf props", props.data);

  let actualDay = moment();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
     
          <View style={styles.section}>

            <Image style={styles.logo} src={logo} />

            <Text style={{ ...styles.title,  marginBottom: 30, fontSize: 18, fontFamily: "Helvetica-Bold" }}>
              Ficha personal { /* props.data !== null ? "- id:"+props.data.id : "" */}
            </Text>

            {props.data !== null &&
                <View>

                  <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginBottom: 15 }}>
                    <View style={{ borderBottom: '1px solid #000', height: 19,  flexDirection: 'row', justifyContent: "space-between", flex: 1 }}>

                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Nombre:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data !== null && (props.data.fisrtName+" "+props.data.lastName)}
                        </Text>
                      </View>

                      {props.data.documentId !== null && props.data.documentId.hasOwnProperty("birthday") &&
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                          <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                            Edad:
                          </Text>
                          <Text style={{ ...styles.text, marginLeft: 3 }}>
                            {props.data !== null && actualDay.diff(moment(props.data.documentId.birthday.split("T")[0], "YYYY-MM-DD"), "years") + " años"}
                          </Text>
                        </View>
                      }

                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Sexo:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data.documentId.gender === "M" ? "Mujer" : "Hombre"}
                        </Text>
                      </View>

                    </View>

                    {props.data.photo &&
                      < Image style={styles.photo} src={`data:image/jpeg;base64,`+props.data.photo} />
                    }
                  </View>

                  <View style={{ borderBottom: '1px solid #000', marginBottom: 20,  flexDirection: 'row', alignItems: "center", justifyContent: "flex-start" }}>
                    
                    {props.data.documentId !== null && props.data.documentId.hasOwnProperty("birthday") &&
                      <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Estado civil:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data !== null && (props.data.documentId.civilStatus.name)}
                        </Text>
                      </View>
                    }

                    <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: 12 }}>
                      <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                        C.I:
                      </Text>
                      <Text style={{ ...styles.text, marginLeft: 3 }}>
                        {props.data !== null && props.data.documentId.nationality.toLowerCase()+"-"+props.data.documentId.number}
                      </Text>
                    </View>
                  </View>

                  <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold", color: "#767B7B" }}>
                    Contacto:
                  </Text>

                  <View style={{ borderBottom: '1px solid #000', marginBottom: 20,  flexDirection: 'row', alignItems: "center", justifyContent: "flex-start" }}>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                      <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                        Email:
                      </Text>
                      <Text style={{ ...styles.text, marginLeft: 3 }}>
                        {props.data !== null && (props.data.email)}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: 12 }}>
                      <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                        Teléfono:
                      </Text>
                      <Text style={{ ...styles.text, marginLeft: 3 }}>
                        {props.data !== null && (props.data.phone[0].phoneNumber)}
                      </Text>
                    </View>
                  </View>

                  <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold", color: "#767B7B" }}>
                    Dirección:
                  </Text>
                
                  <View style={{ borderBottom: '1px solid #000', marginBottom: 20,  flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
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


                  <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold", color: "#767B7B" }}>
                    Cargo:
                  </Text>
                
                  <View style={{ borderBottom: '1px solid #000', marginBottom: 20,  flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Cargo:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data.cargo.cargo.name}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Departamento:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data.cargo.departamento.name}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                        <Text style={{ ...styles.text, fontFamily: "Helvetica-Bold" }}>
                          Dirección:
                        </Text>
                        <Text style={{ ...styles.text, marginLeft: 3 }}>
                          {props.data.cargo.direccion.name}
                        </Text>
                    </View>
                  </View>


                  <Text style={{ ...styles.text, marginBottom: 15, fontFamily: "Helvetica-Bold", color: "#767B7B" }}>
                    Observaciones:
                  </Text>
                
                  <View style={{ borderBottom: '1px solid #000', marginBottom: 20,  flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ ...styles.text, marginLeft: 3 }}>
                      {props.data.observation}
                    </Text>
                  </View>
              </View>
            }
            
          </View>
        
      </Page>
    </Document>
  );
}
