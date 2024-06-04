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
    width: "25%",
    borderRight: '1px solid #000',
    padding: 5,
  },
  th: {
    width: "25%",
    borderRight: '1px solid #000',
    padding: 5,
  },
  logo: {
    width: 200,
    marginBottom: 30
    // marginLeft: 'auto',
    // marginRight: 'auto'
  }
});

export function RecibosPdf(props) {

  console.log("pdf props", props.data);
  // let actualDay = moment();

  let dataVoucher = props.data.dataVoucher;
  let doctor      = props.data.doctor;
  let items       = props.data.items;

  let total       = 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
     
          <View style={styles.section}>

            <Image style={styles.logo} src={logo} />
            
            {dataVoucher !== null &&
              <Text style={{ ...styles.title,  marginBottom: 15, fontSize: 18, fontFamily: "Helvetica-Bold" }}>
                Recibo
              </Text>
            }

            {doctor !== null &&
              <Text style={{ ...styles.text,  marginBottom: 15, fontSize: 12, fontFamily: "Helvetica" }}>
                Empleado / Contratado: {doctor.fisrtName+" "+doctor.lastName} ({doctor.documentId.nationality.toLowerCase()+"-"+doctor.documentId.number})
              </Text>
            }

            {items !== null && items.length > 0 &&
              <View style={{ marginBottom: 15 }}>
                  <View style={{ ...styles.theader, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica-Bold" }}>
                      Descripción
                    </Text>
                    <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica-Bold" }}>
                      Precio
                    </Text>
                    <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica-Bold" }}>
                      Cantidad
                    </Text>
                    <Text style={{ ...styles.th, ...styles.text, fontFamily: "Helvetica-Bold" }}>
                      Sub Total
                    </Text>
                  </View>
                  {Array.isArray(items) && items.length > 0 && items.map((item, key) => {
                    let dataItem = item;
                    total += (dataItem.amount * dataItem.quantity);

                    return  <View key={key} style={{ ...styles.tcell, flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                              <Text style={{ ...styles.td, ...styles.text, fontFamily: "Helvetica" }}>
                                {dataItem.description}
                              </Text>
                              <Text style={{ ...styles.td, ...styles.text, fontFamily: "Helvetica" }}>
                                {"Bs. "+dataItem.amount}
                              </Text>
                              <Text style={{ ...styles.td, ...styles.text, fontFamily: "Helvetica" }}>
                                {dataItem.quantity}
                              </Text>
                              <Text style={{ ...styles.td, ...styles.text, fontFamily: "Helvetica", textAlign: "right" }}>
                                {"Bs. "+(dataItem.amount * dataItem.quantity)}
                              </Text>
                            </View>
                  })}
              </View>
            }

            <Text style={{ ...styles.text,  marginBottom: 15, fontSize: 12, fontFamily: "Helvetica-Bold", textAlign: "right" }}>
              Sub total: {"Bs. "+ total}
            </Text>
            
          </View>
        
      </Page>
    </Document>
  );
}
