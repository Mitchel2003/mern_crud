import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { attendanceStyles, styles } from "@/utils/constants"
import { User } from "@/interfaces/context.interface"
import dayjs from "dayjs"
import "dayjs/locale/es"
dayjs.locale("es")

interface TrainingPDFProps {
  months: string[]
  areas: string[]
  company: User
  client: User
}

const TrainingPDF = ({ client, company, areas, months }: TrainingPDFProps) => (
  <Document>
    <Page size="A4" orientation='landscape' style={styles.page}>
      <View style={styles.container}>
        <HeaderSection client={client} />
        <TrainingTable areas={areas} months={months} />
        <FooterSection company={company} />
      </View>
    </Page>
  </Document>
)

export default TrainingPDF
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
  </>
)

/** Tabla de capacitación */
const TrainingTable = ({ areas = [], months = [] }: { areas: string[], months: string[] }) => {
  const minRows = 10 //Minimum number of rows
  const selectedMonths = months.map(month => month.toLowerCase())
  const emptyRowsCount = Math.max(0, minRows - areas.length)
  const emptyRows = Array(emptyRowsCount).fill(null)
  return (
    <View style={attendanceStyles.tableContainer}>
      {/* Encabezado de la tabla */}
      <View style={attendanceStyles.tableHeader}>
        <Text style={attendanceStyles.headerText}>CAPACITACIONES</Text>
      </View>

      {/* Encabezados de columnas */}
      <View style={attendanceStyles.columnHeaders}>
        <View style={[attendanceStyles.columnHeader, { width: '40%' }]}>
          <Text style={attendanceStyles.columnHeaderText}>
            AREAS
          </Text>
        </View>
        {Array.from({ length: 12 }, (_, i) => {
          const monthName = dayjs().month(i).format("MMMM")
          return (
            <View key={`header-${i}`} style={[attendanceStyles.columnHeader, { width: '5%' }]}>
              <Text style={attendanceStyles.columnHeaderText}>
                {monthName.toUpperCase().slice(0, 3)}
              </Text>
            </View>
          )
        })}
      </View>

      {/* Filas de datos */}
      {areas.map((area: string, index: number) => (
        <View key={`cv-${index}`} style={[attendanceStyles.tableRow, { backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#ecedeb', minHeight: '15pt' }]}>
          <View style={[attendanceStyles.tableCell, { width: '40%' }]}>
            <Text style={[attendanceStyles.tableCellText, {fontSize: '10pt'}]}>
              {area}
            </Text>
          </View>
          {Array.from({ length: 12 }, (_, i) => {
            const monthName = dayjs().month(i).format("MMMM").toLowerCase()
            const isSelected = selectedMonths.includes(monthName)
            return (
              <View key={`cell-${index}-${i}`} style={[attendanceStyles.tableCell, { width: '5%' }]}>
                <Text style={[attendanceStyles.tableCellText, isSelected ? { fontWeight: 'bold' } : {}]}>
                  {isSelected ? 'X' : ''}
                </Text>
              </View>
            )
          })}
        </View>
      ))}

      {/* Filas vacías para completar la tabla */}
      {emptyRows.map((_, index) => {
        const rowIndex = areas.length + index;
        return (
          <View key={`empty-${index}`} style={[attendanceStyles.tableRow, { backgroundColor: rowIndex % 2 === 0 ? '#FFFFFF' : '#ecedeb', minHeight: '15pt' }]}>
            <View style={[attendanceStyles.tableCell, { width: '40%' }]}>
              <Text style={attendanceStyles.tableCellText}></Text>
            </View>
            {Array.from({ length: 12 }, (_, i) => (
              <View key={`empty-cell-${index}-${i}`} style={[attendanceStyles.tableCell, { width: '5%' }]}>
                <Text style={attendanceStyles.tableCellText}></Text>
              </View>
            ))}
          </View>
        )
      })}
    </View>
  )
}

/** Footer con firma e información del proveedor */
const FooterSection = ({ company }: { company: User }) => (
  <View style={attendanceStyles.footerContainer}>
    {/* Sección izquierda - Firma e información del ingeniero */}
    <View style={attendanceStyles.engineerSection}>
      <Image src={company?.metadata?.signature || "/placeholder.svg"} style={attendanceStyles.signatureImage} />{/* Imagen de la firma */}
      <View style={attendanceStyles.signatureLine}></View>{/* Línea de firma */}

      {/* Información del ingeniero */}
      <Text style={attendanceStyles.engineerName}>{company?.username.toUpperCase()}</Text>
      <Text style={attendanceStyles.engineerDetail}>{company?.metadata?.title || 'Ingeniero Electronico'}</Text>
      <Text style={attendanceStyles.engineerDetail}>CC. {company?.nit} de Cúcuta</Text>
      <Text style={attendanceStyles.engineerDetail}>REG. INVIMA: {company?.invima}</Text>
    </View>

    {/* Sección derecha - Logo de la empresa */}
    <View style={attendanceStyles.logoSection}>
      <Image src={company?.metadata?.logo || "/placeholder.svg"} style={attendanceStyles.companyLogo} />
    </View>
  </View>
)