import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { attendanceStyles, styles } from "@/utils/constants"
import { User } from "@/interfaces/context.interface"

interface AttendancePDFProps {
  client: User
}

const AttendancePDF = ({ client }: AttendancePDFProps) => (
  <Document>
    <Page size="A4" orientation='landscape' style={styles.page}>
      <View style={styles.container}>
        <HeaderSection client={client} />
        <AttendanceTable attendees={[]} />
        <FooterSection />
      </View>
    </Page>
  </Document>
)

export default AttendancePDF
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Encabezado */
const HeaderSection = ({ client }: { client: User }) => (
  <>
    <View style={[styles.headerContainer, { borderBottom: '1pt solid black' }]}>
      {/* Logo - Columna izquierda */}
      <View style={[styles.logoContainer, { width: '150pt', borderRight: '1pt solid black' }]}>
        <Image src={client?.metadata?.logo || "/placeholder.svg"} style={[styles.logo, { width: '150pt', height: '60pt' }]} />
      </View>

      {/* Nombre cliente y título - Columna centro */}
      <View style={[styles.titleContainer, {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10pt 5pt',
        fontSize: '12pt'
      }]}>
        <View style={[styles.infoRow, { marginBottom: '2pt' }]}>
          <Text style={[styles.label, {
            fontFamily: 'Helvetica-Bold',
            textAlign: 'center',
            marginRight: 0,
          }]}>
            {client.username}
          </Text>
        </View>
        <View style={[styles.infoRow, { borderBottom: 'none' }]}>
          <Text style={[styles.label, {
            fontFamily: 'Helvetica-Bold',
            textAlign: 'center',
            marginRight: 0,
          }]}>
            MANTENIMIENTO DE EQUIPOS BIOMEDICOS
          </Text>
        </View>
      </View>

      {/* Código y Versión - Columna derecha */}
      <View style={{
        borderLeft: '1pt solid black',
        fontSize: '10pt',
        height: '60pt',
        width: '120pt',
      }}>
        <View style={[styles.infoRow, { justifyContent: 'space-between', padding: '10pt 5pt' }]}>
          <Text style={[styles.label, { marginLeft: '5pt' }]}>
            Código:
          </Text>
          <Text style={{ textAlign: 'right', marginRight: '5pt' }}>
            MEB-PC-02
          </Text>
        </View>
        <View style={[styles.infoRow, { justifyContent: 'space-between', padding: '10pt 5pt', borderBottom: 'none', }]}>
          <Text style={[styles.label, { marginLeft: '5pt' }]}>
            Versión:
          </Text>
          <Text style={{ textAlign: 'right', marginRight: '5pt' }}>
            01
          </Text>
        </View>
      </View>
    </View>

    {/* Título del Acta */}
    <View style={[styles.sectionTitle, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.titleText, { fontSize: '10pt', color: '#000000' }]}>ACTA DE ASISTENCIA</Text>
    </View>

    {/* Temas a tratar */}
    <View>
      <View style={[styles.sectionTitle, { marginBottom: 0 }]}>
        <View style={[styles.infoRow, { justifyContent: 'space-between' }]}>
          <Text style={[styles.sectionTitleText, { fontSize: '9pt' }]}>TEMAS A TRATAR:</Text>
          <Text style={[styles.sectionTitleText, { fontSize: '9pt' }]}>FECHA DE CAPACITACIÓN: 10 de octubre del 2024</Text>
        </View>
      </View>
      <View style={{ padding: '5pt' }}>
        <Text style={{ fontSize: '10pt' }}>
          En esta capacitación se tratarán los siguientes temas:
        </Text>
        <Text style={{ fontSize: '10pt' }}>
          Uso correcto de Equipos Biomedicos en el área deOdontología.
        </Text>
      </View>
    </View>

    {/* Sexta fila: Personal a capacitar */}
    <View>
      <View style={[styles.sectionTitle, { marginBottom: 0 }]}>
        <Text style={[styles.sectionTitleText, { fontSize: '9pt' }]}>PERSONAL A CAPACITAR:</Text>
      </View>
      <View style={{ padding: '5pt' }}>
        <Text style={{ fontSize: '10pt' }}>
          Todo el personal asistencial del consultorio odontológico DR.CARLOS MARIO QUITERO PEREZ
        </Text>
      </View>
    </View>
  </>
)

