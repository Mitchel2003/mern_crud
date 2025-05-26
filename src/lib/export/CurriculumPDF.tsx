import { formatDateTime, formatDate, toLabel_technicalSpecification } from "@/constants/format.constants"
import { Curriculum, Accessory, User, Maintenance } from "@/interfaces/context.interface"
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { resolveProviderHierarchy } from '@/utils/helpers'
import { styles } from "@/constants/values.constants"

interface CurriculumPDFProps { cv: Curriculum; client: User; accs?: Accessory[]; mts?: Maintenance[] }
const CurriculumPDF = ({ cv, accs, client, mts = [] }: CurriculumPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <HeaderSection client={client} />{/* Title Section */}
        <ClientSection cv={cv} />{/* Client Section */}
        <EquipmentSection cv={cv} accessories={accs} />{/* Equipment Section */}
        <BioClassificationSection cv={cv} />{/* Biomedical Classification */}
        <MaintenanceSection cv={cv} />{/* Mantenimiento */}
        <TechnicalSection cv={cv} />{/* Technical Characteristics */}
        <InspectionsSection inspections={cv.inspection.typeInspection} />{/* Inspecciones */}
        <CharacteristicsSection cv={cv} />{/* Características */}
        <ServiceProviderSection cv={cv} />{/* ProviderService */}
      </View>
      {mts && mts.length > 0 && <MaintenanceHistorySection maintenances={mts} />}
    </Page>
  </Document>
)

export default CurriculumPDF
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Encabezado */
const HeaderSection = ({ client }: { client: User }) => (
  <>
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image src={client?.metadata?.logo || "https://placehold.co/200x200/e2e2e2/666666?text=Sin+imagen"} style={styles.logo} />
      </View>
      <View style={[styles.titleContainer, { borderLeft: '1pt solid black' }]}>
        <View style={styles.mainTitle}>
          <Text style={styles.titleText}>PROCESO DE CALIDAD</Text>
          <Text style={styles.titleText}>FORMATO HOJA DE VIDA EQUIPOS</Text>
        </View>
        <View style={styles.formatInfo}>
          <Text style={styles.formatText}>CÓDIGO: FHV-03</Text>
          <Text style={styles.formatText}>VIGENTE DESDE: 10-03-2019</Text>
          <Text style={styles.formatText}>VERSIÓN: 03</Text>
        </View>
      </View>
    </View>
  </>
)

/** Información del cliente */
const ClientSection = ({ cv }: { cv: Curriculum }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>CLIENTE</Text>
    </View>
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>NOMBRE:</Text>
        <Text>{cv.office?.headquarter?.client?.username || 'N/A'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>SEDE:</Text>
        <Text>{cv.office?.headquarter?.name || 'N/A'}</Text>
      </View>
    </View>

    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>SERVICIO:</Text>
        <Text>{cv.service || 'N/A'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>EMAIL:</Text>
        <Text>{cv.office?.headquarter?.client?.email || 'N/A'}</Text>
      </View>
    </View>

    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>DIRECCIÓN:</Text>
        <Text>{cv.office?.headquarter?.address || 'N/A'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col4]}>
        <Text style={styles.label}>TELEFONO:</Text>
        <Text>{cv.office?.headquarter?.client?.phone || 'N/A'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col4]}>
        <Text style={styles.label}>NIT:</Text>
        <Text>{cv.office?.headquarter?.client?.nit || 'N/A'}</Text>
      </View>
    </View>
  </>
)

