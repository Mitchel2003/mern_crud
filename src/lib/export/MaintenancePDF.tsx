import { Company, Curriculum, Maintenance } from '@/interfaces/context.interface'
import { styles, toLabel_technicalSpecification } from "@/utils/constants"
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { Metadata } from "@/interfaces/db.interface"
import { formatDate } from "@/utils/format"

interface MaintenancePDFProps { mt: Maintenance, com?: Company, imgs?: Metadata[] }

const MaintenancePDF = ({ mt, com, imgs }: MaintenancePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <HeaderSection />{/* Title Section */}
        <ClientSection mt={mt} />{/* Client Section */}
        <EquipmentSection mt={mt} />{/* Equipment Section */}
        <BiomedicalSection cv={mt.curriculum} />{/* Biomedical Classification */}
        <TechnicalSection mt={mt} />{/* Technical Characteristics */}
        <InspectionsSection cv={mt.curriculum} />{/* Inspecciones */}
        <ObservationsSection mt={mt} />{/* Observaciones */}
        <ServiceProviderSection mt={mt} com={com} imgs={imgs} />{/* ProviderService */}
      </View>
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
      <View style={styles.formatInfo}>
        <Text style={styles.formatText}>CÓDIGO: FHV-03</Text>
        <Text style={styles.formatText}>VIGENTE DESDE: 10-03-2019</Text>
        <Text style={styles.formatText}>VERSIÓN: 03</Text>
      </View>
    </View>
  </View >
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
        <Text style={styles.label}>EMAIL:</Text>
        <Text>{mt.curriculum.office.headquarter.client.email}</Text>
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
      <View style={[styles.infoCol, styles.col3, { width: '40%' }]}>
        <Text style={styles.label}>NOMBRE:</Text>
        <Text>{mt.curriculum.name}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '30%' }]}>
        <Text style={styles.label}>MARCA:</Text>
        <Text>{mt.curriculum.brand}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '30%' }]}>
        <Text style={styles.label}>MODELO:</Text>
        <Text>{mt.curriculum.modelEquip}</Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col3, { width: '40%' }]}>
        <Text style={styles.label}>SEDE:</Text>
        <Text>{mt.curriculum.office.headquarter.name}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '30%' }]}>
        <Text style={styles.label}>SERIE:</Text>
        <Text>{mt.curriculum.serie}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '30%' }]}>
        <Text style={styles.label}>INVENTARIO:</Text>
        <Text>{mt.curriculum.codeEquip || 'N/R'}</Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2, { width: '40%' }]}>
        <Text style={styles.label}>SERVICIO:</Text>
        <Text>{mt.curriculum.service}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2, { width: '60%' }]}>
        <Text style={styles.label}>UBICACIÓN:</Text>
        <Text>{mt.curriculum.office.name}</Text>
      </View>
    </View>
  </>
)

/** Clasificación biomédica del equipo */
const BiomedicalSection = ({ cv }: { cv?: Curriculum }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>CLASIFICACIÓN</Text>
    </View>

    {/* Estado, Riesgo, Uso y Tipo */}
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col3, { width: '50%' }]}>
        <Text style={styles.label}>CLASIFICACIÓN USO:</Text>
        <Text>{cv?.useClassification || 'N/R'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>EQUIPO:</Text>
        <Text>{cv?.equipClassification || 'N/R'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>TIPO:</Text>
        <Text>{cv?.typeClassification || 'N/R'}</Text>
      </View>
    </View>

    {cv?.typeClassification === 'biomédico' && (
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
    )}

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
        <View style={styles.tagContainer}>
          {cv?.powerSupply?.map((supply, index) => (
            <View key={index} style={styles.tag}>
              <Text>{supply}</Text>
            </View>
          ))}
        </View>
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
      <Text style={styles.sectionTitleText}>ACTIVIDADES</Text>
    </View>

    <View style={styles.techGrid}>
      {cv?.inspection?.typeInspection?.map((inspection, index) => (
        <View key={index} style={styles.inspectionTag}>
          <View style={styles.inspectionContent}>
            <View style={styles.checkmark} />
            <Text style={styles.inspectionText}>
              {inspection}
            </Text>
          </View>
        </View>
      ))}
    </View>
  </>
)

/** Observaciones */
const ObservationsSection = ({ mt }: { mt: Maintenance }) => {
  const typeMaintenanceStyles = getStatusStyles(mt.typeMaintenance)
  const statusStyles = getStatusStyles(mt.statusEquipment)
  return (
    <>
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>OBSERVACIONES</Text>
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Status Section */}
        <View style={styles.statusContainer}>
          {/* Primera columna - Tipo mantenimiento */}
          <View style={[styles.statusColumn, styles.col2]}>
            <View style={styles.statusContent}>
              <Text style={styles.statusLabel}>Tipo mantenimiento:</Text>
              <View style={[styles.statusBadge, typeMaintenanceStyles.badge]}>
                <Text style={[styles.statusText, typeMaintenanceStyles.text]}>
                  {mt.typeMaintenance}
                </Text>
              </View>
            </View>
          </View>

          {/* Segunda columna - Estado del equipo */}
          <View style={[styles.statusColumn, styles.col2]}>
            <View style={styles.statusContent}>
              <Text style={styles.statusLabel}>Estado del equipo:</Text>
              <View style={[styles.statusBadge, statusStyles.badge]}>
                <Text style={[styles.statusText, statusStyles.text]}>
                  {mt.statusEquipment}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Observations Section */}
        <View style={styles.observationsContainer}>
          <Text style={styles.observationsTitle}>
            Detalles de la inspección:
          </Text>
          <Text style={styles.observationsText}>
            {mt.observations}
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
        <Text style={styles.label}>FECHA MANTENIMIENTO:</Text>
        <Text>{formatDate(mt?.dateMaintenance)}</Text>
      </View>
      {mt.typeMaintenance === 'preventivo' && (
        <View style={[styles.infoCol, styles.col2, { width: '60%' }]}>
          <Text style={styles.label}>PRÓXIMO MANTENIMIENTO PREVENTIVO:</Text>
          <Text>{formatDate(mt?.dateNextMaintenance)}</Text>
        </View>
      )}
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
/** Estilos del estado del equipo (Maintenance pdf). */
const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'funcionando':
      return { badge: styles.statusSuccess, text: styles.statusSuccessText }
    case 'en espera de repuestos':
      return { badge: styles.statusWarning, text: styles.statusWarningText }
    case 'fuera de servicio':
      return { badge: styles.statusError, text: styles.statusErrorText }
    default:
      return { badge: styles.statusDefault, text: styles.statusDefaultText }
  }
}