import { Curriculum, Accessory, Company } from "@/interfaces/context.interface"
import { Document, Page, Text, View, Image } from '@react-pdf/renderer'
import { styles } from "@/utils/constants"

interface CurriculumPDFProps {
  accessories?: Accessory[]
  comLogo?: string
  cliLogo?: string
  company: Company
  cvLogo?: string
  cv: Curriculum
}

const CurriculumPDF = ({ cv, accessories, cliLogo, comLogo, cvLogo, company }: CurriculumPDFProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title Section */}
        <HeaderSection cliLogo={cliLogo} />

        {/* Format Info Section */}
        <View style={styles.formatInfo}>
          <Text style={styles.formatText}>CÓDIGO: FHV-01</Text>
          <Text style={styles.formatText}>VIGENTE DESDE: 01-09-2019</Text>
          <Text style={styles.formatText}>VERSIÓN: 02</Text>
        </View>

        <ClientSection cv={cv} />{/* Client Section */}
        <EquipmentSection cv={cv} cvLogo={cvLogo} accessories={accessories} />{/* Equipment Section */}
        <BioClassificationSection cv={cv} />{/* Biomedical Classification */}
        <MaintenanceSection cv={cv} />{/* Mantenimiento */}
        <TechnicalSection cv={cv} />{/* Technical Characteristics */}
        <InspectionsSection inspections={cv.inspection.typeInspection} />{/* Inspecciones */}
        <CharacteristicsSection cv={cv} />{/* Características */}
        <ServiceProviderSection company={company} companyLogo={comLogo} />{/* ProviderService */}
      </Page>
    </Document>
  )
}

export default CurriculumPDF
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
/** Encabezado */
const HeaderSection = ({ cliLogo }: { cliLogo?: string }) => (
  <>
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image src={cliLogo || "https://placehold.co/200x200/e2e2e2/666666?text=Sin+imagen"} style={styles.logo} />
      </View>
      <View style={styles.titleContainer}>
        <View style={styles.mainTitle}>
          <Text style={styles.titleText}>PROCESO DE CALIDAD</Text>
          <Text style={styles.titleText}>FORMATO HOJA DE VIDA EQUIPOS</Text>
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
        <Text>{cv.office?.headquarter?.client?.name || 'N/A'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>SERVICIO:</Text>
        <Text>{cv.service || 'N/A'}</Text>
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
      <View style={[styles.infoCol, styles.col3, { width: "40%" }]}>
        <Text style={styles.label}>OFICINA:</Text>
        <Text>{cv.office?.name || 'N/A'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: "30%" }]}>
        <Text style={styles.label}>TELEFONO:</Text>
        <Text>{cv.office?.headquarter?.client?.phone || 'N/A'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3, { width: "30%" }]}>
        <Text style={styles.label}>NIT:</Text>
        <Text>{cv.office?.headquarter?.client?.nit || 'N/A'}</Text>
      </View>
    </View>
  </>
)

/** Información del equipo - datos generales y especificaciones */
const EquipmentSection = ({ cv, accessories, cvLogo }: { cv: Curriculum, accessories?: Accessory[], cvLogo?: string }) => (
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
      </View>

      {cvLogo && (
        <Image src={cvLogo || "https://placehold.co/200x200/e2e2e2/666666?text=Sin+imagen"} style={styles.equipmentImage} />
      )}
    </View>

    {/* equipment dates */}
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col3]}>
        <Text style={styles.label}>COMPRA:</Text>
        <Text>{cv?.datePurchase ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(cv.datePurchase)) : 'N/A'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3]}>
        <Text style={styles.label}>INSTALACIÓN:</Text>
        <Text>{cv?.dateInstallation ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(cv.dateInstallation)) : 'N/A'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col3]}>
        <Text style={styles.label}>OPERACIÓN:</Text>
        <Text>{cv?.dateOperation ? new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(cv.dateOperation)) : 'N/A'}</Text>
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
  </>
)

/** Clasificación biomédica del equipo */
const BioClassificationSection = ({ cv }: { cv: Curriculum }) => (
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>CLASIFICACIÓN BIOMÉDICA</Text>
    </View>

    {/* Estado, Riesgo, Uso y Tipo */}
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>CLASIFICACIÓN USO:</Text>
        <Text>{cv.useClassification || 'N/R'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>TIPO:</Text>
        <Text>{cv.typeClassification || 'N/R'}</Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>CLASIFICACIÓN BIOMÉDICA:</Text>
        <Text>{cv.biomedicalClassification || 'N/R'}</Text>
      </View>
      <View style={[styles.infoCol, styles.col2]}>
        <Text style={styles.label}>RIESGO:</Text>
        <Text>{cv.riskClassification || 'N/R'}</Text>
      </View>
    </View>

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
        {cv.powerSupply.map((supply, index) => (
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
            <Text style={styles.label}>{toLabel(key)}:</Text>
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
      <Text style={styles.sectionTitleText}>INSPECCIONES</Text>
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
  <>
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>CARACTERÍSTICAS</Text>
    </View>

    <View style={styles.characteristicsContainer}>
      {/* Características del equipo */}
      <View style={styles.characteristicsCol}>
        <Text style={styles.label}>Características del equipo</Text>
        <Text style={[styles.descriptionText, { marginTop: '4pt' }]}>
          {cv.characteristics}
        </Text>
      </View>

      {/* Recomendaciones del fabricante */}
      <View style={styles.characteristicsCol}>
        <Text style={styles.label}>Recomendaciones del fabricante</Text>
        <View style={styles.recommendationsList}>
          {cv.recommendationsManufacturer?.split?.('\n')?.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.recommendationNumber}>
                {`${index + 1}.`}
              </Text>
              <Text style={styles.recommendationText}>
                {recommendation}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  </>
)
/** Proveedor del Servicio */
const ServiceProviderSection = ({ company, companyLogo }: { company: Company, companyLogo?: string }) => (
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
            {company?.name || 'N/A'}
          </Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.providerLabel}>Registro Invima:</Text>
          <Text style={styles.providerValue}>
            {company?.invima || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Logo de la empresa */}
      {companyLogo && (
        <Image
          src={companyLogo || "https://placehold.co/100x100/e2e2e2/666666?text=Sin+imagen"}
          style={styles.providerLogo}
        />
      )}
    </View>
  </>
)

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