/** Información del equipo - datos generales y especificaciones */
const EquipmentSection = ({ cv, accessories }: { cv: Curriculum, accessories?: Accessory[] }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>INFORMACIÓN DEL EQUIPO</Text>
    </View>
    {/* equipment info */}
    <View style={styles.equipmentContainer}>
      <View style={styles.equipmentInfo}>

        <View style={styles.infoRow}>
          <View style={[styles.infoCol, styles.col2]}>
            <Text style={styles.label}>NOMBRE:</Text>
            <Text>{cv.name}</Text>
          </View>
          <View style={[styles.infoCol, styles.col2]}>
            <Text style={styles.label}>UBICACIÓN:</Text>
            <Text>{cv.office.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoCol, styles.col2, { width: "50%" }]}>
            <Text style={styles.label}>MARCA:</Text>
            <Text>{cv.brand}</Text>
          </View>
          <View style={[styles.infoCol, styles.col2, { width: "50%" }]}>
            <Text style={styles.label}>MODELO:</Text>
            <Text>{cv.modelEquip}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoCol, styles.col2, { width: "50%" }]}>
            <Text style={styles.label}>SERIE:</Text>
            <Text>{cv.serie}</Text>
          </View>
          <View style={[styles.infoCol, styles.col2, { width: "50%" }]}>
            <Text style={styles.label}>INVIMA:</Text>
            <Text>{cv.healthRecord}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.infoCol, styles.col2, { width: "50%" }]}>
            <Text style={styles.label}>INVENTARIO:</Text>
            <Text>{cv.inventory || 'N/A'}</Text>
          </View>
          <View style={[styles.infoCol, styles.col3, { width: "25%" }]}>
            <Text style={styles.label}>GARANTÍA:</Text>
            <Text>{cv.warranty || 'N/A'}</Text>
          </View>
          <View style={[styles.infoCol, styles.col3, { width: "25%" }]}>
            <Text style={styles.label}>VALOR:</Text>
            <Text>{cv.price || 'N/A'}</Text>
          </View>
        </View>

        {/* Accessories Table */}
        <View style={[styles.tableHeader, { backgroundColor: '#D3D3D3', textAlign: 'center' }]}>
          <View style={styles.tableCell}>
            <Text style={styles.label}>{accessories && accessories.length > 0 ? 'ACCESORIOS' : 'NO TIENE ACCESORIOS'}</Text>
          </View>
        </View>
        {accessories && accessories.length > 0 && (
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
        )}
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

      {cv.photoUrl && (
        <Image src={cv.photoUrl || "https://placehold.co/200x200/e2e2e2/666666?text=Sin+imagen"} style={styles.equipmentImage} />
      )}
    </View>

    {/* equipment dates */}
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col3, { width: '50%' }]}>
        <Text style={styles.label}>COMPRA:</Text>
        <Text>{formatDateTime(cv?.datePurchase)}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>INSTALACIÓN:</Text>
        <Text>{formatDateTime(cv?.dateInstallation)}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>OPERACIÓN:</Text>
        <Text>{formatDateTime(cv?.dateOperation)}</Text>
      </View>
    </View>

    {/** stakeholders */}
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col3, { width: '50%' }]}>
        <Text style={styles.label}>FABRICANTE:</Text>
        <Text>{cv.manufacturer.name.length > 35 ? cv.manufacturer.name.substring(0, 35) + '...' : cv.manufacturer.name}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>TELEFONO:</Text>
        <Text>{cv.manufacturer.phone}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>PAÍS:</Text>
        <Text>{cv.manufacturer.country}</Text>
      </View>
    </View>

    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col3, { width: '50%' }]}>
        <Text style={styles.label}>PROVEEDOR:</Text>
        <Text>{cv.supplier.name.length > 35 ? cv.supplier.name.substring(0, 35) + '...' : cv.supplier.name}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>TELEFONO:</Text>
        <Text>{cv.supplier.phone}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>CIUDAD:</Text>
        <Text>{cv.supplier.city}</Text>
      </View>
    </View>

    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col3, { width: '50%' }]}>
        <Text style={styles.label}>REPRESENTANTE:</Text>
        <Text>{cv.representative.name.length > 35 ? cv.representative.name.substring(0, 35) + '...' : cv.representative.name}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>TELEFONO:</Text>
        <Text>{cv.representative.phone}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>CIUDAD:</Text>
        <Text>{cv.representative.city}</Text>
      </View>
    </View>
  </>
)

