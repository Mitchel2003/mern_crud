import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { Curriculum, Inspection, Accessory } from "@/interfaces/context.interface"

const styles = StyleSheet.create({
  page: {
    padding: '15pt',
    fontSize: '9pt',
    fontFamily: 'Helvetica',
  },
  // Header section
  headerContainer: {
    flexDirection: 'row',
    marginBottom: '5pt',
    alignItems: 'center',
  },
  logoContainer: {
    width: '100pt',
    marginRight: '10pt',
  },
  logo: {
    width: '100pt',
    height: '50pt',
  },
  titleContainer: {
    flex: 1,
  },
  mainTitle: {
    backgroundColor: '#000000',
    padding: '4pt',
    marginBottom: '2pt',
  },
  titleText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: '9pt',
    fontFamily: 'Helvetica-Bold',
  },
  // Format info section
  formatInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1pt solid black',
    borderBottom: '1pt solid black',
    padding: '2pt',
    marginBottom: '5pt',
  },
  formatText: {
    fontSize: '7pt',
  },
  // Client section
  sectionTitle: {
    backgroundColor: '#000000',
    padding: '2pt 4pt',
    marginBottom: '2pt',
  },
  sectionTitleText: {
    color: '#FFFFFF',
    fontSize: '8pt',
    fontFamily: 'Helvetica-Bold',
  },
  infoRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid black',
    minHeight: '12pt',
    alignItems: 'center',
  },
  infoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '2pt 4pt',
  },
  col2: { width: '50%' },
  col3: { width: '33.33%' },
  col4: { width: '25%' },
  label: {
    fontFamily: 'Helvetica-Bold',
    marginRight: '2pt',
  },
  // Equipment section
  equipmentContainer: {
    flexDirection: 'row',
    marginTop: '5pt',
  },
  equipmentInfo: {
    flex: 1,
    marginRight: '10pt',
  },
  equipmentImage: {
    width: '100pt',
    height: '100pt',
  },
  // Accessories table
  table: {
    marginTop: '5pt',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderTop: '0.5pt solid black',
    borderBottom: '0.5pt solid black',
  },
  tableCell: {
    flex: 1,
    padding: '2pt 4pt',
    borderLeft: '0.5pt solid black',
    borderRight: '0.5pt solid black',
  },
  // Technical characteristics
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  techItem: {
    width: '20%',
    padding: '2pt',
  },
});

interface CurriculumPDFProps {
  accessories?: Accessory[]
  inspection?: Inspection
  companyLogo?: string
  clientLogo?: string
  cvLogo?: string
  cv: Curriculum
}

