import { attendanceStyles, styles } from "@/constants/values.constants"
import { Document, Page, Text, View, Image } from "@react-pdf/renderer"
import { resolveProviderHierarchy } from "@/utils/helpers"
import { User } from "@/interfaces/context.interface"
import { chunkTable } from "@/lib/utils"
import dayjs from "dayjs"
import "dayjs/locale/es"
dayjs.locale("es")

interface AttendanceRow { name: string; position: string; document: string; signature: string }
interface AttendancePDFProps {
  newRowAttendance: Array<AttendanceRow>
  dateAttendance: Date
  subject: string
  message: string
  createdBy: User
  client: User
}

/** Acta de asistencia */
const AttendancePDF = ({ client, createdBy, newRowAttendance = [], dateAttendance, subject, message }: AttendancePDFProps) => {
  const attendeesChunks = chunkTable(newRowAttendance as any, 17)
  return (
    <Document>
      {attendeesChunks.map((chunk, pageIndex) => (
        <Page key={`page-${pageIndex}`} size="A4" style={styles.page}>
          <View style={styles.container}>
            <HeaderSection client={client} dateAttendance={dateAttendance} subject={subject} message={message} />
            <AttendanceTable attendees={chunk as unknown as AttendanceRow[]} pageIndex={pageIndex} totalPages={attendeesChunks.length} />
            <FooterSection createdBy={createdBy} />
          </View>
        </Page>
      ))}
    </Document>
  )
}

export default AttendancePDF
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Encabezado */
const HeaderSection = ({ client, dateAttendance, subject, message }: { client: User, dateAttendance: Date, subject: string, message: string }) => (
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
          <Text style={[styles.sectionTitleText, { fontSize: '9pt' }]}>
            FECHA DE CAPACITACIÓN: {dayjs(dateAttendance).format("DD [de] MMMM [del] YYYY")}
          </Text>
        </View>
      </View>
      <View style={{ padding: '5pt' }}>
        <Text style={{ fontSize: '10pt' }}>
          {subject}
        </Text>
      </View>
    </View>

    {/* Personal a capacitar */}
    <View>
      <View style={[styles.sectionTitle, { marginBottom: 0 }]}>
        <Text style={[styles.sectionTitleText, { fontSize: '9pt' }]}>PERSONAL A CAPACITAR:</Text>
      </View>
      <View style={{ padding: '5pt' }}>
        <Text style={{ fontSize: '10pt' }}>
          {message}
        </Text>
      </View>
    </View>
  </>
)