/** Tabla de Asistentes */
const AttendanceTable = ({ attendees = [] }) => {
  const minRows = 10; //Minimum number of rows
  const emptyRowsCount = Math.max(0, minRows - attendees.length);
  const emptyRows = Array(emptyRowsCount).fill(null);
  return (
    <View style={attendanceStyles.tableContainer}>
      {/* Encabezado de la tabla */}
      <View style={attendanceStyles.tableHeader}>
        <Text style={attendanceStyles.headerText}>ASISTENTES</Text>
      </View>

      {/* Encabezados de columnas */}
      <View style={attendanceStyles.columnHeaders}>
        <View style={[attendanceStyles.columnHeader, { width: '35%' }]}>
          <Text style={attendanceStyles.columnHeaderText}>NOMBRES COMPLETOS</Text>
        </View>
        <View style={[attendanceStyles.columnHeader, { width: '20%' }]}>
          <Text style={attendanceStyles.columnHeaderText}>CARGO</Text>
        </View>
        <View style={[attendanceStyles.columnHeader, { width: '25%' }]}>
          <Text style={attendanceStyles.columnHeaderText}>NUMERO DE IDENTIFICACIÓN</Text>
        </View>
        <View style={[attendanceStyles.columnHeader, { width: '20%', borderRight: 'none' }]}>
          <Text style={attendanceStyles.columnHeaderText}>FIRMA</Text>
        </View>
      </View>

      {/* Filas de datos */}
      {attendees.map((attendee: any, index: number) => (
        <View
          key={`attendee-${index}`}
          style={[
            attendanceStyles.tableRow,
            {
              backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F3F4F6',
              minHeight: '25pt'
            }
          ]}
        >
          <View style={[attendanceStyles.tableCell, { width: '35%' }]}>
            <Text>{attendee?.name || ''}</Text>
          </View>
          <View style={[attendanceStyles.tableCell, { width: '20%' }]}>
            <Text>{attendee?.position || ''}</Text>
          </View>
          <View style={[attendanceStyles.tableCell, { width: '25%' }]}>
            <Text>{attendee?.identification || ''}</Text>
          </View>
          <View style={[attendanceStyles.tableCell, { width: '20%', borderRight: 'none' }]}>
            {/* Espacio para firma */}
          </View>
        </View>
      ))}

      {/* Filas vacías para completar la tabla */}
      {emptyRows.map((_, index) => {
        const rowIndex = attendees.length + index;
        return (
          <View
            key={`empty-${index}`}
            style={[attendanceStyles.tableRow, { backgroundColor: rowIndex % 2 === 0 ? '#FFFFFF' : '#ecedeb', minHeight: '18pt' }]}
          >
            <View style={[attendanceStyles.tableCell, { width: '35%' }]}>
              <Text></Text>
            </View>
            <View style={[attendanceStyles.tableCell, { width: '20%' }]}>
              <Text></Text>
            </View>
            <View style={[attendanceStyles.tableCell, { width: '25%' }]}>
              <Text></Text>
            </View>
            <View style={[attendanceStyles.tableCell, { width: '20%', borderRight: 'none' }]}>
              <Text></Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

/** Footer con firma e información del proveedor */
const FooterSection = ({
  engineer = {
    name: "RICARDO ANDRÉS LEMUS PORTILLO",
    title: "INGENIERO ELECTRÓNICO",
    identification: "CC 88253376 de Cúcuta",
    invima: "RH-201609-473"
  },
  signature = "/placeholder.svg",
  companyLogo = "https://firebasestorage.googleapis.com/v0/b/gestionsalud-2003.appspot.com/o/gestions%2Fcompany%2F67e33a2e97bf8af09bc989ca%2Fpreview%2Flogo?alt=media&token=4a650f26-c3d4-4565-adec-2a6fa5c23f9f"
}) => (
  <View style={attendanceStyles.footerContainer}>
    {/* Sección izquierda - Firma e información del ingeniero */}
    <View style={attendanceStyles.engineerSection}>
      <Image src={signature || "/placeholder.svg"} style={attendanceStyles.signatureImage} />{/* Imagen de la firma */}
      <View style={attendanceStyles.signatureLine}></View>{/* Línea de firma */}

      {/* Información del ingeniero */}
      <Text style={attendanceStyles.engineerName}>{engineer.name}</Text>
      <Text style={attendanceStyles.engineerDetail}>{engineer.title}</Text>
      <Text style={attendanceStyles.engineerDetail}>{engineer.identification}</Text>
      <Text style={attendanceStyles.engineerDetail}>REG. INVIMA: {engineer.invima}</Text>
    </View>

    {/* Sección derecha - Logo de la empresa */}
    <View style={attendanceStyles.logoSection}>
      <Image src={companyLogo || "/placeholder.svg"} style={attendanceStyles.companyLogo} />
    </View>
  </View>
)