const CurriculumPDF = ({ cv, accessories, clientLogo, cvLogo }: CurriculumPDFProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title Section */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image src={clientLogo || "/placeholder.svg"} style={styles.logo} />
          </View>
          <View style={styles.titleContainer}>
            <View style={styles.mainTitle}>
              <Text style={styles.titleText}>PROCESO DE CALIDAD</Text>
              <Text style={styles.titleText}>FORMATO HOJA DE VIDA EQUIPOS</Text>
            </View>
          </View>
        </View>

        {/* Format Info Section */}
        <View style={styles.formatInfo}>
          <Text style={styles.formatText}>CÓDIGO: FHV-01</Text>
          <Text style={styles.formatText}>VIGENTE DESDE: 01-09-2019</Text>
          <Text style={styles.formatText}>VERSIÓN: 02</Text>
        </View>

        {/* Client Section */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>CLIENTE</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={[styles.infoCol, styles.col2]}>
            <Text style={styles.label}>SERVICIO:</Text>
            <Text>{cv.service || 'N/A'}</Text>
          </View>
          <View style={[styles.infoCol, styles.col2]}>
            <Text style={styles.label}>OFICINA:</Text>
            <Text>{cv.office?.name || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoCol, styles.col2]}>
            <Text style={styles.label}>SEDE:</Text>
            <Text>{cv.office?.headquarter?.name || 'N/A'}</Text>
          </View>
          <View style={[styles.infoCol, styles.col2]}>
            <Text style={styles.label}>EMAIL:</Text>
            <Text>{cv.office?.headquarter?.client?.email || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoCol, styles.col2]}>
            <Text style={styles.label}>TELEFONO:</Text>
            <Text>{cv.office?.headquarter?.client?.phone || 'N/A'}</Text>
          </View>
          <View style={[styles.infoCol, styles.col2]}>
            <Text style={styles.label}>NIT:</Text>
            <Text>{cv.office?.headquarter?.client?.nit || 'N/A'}</Text>
          </View>
        </View>

        {/* Equipment Section with Image */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>INFORMACIÓN DEL EQUIPO</Text>
        </View>
        <View style={styles.equipmentContainer}>
          <View style={styles.equipmentInfo}>
            <View style={styles.infoRow}>
              <View style={[styles.infoCol, styles.col2]}>
                <Text style={styles.label}>NOMBRE:</Text>
                <Text>{cv.name}</Text>
              </View>
              <View style={[styles.infoCol, styles.col2]}>
                <Text style={styles.label}>MARCA:</Text>
                <Text>{cv.brand}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoCol, styles.col2]}>
                <Text style={styles.label}>MODELO:</Text>
                <Text>{cv.modelEquip}</Text>
              </View>
              <View style={[styles.infoCol, styles.col2]}>
                <Text style={styles.label}>SERIE:</Text>
                <Text>{cv.serie}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoCol, styles.col3]}>
                <Text style={styles.label}>VALOR:</Text>
                <Text>{cv.price || 'N/A'}</Text>
              </View>
              <View style={[styles.infoCol, styles.col3]}>
                <Text style={styles.label}>GARANTÍA:</Text>
                <Text>{cv.warranty || 'N/A'}</Text>
              </View>
              <View style={[styles.infoCol, styles.col3]}>
                <Text style={styles.label}>TIPO DE ADQUISICIÓN:</Text>
                <Text>{cv.acquisition || 'N/A'}</Text>
              </View>
            </View>

            {/* Accessories Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.tableCell}>
                  <Text style={styles.label}>NOMBRE</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.label}>TIPO</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.label}>MODELO</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.label}>SERIE</Text>
                </View>
              </View>
              {accessories?.map((acc, index) => (
                <View key={index} style={styles.infoRow}>
                  <View style={styles.tableCell}>
                    <Text>{acc.name || 'N/A'}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{acc.type || 'N/A'}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{acc.modelEquip || 'N/A'}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{acc.serie || 'N/A'}</Text>
                  </View>
                </View>
              ))}
            </View>

          </View>
          {cvLogo && (
            <Image src={cvLogo || "/placeholder.svg"} style={styles.equipmentImage} />
          )}
        </View>

        {/** equipment dates */}
        <View style={styles.infoRow}>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>FECHA COMPRA:</Text>
            <Text>{cv.datePurchase || 'N/A'}</Text>
          </View>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>FECHA INSTALACIÓN:</Text>
            <Text>{cv.dateInstallation || 'N/A'}</Text>
          </View>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>FECHA DE OPERACIÓN:</Text>
            <Text>{cv.dateOperation || 'N/A'}</Text>
          </View>
        </View>

        {/** stakeholders */}
        <View style={styles.infoRow}>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>FABRICANTE:</Text>
            <Text>{cv.manufacturer.name}</Text>
          </View>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>TELEFONO:</Text>
            <Text>{cv.manufacturer.phone}</Text>
          </View>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>PAÍS:</Text>
            <Text>{cv.manufacturer.country}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>PROVEEDOR:</Text>
            <Text>{cv.supplier.name}</Text>
          </View>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>TELEFONO:</Text>
            <Text>{cv.supplier.phone}</Text>
          </View>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>CIUDAD:</Text>
            <Text>{cv.supplier.city}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>REPRESENTANTE:</Text>
            <Text>{cv.representative.name}</Text>
          </View>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>TELEFONO:</Text>
            <Text>{cv.representative.phone}</Text>
          </View>
          <View style={[styles.infoCol, styles.col3]}>
            <Text style={styles.label}>CIUDAD:</Text>
            <Text>{cv.representative.city}</Text>
          </View>
        </View>

        {/* Technical Characteristics */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>CARACTERÍSTICAS TÉCNICAS</Text>
        </View>
        <View style={styles.techGrid}>
          {Object.entries(cv.technicalCharacteristics || {}).map(([key, value], index) => (
            <View key={index} style={styles.techItem}>
              <View style={styles.infoCol}>
                <Text style={styles.label}>{toLabel(key)}:</Text>
                <Text>{value || 'N/A'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Continue with other sections... */}
      </Page>
    </Document>
  )
}

export default CurriculumPDF
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const toLabel = (key: string) => {
  switch (key) {
    case 'voltage':
      return 'VOLTAJE'
    case 'amperage':
      return 'CORRIENTE'
    case 'power':
      return 'POTENCIA'
    case 'frequency':
      return 'FRECUENCIA'
    case 'capacity':
      return 'CAPACIDAD'
    case 'pressure':
      return 'PRESION'
    case 'speed':
      return 'VELOCIDAD'
    case 'humidity':
      return 'HUMEDAD'
    case 'temperature':
      return 'TEMPERATURA'
    case 'weight':
      return 'PESO'
    default:
      return key.toUpperCase()
  }
}