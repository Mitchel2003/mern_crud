import { styles, toLabel_technicalSpecification } from "@/utils/constants"
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { Company, Curriculum, Maintenance } from '@/interfaces/context.interface'
import { Metadata } from "@/interfaces/db.interface"

interface MaintenancePDFProps { mt: Maintenance, com?: Company, imgs?: Metadata[] }

const MaintenancePDF = ({ mt, com, imgs }: MaintenancePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Title Section */}
      <HeaderSection />

      {/* Format Info Section */}
      <View style={styles.formatInfo}>
        <Text style={styles.formatText}>CÓDIGO: FHV-01</Text>
        <Text style={styles.formatText}>VIGENTE DESDE: 01-09-2019</Text>
        <Text style={styles.formatText}>VERSIÓN: 02</Text>
      </View>

      <ClientSection mt={mt} />{/* Client Section */}
      <EquipmentSection mt={mt} />{/* Equipment Section */}
      <BiomedicalSection cv={mt.curriculum} />{/* Biomedical Classification */}
      <TechnicalSection mt={mt} />{/* Technical Characteristics */}
      <InspectionsSection cv={mt.curriculum} />{/* Inspecciones */}
      <ObservationsSection mt={mt} />{/* Observaciones */}
      <ServiceProviderSection mt={mt} com={com} imgs={imgs} />{/* ProviderService */}
    </Page>
  </Document>
)

export default MaintenancePDF
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Encabezado */
const HeaderSection = () => (
  <View style={styles.headerContainer}>
    <View style={styles.titleContainer}>
      <View style={styles.mainTitle}>
        <Text style={styles.titleText}>PROCESO DE CALIDAD</Text>
        <Text style={styles.titleText}>FORMATO DE MANTENIMIENTO DE EQUIPOS</Text>
      </View>
    </View>
  </View>
)

/** Información del cliente */
const ClientSection = ({ mt }: { mt: Maintenance }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>DATOS DEL CLIENTE</Text>
    </View>
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>NOMBRE:</Text>
        <Text>{mt.curriculum.office.headquarter.client.name}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>TELÉFONO:</Text>
        <Text>{mt.curriculum.office.headquarter.client.phone}</Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>DIRECCIÓN:</Text>
        <Text>{mt.curriculum.office.headquarter.address}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>FECHA DE MANTENIMIENTO:</Text>
        <Text>{mt?.dateMaintenance ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(mt.dateMaintenance)) : 'N/A'}</Text>
      </View>
    </View>
  </>
)

/** Información del equipo - datos generales y especificaciones */
const EquipmentSection = ({ mt }: { mt: Maintenance }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>DATOS DEL EQUIPO</Text>
    </View>
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>NOMBRE:</Text>
        <Text>{mt.curriculum.name}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>MODELO:</Text>
        <Text>{mt.curriculum.modelEquip}</Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>SERIE:</Text>
        <Text>{mt.curriculum.serie}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>MARCA:</Text>
        <Text>{mt.curriculum.brand}</Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>SEDE:</Text>
        <Text>{mt.curriculum.office.headquarter.name}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>OFICINA:</Text>
        <Text>{mt.curriculum.office.name}</Text>
      </View>
    </View>
  </>
)

