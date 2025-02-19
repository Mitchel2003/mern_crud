import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { Curriculum, Inspection, Accessory } from "@/interfaces/context.interface"

// Registrar fuentes (opcional, pero mejora la apariencia)
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
})

// Definir estilos
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#6b21a8',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b21a8',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    width: '30%',
  },
  value: {
    fontSize: 12,
    color: '#111827',
    width: '70%',
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  gridItem: {
    width: '50%',
    marginBottom: 8,
  },
})

interface CurriculumPDFProps {
  accessories?: Accessory[]
  inspection?: Inspection
  companyLogo?: string
  clientLogo?: string
  cv: Curriculum
}

const CurriculumPDF = ({ cv, inspection, accessories, clientLogo, companyLogo }: CurriculumPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header con logos */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {clientLogo && <Image style={styles.logo} src={clientLogo} />}
          {companyLogo && <Image style={styles.logo} src={companyLogo} />}
        </View>
        <Text style={styles.title}>Curriculum #{cv._id}</Text>
        <Text style={styles.subtitle}>{cv.office?.headquarter?.client.name}</Text>
      </View>

      {/* Información Principal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información General</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Sede:</Text>
          <Text style={styles.value}>{cv.office?.headquarter?.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Oficina:</Text>
          <Text style={styles.value}>{cv.office?.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fecha de Compra:</Text>
          <Text style={styles.value}>
            {cv.datePurchase && new Date(cv.datePurchase).toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>

      {/* Inspección */}
      {inspection && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de Inspección</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Código:</Text>
            <Text style={styles.value}>{inspection._id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.value}>{inspection.inactive ? 'Inactivo' : 'Activo'}</Text>
          </View>
        </View>
      )}

      {/* Accesorios */}
      {accessories && accessories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accesorios</Text>
          <View style={styles.grid}>
            {accessories.map((acc, index) => (
              <View key={index} style={styles.gridItem}>
                <Text style={styles.value}>• {acc.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Page>
  </Document>
)

export default CurriculumPDF