/** Tabla de Asistentes */
const AttendanceTable = ({ attendees = [], pageIndex = 0, totalPages = 1 }: { attendees: AttendanceRow[], pageIndex?: number, totalPages?: number }) => {
  const rowsPerPage = 17 //Static number of rows per page
  const emptyRowsCount = Math.max(0, rowsPerPage - attendees.length)
  const emptyRows = Array(emptyRowsCount).fill(null)
  return (
    <View style={[attendanceStyles.tableContainer, { marginTop: '0pt' }]}>
      {/* Encabezado de la tabla */}
      <View style={attendanceStyles.tableHeader}>
        <Text style={attendanceStyles.headerText}>
          ASISTENTES {totalPages > 1 ? `- PÁGINA ${pageIndex + 1} DE ${totalPages}` : ''}
        </Text>
      </View>

      {/* Encabezados de columnas */}
      <View style={attendanceStyles.columnHeaders}>
        <View style={[attendanceStyles.columnHeader, { width: '30%' }]}>
          <Text style={attendanceStyles.columnHeaderText}>NOMBRES COMPLETOS</Text>
        </View>
        <View style={[attendanceStyles.columnHeader, { width: '20%' }]}>
          <Text style={attendanceStyles.columnHeaderText}>CARGO</Text>
        </View>
        <View style={[attendanceStyles.columnHeader, { width: '20%' }]}>
          <Text style={attendanceStyles.columnHeaderText}>NUMERO DE IDENTIFICACIÓN</Text>
        </View>
        <View style={[attendanceStyles.columnHeader, { width: '30%', borderRight: 'none' }]}>
          <Text style={attendanceStyles.columnHeaderText}>FIRMA</Text>
        </View>
      </View>

      {/* Filas de datos */}
      {attendees.map((attendee: AttendanceRow, index: number) => (
        <View key={`attendee-${index}`} style={[attendanceStyles.tableRow, { backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F3F4F6', minHeight: '35pt' }]}>
          <View style={[attendanceStyles.tableCell, { width: '30%' }]}>
            <Text style={[attendanceStyles.tableCellText, { fontSize: '10pt' }]}>
              {attendee?.name || ''}
            </Text>
          </View>
          <View style={[attendanceStyles.tableCell, { width: '20%' }]}>
            <Text style={[attendanceStyles.tableCellText, { fontSize: '10pt' }]}>
              {attendee?.position || ''}
            </Text>
          </View>
          <View style={[attendanceStyles.tableCell, { width: '20%' }]}>
            <Text style={[attendanceStyles.tableCellText, { fontSize: '10pt' }]}>
              {attendee?.document || ''}
            </Text>
          </View>
          <View style={[attendanceStyles.tableCell, { width: '30%', padding: '0pt', borderRight: 'none', alignItems: 'center', justifyContent: 'center' }]}>
            <Image
              src={attendee.signature || "/placeholder.svg"}
              style={{ width: '80%', height: '40pt', objectPosition: 'center' }}
            />
          </View>
        </View>
      ))}

      {/* Filas vacías para completar la tabla */}
      {emptyRows.map((_, index) => {
        const rowIndex = attendees.length + index;
        return (
          <View key={`empty-${index}`} style={[attendanceStyles.tableRow, { backgroundColor: rowIndex % 2 === 0 ? '#FFFFFF' : '#ecedeb', minHeight: '25pt' }]}>
            <View style={[attendanceStyles.tableCell, { width: '30%' }]}>
              <Text></Text>
            </View>
            <View style={[attendanceStyles.tableCell, { width: '20%' }]}>
              <Text></Text>
            </View>
            <View style={[attendanceStyles.tableCell, { width: '20%' }]}>
              <Text></Text>
            </View>
            <View style={[attendanceStyles.tableCell, { width: '30%', borderRight: 'none' }]}>
              <Text></Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

/** Footer con firma e información del proveedor */
const FooterSection = ({ createdBy }: { createdBy: User }) => {
  const provider = resolveProviderHierarchy(createdBy)
  return provider ? (
    <View style={[attendanceStyles.footerContainer, { marginTop: '0pt', borderTop: 'none' }]}>
      {/* Sección izquierda - Firma e información del ingeniero */}
      <View style={[attendanceStyles.providerSection, { width: '40%' }]}>
        <Image src={provider?.metadata?.signature || "/placeholder.svg"} style={attendanceStyles.signatureImage} />{/* Imagen de la firma */}
        <View style={attendanceStyles.signatureLine}></View>{/* Línea de firma */}

        {/* Información del ingeniero */}
        <Text style={attendanceStyles.providerName}>{provider?.username?.toUpperCase()}</Text>
        <Text style={attendanceStyles.providerDetail}>{provider?.position || 'INGENIERO ELECTRÓNICO'}</Text>
        <Text style={attendanceStyles.providerDetail}>CC. {provider?.nit} de Cúcuta</Text>
        <Text style={attendanceStyles.providerDetail}>REG. INVIMA: {provider?.invima}</Text>
      </View>

      {/* Sección derecha - Logo de la empresa */}
      <View style={attendanceStyles.logoSection}>
        <Image src={provider?.metadata?.logo || "/placeholder.svg"} style={[{ width: '170pt', height: '100pt' }]} />
      </View>
    </View>
  ) : (
    <View style={styles.noReferenceContainer}>
      <View style={styles.noReferenceTitleContainer}>
        <Text style={styles.noReferenceTitle}>SIN REFERENCIAS</Text>
      </View>
      <View style={styles.noReferenceContent}>
        <Text style={styles.noReferenceText}>
          No se encontraron referencias válidas para este mantenimiento.
          Por favor, verifique la información del proveedor de servicios.
        </Text>
      </View>
    </View>
  )
}