/** Clasificación del equipo */
const BioClassificationSection = ({ cv }: { cv: Curriculum }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>CLASIFICACIÓN</Text>
    </View>

    {/* Estado, Riesgo, Uso y Tipo */}
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col3, { width: '50%' }]}>
        <Text style={styles.label}>CLASIFICACIÓN USO:</Text>
        <Text>{cv.useClassification || 'N/R'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>EQUIPO:</Text>
        <Text>{cv.equipClassification || 'N/R'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: '25%' }]}>
        <Text style={styles.label}>TIPO:</Text>
        <Text>{cv.typeClassification || 'N/R'}</Text>
      </View>
    </View>

    {cv.typeClassification === 'biomédico' && (
      <View style={styles.infoRow}>
        <View style={[styles.infoCol, styles.col2]}>
          <Text style={styles.label}>CLASIFICACIÓN BIOMÉDICA:</Text>
          <Text>{cv.biomedicalClassification || 'N/R'}</Text>
        </View>
        <View style={[styles.infoCol, styles.col2]}>
          <Text style={styles.label}>RIESGO:</Text>
          <Text>{cv.riskClassification || 'N/R'}</Text>
        </View>
      </View>
    )}

    {/* Fuentes de Alimentación y Tecnologías predominantes */}
    <View style={styles.classificationRow}>
      <View style={styles.classificationSection}>
        <Text style={styles.label}>TECNOLOGÍA PREDOMINANTE:</Text>
        <View style={styles.tagContainer}>
          {cv.technologyPredominant?.map((tech, index) => (
            <View key={index} style={styles.tag}>
              <Text>{tech}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.classificationSection, { borderRight: 'none' }]}>
        <Text style={styles.label}>FUENTES DE ALIMENTACIÓN:</Text>
        <View style={styles.tagContainer}>
          {cv.powerSupply.map((supply, index) => (
            <View key={index} style={styles.tag}>
              <Text>{supply}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  </>
)

/** Datos de mantenimiento */
const MaintenanceSection = ({ cv }: { cv: Curriculum }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>MANTENIMIENTO</Text>
    </View>

    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>REALIZACIÓN:</Text>
        <Text>{cv.employmentMaintenance || 'N/R'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>FRECUENCIA:</Text>
        <Text>{cv.frequencyMaintenance || 'N/R'}</Text>
      </View>
    </View>

    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>MANUALES:</Text>
        {typeof cv.manualsMaintenance === 'string'
          ? (<Text>{cv.manualsMaintenance || 'N/R'}</Text>)
          : cv.manualsMaintenance?.map((manual, index) => (
            <View key={index} style={styles.tagContainer}>
              <View style={styles.tag}>
                <Text>{manual}</Text>
              </View>
            </View>
          ))
        }
      </View>

      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>TIPO:</Text>
        {cv.typeMaintenance?.map((manual, index) => (
          <View key={index} style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text>{manual}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  </>
)

/** Características técnicas */
const TechnicalSection = ({ cv }: { cv: Curriculum }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>CARACTERÍSTICAS TÉCNICAS</Text>
    </View>
    <View style={styles.techGrid}>
      {Object.entries(cv.technicalCharacteristics || {}).map(([key, value], index) => (
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
const InspectionsSection = ({ inspections }: { inspections: string[] }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>ACTIVIDADES</Text>
    </View>

    <View style={[styles.techGrid, { padding: '4pt' }]}>
      {inspections?.map((inspection, index) => (
        <View key={index} style={styles.inspectionTag}>
          <Text>{inspection}</Text>
        </View>
      ))}
    </View>
  </>
)

/** Características del equipo y recomendaciones del fabricante */
const CharacteristicsSection = ({ cv }: { cv: Curriculum }) => (
  <View style={styles.row}>
    {/* Características */}
    <View style={[{ flex: 1 }]}>
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>CARACTERÍSTICAS DEL EQUIPO</Text>
      </View>
      <View style={[{ padding: '2pt 4pt' }]}>
        <Text style={[{ fontSize: '9pt' }]}>{cv.characteristics}</Text>
      </View>
    </View>

    {/* Recomendaciones */}
    <View style={[{ flex: 1 }]}>
      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>RECOMENDACIONES DEL FABRICANTE</Text>
      </View>
      <View style={[{ padding: '2pt 4pt' }]}>
        {cv.recommendationsManufacturer?.split('\n').map((recommendation, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={[{ fontSize: '9pt' }]}>{recommendation}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
)

/** Proveedor del Servicio */
const ServiceProviderSection = ({ cv }: { cv: Curriculum }) => {
  const provider = resolveProviderHierarchy(cv.createdBy)
  return provider ? (
    <>
      <View style={[styles.sectionTitle, { marginBottom: '0pt' }]}>
        <Text style={styles.sectionTitleText}>PROVEEDOR DEL SERVICIO</Text>
      </View>

      <View style={styles.providerContainer}>
        {/* Información del proveedor */}
        <View style={styles.providerInfo}>
          <View style={styles.infoGroup}>
            <Text style={styles.providerLabel}>Nombre del proveedor:</Text>
            <Text style={styles.providerValue}>
              {provider?.username || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.providerLabel}>Registro Invima:</Text>
            <Text style={styles.providerValue}>
              {provider?.invima || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Logo de la empresa */}
        {provider?.metadata && (
          <Image
            style={styles.providerLogo}
            src={provider?.metadata?.logo || "https://placehold.co/100x100/e2e2e2/666666?text=Sin+imagen"}
          />
        )}
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

/** Historial de mantenimientos */
const MaintenanceHistorySection = ({ maintenances }: { maintenances: Maintenance[] }) => {
  const truncateText = (text: string, maxLength: number = 150) => {
    if (!text) return 'N/A'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <View style={styles.container} break>
      <View style={styles.maintenanceHistoryHeader}>
        <Text style={styles.maintenanceHistoryHeaderText}>
          HISTORIAL DE MANTENIMIENTOS
        </Text>
      </View>

      {/* Encabezados de la tabla */}
      <View style={styles.maintenanceTableHeader}>
        <View style={[styles.maintenanceTableHeaderCell, styles.maintenanceTableColumnDate]}>
          <Text style={styles.maintenanceTableHeaderText}>FECHA</Text>
        </View>
        <View style={[styles.maintenanceTableHeaderCell, styles.maintenanceTableColumnType]}>
          <Text style={styles.maintenanceTableHeaderText}>TIPO</Text>
        </View>
        <View style={[styles.maintenanceTableHeaderCell, styles.maintenanceTableColumnStatus]}>
          <Text style={styles.maintenanceTableHeaderText}>ESTADO</Text>
        </View>
        <View style={[styles.maintenanceTableHeaderCell, styles.maintenanceTableColumnObservations]}>
          <Text style={styles.maintenanceTableHeaderText}>OBSERVACIONES</Text>
        </View>
      </View>

      {/* Filas de la tabla */}
      {maintenances.map((maintenance, index) => (
        <View key={index} style={[styles.maintenanceTableRow, index % 2 === 0 ? styles.maintenanceTableRowEven : styles.maintenanceTableRowOdd]}>
          <View style={[styles.maintenanceTableCell, styles.maintenanceTableColumnDate]}>
            <Text style={styles.maintenanceTableCellText}>
              {formatDate(maintenance.dateMaintenance) || 'N/A'}
            </Text>
          </View>
          <View style={[styles.maintenanceTableCell, styles.maintenanceTableColumnType]}>
            <Text style={styles.maintenanceTableCellText}>
              {maintenance.typeMaintenance || 'N/A'}
            </Text>
          </View>
          <View style={[styles.maintenanceTableCell, styles.maintenanceTableColumnStatus]}>
            <Text style={[styles.maintenanceTableCellStatus, { color: getStatusColor(maintenance.statusEquipment) }]}>
              {maintenance.statusEquipment || 'N/A'}
            </Text>
          </View>
          <View style={[styles.maintenanceTableCell, styles.maintenanceTableColumnObservations]}>
            <Text style={styles.maintenanceTableCellObservations}>
              {truncateText(maintenance.observations, 150)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Función para determinar el color del estado */
const getStatusColor = (status?: string) => {
  if (!status) return '#000000'
  switch (status.toLowerCase()) {
    case 'funcionando': return '#16a34a' // Verde
    case 'en espera de repuestos': return '#ca8a04' // Amarillo
    case 'fuera de servicio': return '#dc2626' // Rojo
    default: return '#000000' // Negro
  }
}