/** Clasificación biomédica del equipo */
const BiomedicalSection = ({ cv }: { cv?: Curriculum }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>CLASIFICACIÓN BIOMÉDICA</Text>
    </View>

    {/* Estado, Riesgo, Uso y Tipo */}
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>CLASIFICACIÓN USO:</Text>
        <Text>{cv?.useClassification || 'N/R'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>TIPO:</Text>
        <Text>{cv?.typeClassification || 'N/R'}</Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>CLASIFICACIÓN BIOMÉDICA:</Text>
        <Text>{cv?.biomedicalClassification || 'N/R'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>RIESGO:</Text>
        <Text>{cv?.riskClassification || 'N/R'}</Text>
      </View>
    </View>

    {/* Fuentes de Alimentación y Tecnologías predominantes */}
    <View style={styles.classificationRow}>
      <View style={styles.classificationSection}>
        <Text style={styles.label}>TECNOLOGÍA PREDOMINANTE:</Text>
        <View style={styles.tagContainer}>
          {cv?.technologyPredominant?.map((tech, index) => (
            <View key={index} style={styles.tag}>
              <Text>{tech}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.classificationSection, { borderRight: 'none' }]}>
        <Text style={styles.label}>FUENTES DE ALIMENTACIÓN:</Text>
        {cv?.powerSupply?.map((supply, index) => (
          <View key={index} style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text>{supply}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  </>
)

/** Características técnicas */
const TechnicalSection = ({ mt }: { mt: Maintenance }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>CARACTERÍSTICAS TÉCNICAS</Text>
    </View>
    <View style={styles.techGrid}>
      {Object.entries(mt.curriculum.technicalCharacteristics || {}).map(([key, value], index) => (
        <View key={index} style={styles.techItem}>
          <View style={styles.infoCol}>
            <Text style={styles.label}>{toLabel_technicalSpecification(key)}:</Text>
            <Text>{value || 'N/A'}</Text>
          </View>
        </View>
      ))}
    </View>
  </>
)

/** Inspecciones del equipo */
const InspectionsSection = ({ cv }: { cv?: Curriculum }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>INSPECCIONES</Text>
    </View>

    <View style={[styles.techGrid, { padding: '4pt' }]}>
      {cv?.inspection?.typeInspection?.map((inspection, index) => (
        <View key={index} style={styles.inspectionTag}>
          <Text>{inspection}</Text>
        </View>
      ))}
    </View>
  </>
)

/** Observaciones */
const ObservationsSection = ({ mt }: { mt: Maintenance }) => {
  const statusStyles = getStatusStyles(mt.statusEquipment)
  return (
    <>
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>OBSERVACIONES</Text>
      </View>

      {/* Observations Section */}
      <View style={styles.observationsContainer}>
        <Text style={styles.observationsText}>
          {mt.observations}
        </Text>
      </View>

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}></Text>
      </View>

      {/* Status Section */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Estado del equipo:</Text>
        <View style={[styles.statusBadge, statusStyles.badge]}>
          <Text style={[styles.statusText, statusStyles.text]}>
            {formatStatus(mt.statusEquipment)}
          </Text>
        </View>
      </View>
    </>
  )
}

/** Proveedor del Servicio */
const ServiceProviderSection = ({ mt, com, imgs }: { mt: Maintenance, com?: Company, imgs?: Metadata[] }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}></Text>
    </View>

    {/* Fechas de mantenimiento */}
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>FECHA DE CREACIÓN:</Text>
        <Text>{mt?.createdAt ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(mt.createdAt)) : 'N/A'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2, { width: '60%' }]}>
        <Text style={styles.label}>PRÓXIMO MANTENIMIENTO PREVENTIVO:</Text>
        <Text>{mt?.dateNextMaintenance ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(mt.dateNextMaintenance)) : 'N/A'}</Text>
      </View>
    </View>

    <View style={styles.mainContainer}>
      {/* Información del ingeniero */}
      <View style={styles.engineerInfoContainer}>
        <Text style={styles.engineerTitle}>INGENIERO DE SERVICIO</Text>
        <Text style={styles.engineerDetails}>{com?.name}</Text>
        <Text style={styles.engineerDetails}>REG. INVIMA: {com?.invima}</Text>
        <Text style={styles.engineerDetails}>MP: {com?.profesionalLicense}</Text>
      </View>

      {/* Recibido a satisfacción */}
      <View style={styles.signatureBox}>
        <Text style={styles.signatureLabel}>RECIBIDO A SATISFACCIÓN</Text>
        <View style={styles.signatureLine} />
      </View>

      {/* Firma del ingeniero */}
      <View style={styles.signatureBox}>
        <Text style={styles.signatureLabel}>FIRMA INGENIERO</Text>
        <View style={styles.signatureLine}>
          {imgs?.some(img => img.name.includes('signature')) && (
            <Image
              src={imgs?.find(img => img.name.includes('signature'))?.url || "/placeholder.svg"}
              style={styles.engineerSignature}
            />
          )}
        </View>
      </View>

      {/* Logo de la empresa */}
      <View style={styles.providerLogoContainer}>
        {imgs?.some(img => img.name.includes('logo')) && (
          <Image
            src={imgs?.find(img => img.name.includes('logo'))?.url || "/placeholder.svg"}
            style={styles.providerCompanyLogo}
          />
        )}
      </View>
    </View>
  </>
)
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const formatStatus = (status: string) => {
  switch (status) {
    case 'bueno':
      return 'Funcionando'
    case 'pendiente':
      return 'En espera de repuestos'
    case 'inactivo':
      return 'Fuera de servicio'
    default:
      return 'N/A'
  }
}

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'bueno':
      return { badge: styles.statusSuccess, text: styles.statusSuccessText }
    case 'pendiente':
      return { badge: styles.statusWarning, text: styles.statusWarningText }
    case 'inactivo':
      return { badge: styles.statusError, text: styles.statusErrorText }
    default:
      return { badge: styles.statusWarning, text: styles.statusWarningText }
  }
}