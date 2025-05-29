import { formatDate, toLabel_technicalSpecification } from "@/constants/format.constants"
import { Curriculum, Maintenance } from '@/interfaces/context.interface'
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { resolveProviderHierarchy } from '@/utils/helpers'
import { styles } from "@/constants/values.constants"

// Constantes para el cálculo del espacio
const A4_HEIGHT = 842; // Altura de página A4 en puntos
const ESTIMATED_FORM_MAX_HEIGHT = 700; // Altura máxima estimada
const SECTION_TITLE_HEIGHT = 30; // Altura del título de sección
const PAGE_MARGINS = 40; // Márgenes superior e inferior combinados

interface MaintenancePDFProps { mt: Maintenance }
const MaintenancePDF = ({ mt }: MaintenancePDFProps) => {
  const hasImages = mt.metadata?.files && Array.isArray(mt.metadata.files) && mt.metadata.files.length > 0
  return (
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
          <ServiceProviderSection mt={mt} />{/* ProviderService */}
        </View>
        {hasImages && <ImagesGallerySection files={mt.metadata!.files} />}
      </Page>
    </Document>
  )
}

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
        <Text>{mt.curriculum.office.headquarter.client?.username || 'N/A'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>TELÉFONO:</Text>
        <Text>{mt.curriculum.office.headquarter.client?.phone || 'N/A'}</Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>DIRECCIÓN:</Text>
        <Text>{mt.curriculum.office.headquarter.address}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>EMAIL:</Text>
        <Text>{mt.curriculum.office.headquarter.client?.email || 'N/A'}</Text>
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
        <Text>{mt.curriculum.inventory || 'N/R'}</Text>
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
            Detalles de las actividades:
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
const ServiceProviderSection = ({ mt }: { mt: Maintenance }) => {
  const provider = resolveProviderHierarchy(mt.createdBy)
  return provider ? (
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
        {/* Información del proveedor */}
        <View style={styles.providerInfoContainer}>
          <Text style={styles.providerTitle}>{provider.position || 'INGENIERO DE SERVICIO'}</Text>
          <Text style={styles.providerDetails}>{provider.username || 'N/A'}</Text>
          <Text style={styles.providerDetails}>REG. INVIMA: {provider.invima || 'N/A'}</Text>
          <Text style={styles.providerDetails}>MP: {provider.profesionalLicense || 'N/A'}</Text>
        </View>

        {/* Recibido a satisfacción */}
        <View style={styles.signatureBox}>
          <Text style={styles.signatureLabel}>RECIBIDO A SATISFACCIÓN</Text>
          <View style={styles.signatureLine}>
            {mt?.signature?.url && (
              <Image
                style={styles.providerSignature}
                src={mt?.signature?.url}
              />
            )}
          </View>
        </View>

        {/* Firma del proveedor */}
        <View style={styles.signatureBox}>
          <Text style={styles.signatureLabel}>FIRMA INGENIERO</Text>
          <View style={styles.signatureLine}>
            {provider.metadata?.signature && (
              <Image
                style={styles.providerSignature}
                src={provider.metadata.signature}
              />
            )}
          </View>
        </View>

        {/* Logo de la empresa */}
        <View style={styles.providerLogoContainer}>
          {provider.metadata?.logo && (
            <Image
              style={styles.providerCompanyLogo}
              src={provider.metadata.logo}
            />
          )}
        </View>
      </View>
    </>
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

/** Images Gallery Section */
const ImagesGallerySection = ({ files }: { files: string[] }) => {
  const optimalHeight = calculateAvailableSpace(files)
  return (
    <>
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>IMÁGENES DEL MANTENIMIENTO</Text>
      </View>
      <View style={styles.imagesContainer}>
        {files.map((imageUrl, index) => (
          <View key={index} style={[styles.imageWrapper, { height: optimalHeight + 6 }]}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              style={[styles.maintenanceImage, { height: optimalHeight }]}
            />
          </View>
        ))}
      </View>
    </>
  )
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Estilos del estado del equipo (Maintenance pdf). */
const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'funcionando': return { badge: styles.statusSuccess, text: styles.statusSuccessText }
    case 'en espera de repuestos': return { badge: styles.statusWarning, text: styles.statusWarningText }
    case 'fuera de servicio': return { badge: styles.statusError, text: styles.statusErrorText }
    default: return { badge: styles.statusDefault, text: styles.statusDefaultText }
  }
}
/** Calculamos el espacio disponible para las imágenes */
const calculateAvailableSpace = (files: string[]) => {
  const availableHeight = A4_HEIGHT - ESTIMATED_FORM_MAX_HEIGHT - SECTION_TITLE_HEIGHT - PAGE_MARGINS;

  //Calculamos la altura óptima para las imágenes basada en el espacio disponible
  const imageCount = files.length;
  const imagesPerRow = 3; //Mantenemos 3 columnas
  const rows = Math.ceil(imageCount / imagesPerRow);

  //Distribuimos el espacio disponible entre las filas necesarias
  //con un mínimo y máximo para evitar imágenes demasiado pequeñas o grandes
  const calculatedHeight = Math.floor(availableHeight / rows);

  //Establecemos límites para la altura
  const minHeight = 130; //Altura mínima para que las imágenes sean visibles
  const maxHeight = 160; //Altura máxima para evitar que las imágenes sean demasiado grandes
  return Math.max(minHeight, Math.min(calculatedHeight, maxHeight));
}