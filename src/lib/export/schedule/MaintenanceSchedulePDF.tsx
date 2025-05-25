import { attendanceStyles, styles } from "@/constants/values.constants"
import { Document, Page, Text, View, Image } from "@react-pdf/renderer"
import { Curriculum, User } from "@/interfaces/context.interface"
import { resolveProviderHierarchy } from "@/utils/helpers"
import { chunkTable } from "@/lib/utils"
import { useMemo } from 'react'
import dayjs from "dayjs"
import "dayjs/locale/es"
dayjs.locale("es")

interface MaintenancePDFProps {
  typeClassification: string
  monthOperation: string[]
  yearOperation: string[]
  cvs: Curriculum[]
  createdBy: User
  client: User
}

/** Cronograma de mantenimiento */
const MaintenancePDF = ({ cvs, client, createdBy, monthOperation, yearOperation, typeClassification }: MaintenancePDFProps) => {
  const equipments = useMemo(() => cvs.filter(cv => cv?.typeClassification.includes(typeClassification)).map((e) => `${e?.name} - ${e?.modelEquip}`), [cvs])
  const equipmentChunks = chunkTable(equipments, 13)
  const year = yearOperation[0]
  return (
    <Document>
      {equipmentChunks.map((chunk, pageIndex) => (
        <Page key={`page-${pageIndex}`} size="A4" orientation='landscape' style={styles.page}>
          <View style={styles.container}>
            <HeaderSection client={client} typeClass={typeClassification} />
            <MaintenanceTable equipments={chunk} months={monthOperation} year={year} />
            <FooterSection createdBy={createdBy} />
          </View>
        </Page>
      ))}
    </Document>
  )
}

export default MaintenancePDF
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Encabezado */
const HeaderSection = ({ client, typeClass }: { client: User, typeClass: string }) => (
  <>
    <View style={[styles.headerContainer, { borderBottom: '1pt solid black' }]}>
      {/* Logo - Columna izquierda */}
      <View style={[styles.logoContainer, { width: '170pt', borderRight: '1pt solid black' }]}>
        <Image src={client?.metadata?.logo || "/placeholder.svg"} style={[styles.logo, { width: '170pt', height: '70pt' }]} />
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
            PROCESO DE MANTENIMIENTO - {typeClass.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Código y Versión - Columna derecha */}
      <View style={{ height: '70pt', width: '120pt', fontSize: '10pt', borderLeft: '1pt solid black' }}>
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

    {/* Tipo de cronograma */}
    <View style={[styles.sectionTitle, { padding: '5pt' }]}>
      <Text style={[styles.titleText, { fontSize: '10pt' }]}>CRONOGRAMA DE MANTENIMIENTO DE EQUIPOS</Text>
    </View>

    {/* Referencias */}
    <View style={[styles.sectionTitle, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.titleText, { fontSize: '10pt', color: '#000000' }]}>PROCESO DE CALIDAD</Text>
    </View>
  </>
)

/** Tabla de mantenimiento */
const MaintenanceTable = ({ equipments = [], months = [], year }: { equipments: string[], months: string[], year: string }) => {
  const rowsPerPage = 13 //Static number of rows per page
  const selectedMonths = months.map(month => month.toLowerCase())
  const emptyRowsCount = Math.max(0, rowsPerPage - equipments.length)
  const emptyRows = Array(emptyRowsCount).fill(null)
  return (
    <View style={[attendanceStyles.tableContainer, { marginTop: '0pt' }]}>
      {/* Encabezado de la tabla */}
      <View style={[attendanceStyles.tableHeader, { padding: '15pt' }]}>
        <Text style={attendanceStyles.headerText}>AÑO {year}</Text>
      </View>

      {/* Encabezados de columnas */}
      <View style={attendanceStyles.columnHeaders}>
        <View style={[attendanceStyles.columnHeader, { width: '40%', backgroundColor: '#b8b8b8' }]}>
          <Text style={attendanceStyles.columnHeaderText}>
            EQUIPOS
          </Text>
        </View>
        {Array.from({ length: 12 }, (_, i) => {
          const monthName = dayjs().month(i).format("MMMM")
          return (
            <View key={`header-${i}`} style={[attendanceStyles.columnHeader, { width: '5%', backgroundColor: '#b8b8b8' }]}>
              <Text style={attendanceStyles.columnHeaderText}>
                {monthName.toUpperCase().slice(0, 3)}
              </Text>
            </View>
          )
        })}
      </View>

      {/* Filas de datos */}
      {equipments.map((equipment: string, index: number) => (
        <View key={`cv-${index}`} style={[attendanceStyles.tableRow, { backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#ecedeb', minHeight: '15pt' }]}>
          <View style={[attendanceStyles.tableCell, { width: '40%' }]}>
            <Text style={[attendanceStyles.tableCellText, { fontSize: '10pt' }]}>
              {equipment}
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
        const rowIndex = equipments.length + index;
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
const FooterSection = ({ createdBy }: { createdBy: User }) => {
  const provider = resolveProviderHierarchy(createdBy)
  return provider ? (
    <View style={[attendanceStyles.footerContainer, { marginTop: '0pt', borderTop: 'none' }]}>
      {/* Sección izquierda - Firma e información del ingeniero */}
      <View style={attendanceStyles.providerSection}>
        <Image src={provider?.metadata?.signature || "/placeholder.svg"} style={attendanceStyles.signatureImage} />{/* Imagen de la firma */}
        <View style={attendanceStyles.signatureLine}></View>{/* Línea de firma */}

        {/* Información del ingeniero */}
        <Text style={attendanceStyles.providerName}>{provider?.username?.toUpperCase()}</Text>
        <Text style={attendanceStyles.providerDetail}>{provider?.position || 'INGENIERO ELECTRÓNICO'}</Text>
        <Text style={attendanceStyles.providerDetail}>REG. INVIMA: {provider?.invima}</Text>
        <Text style={attendanceStyles.providerDetail}>CC. {provider?.nit}</Text>
      </View>

      {/* Sección derecha - Logo de la empresa */}
      <View style={attendanceStyles.logoSection}>
        <Image src={provider?.metadata?.logo || "/placeholder.svg"} style={attendanceStyles.companyLogo} />
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