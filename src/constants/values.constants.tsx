import { SignMaintenanceFormProps, OfficeFormProps, HeadquarterFormProps, CityFormProps, StateFormProps, CountryFormProps } from '@/schemas/location/location.schema'
import { ClientFlowProps, UserFormProps } from '@/schemas/auth/auth.schema'
import { MaintenanceFormProps } from '@/schemas/format/maintenance.schema'
import { CurriculumFormProps } from '@/schemas/format/curriculum.schema'
import { ScheduleFormProps } from '@/schemas/format/schedule.schema'
import { ActivityFormProps } from '@/schemas/format/activity.schema'
import { SolicitFormProps } from '@/schemas/format/solicit.schema'

import { Curriculum, Schedule } from '@/interfaces/context.interface'
import { Building2, BriefcaseBusiness, Users } from 'lucide-react'
import { StyleSheet } from '@react-pdf/renderer'

/*--------------------------------------------------default navigation routes--------------------------------------------------*/
export const navigationTabs = [{
  value: 'clients',
  label: 'Clientes',
  icon: <Users className='h-4 w-4' />,
  paths: ['/clients', '/client', '/client/'],
  baseRoute: '/clients'
}, {
  label: 'Sedes',
  value: 'headquarters',
  icon: <Building2 className='h-4 w-4' />,
  paths: ['/location/headquarters', '/location/headquarter', '/location/headquarter/'],
  baseRoute: '/location/headquarters'
}, {
  value: 'offices',
  label: 'Consultorios',
  icon: <BriefcaseBusiness className='h-4 w-4' />,
  paths: ['/location/offices', '/location/office', '/location/office/'],
  baseRoute: '/location/offices'
}]
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default format values--------------------------------------------------*/
/**
 * Valores predeterminados para el formulario de currículum
 * @type {CurriculumFormProps}
 */
export const curriculumDefaultValues: CurriculumFormProps = {
  //helpers fields not has been sent to database
  client: '', //helper locationData
  headquarter: '', //helper locationData
  office: '', //locationData
  service: '', //locationData

  preview: '', //basicData
  name: '', //basicData
  brand: '', //basicData
  serie: '', //basicData
  modelEquip: '', //basicData
  healthRecord: '', //basicData
  photoUrl: [], //basicData (create after that cv)

  newAnnexes: [], //characteristics
  annexesPreview: [], //characteristics
  characteristics: '', //characteristics
  recommendationsManufacturer: '', //characteristics

  datePurchase: null, //datailsEquipment
  dateOperation: null, //datailsEquipment
  dateInstallation: null, //datailsEquipment
  acquisition: '', //datailsEquipment
  warranty: '', //datailsEquipment
  price: '', //datailsEquipment

  //equipment
  useClassification: '', //equipmentClassification
  typeClassification: '', //equipmentClassification
  equipClassification: '', //equipmentClassification
  biomedicalClassification: '', //equipmentClassification
  riskClassification: '', //equipmentClassification
  technologyPredominant: [], //equipmentClassification
  powerSupply: [], //equipmentClassification

  //technical characteristics
  technicalCharacteristics: {
    voltage: '', //technicalCharacteristics
    amperage: '', //technicalCharacteristics
    power: '', //technicalCharacteristics
    frequency: '', //technicalCharacteristics
    capacity: '', //technicalCharacteristics
    pressure: '', //technicalCharacteristics
    speed: '', //technicalCharacteristics
    humidity: '', //technicalCharacteristics
    temperature: '', //technicalCharacteristics
    weight: '', //technicalCharacteristics
  },

  //maintenance
  employmentMaintenance: '', //maintenance
  frequencyMaintenance: '', //maintenance
  typeMaintenance: [], //maintenance
  manualsMaintenance: [], //maintenance

  //relationship
  inspection: '', //inspection
  supplier: '', //datailsEquipment
  manufacturer: '', //datailsEquipment
  representative: '', //datailsEquipment

  //helpers fields not has been sent to database "curriculum"
  newSupplier: [],
  newManufacturer: [],
  newRepresentative: [],

  //helpers fields not has been sent to database "inspection and accessories"
  newInspection: [],
  newAccessories: []
}

/**
 * Valores predeterminados para el formulario de mantenimiento
 * @type {MaintenanceFormProps}
 */
export const maintenanceDefaultValues: MaintenanceFormProps = {
  //helpers reference
  client: '',
  headquarter: '',
  office: '',
  curriculum: '',

  //timestandard
  annexesPreview: [],
  dateNextMaintenance: null,
  dateMaintenance: null,

  //maintenance
  typeMaintenance: '',
  statusEquipment: '',
  observations: '',
  newAnnexes: []
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default location values--------------------------------------------------*/
export const countryDefaultValues: CountryFormProps = { name: '' }
export const stateDefaultValues: StateFormProps = { name: '', country: '' }
export const cityDefaultValues: CityFormProps = { name: '', state: '' }
export const headquarterDefaultValues: HeadquarterFormProps = { name: '', address: '', client: '', city: '', state: '', country: '' }
export const signMaintenanceDefaultValues: SignMaintenanceFormProps = { preview: '', signature: [], image: [] }
export const officeDefaultValues: OfficeFormProps = { name: '', headquarter: '', services: [] }
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default auth values--------------------------------------------------*/
export const userDefaultValues: UserFormProps = {
  previewCompanySignature: '',
  previewCompanyLogo: '',
  previewClientImage: '',
  photoSignature: [],
  photoImage: [],
  photoLogo: [],
  //user credentials
  password: '',
  email: '',
  phone: '',
  username: '',
  position: '',
  nit: '',
  invima: '',
  profesionalLicense: '',
  //user access
  role: '',
  permissions: [],
  //handler references
  belongsTo: undefined,
  classification: []
}
export const clientFlowDefaultValues: ClientFlowProps = {
  client: { email: '', password: '', username: '', position: '', phone: '', nit: '', role: 'client', photoUrl: [] },
  headquarter: [{ name: '', address: '', city: '' }],
  office: [{ headquarter: '', services: [], name: '' }]
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default format values--------------------------------------------------*/
export const solicitDefaultValues: SolicitFormProps = {
  cv: { name: '', brand: '', serie: '', modelEquip: '', healthRecord: '' },
  message: '',
  priority: '',
  photoUrl: [],
}
export const activityDefaultValues: ActivityFormProps = {
  timeHours: { start: '08:00', end: '17:00' },
  dateAssignment: undefined,
  collaborator: '',
  description: '',
  solicit: '',
}
export const scheduleDefaultValues: ScheduleFormProps = {
  typeSchedule: '',
  client: '',
  subject: '',
  message: '',
  typeClassification: '',
  yearOperation: undefined,
  monthOperation: undefined,
  dateAttendance: undefined,
  newRowAttendance: [],
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default static--------------------------------------------------*/
export const defaultWarranty = [
  { label: "Ninguna", value: "N/A" },
  { label: "6 meses", value: "6 meses" },
  { label: "1 año", value: "12 meses" }
]
//biomedics
export const riskCollection: Curriculum['riskClassification'][] = [
  'I', 'IIA', 'IIB', 'III'
]
export const equipClassCollection: Curriculum['equipClassification'][] = [
  'fijo', 'móvil'
]
export const typeClassCollection: Curriculum['typeClassification'][] = [
  'biomédico', 'red de frio', 'equipo computo'
]
export const useClassCollection: Curriculum['useClassification'][] = [
  'médico', 'básico', 'apoyo'
]
export const powerSupplyCollection: Curriculum['powerSupply'] = [
  'agua', 'aire', 'gas', 'vapor', 'electricidad', 'ninguno'
]
export const technologyCollection: Curriculum['technologyPredominant'] = [
  'mecánico', 'eléctrico', 'electrónico', 'hidráulico', 'neumático'
]
export const biomedicalCollection: Curriculum['biomedicalClassification'][] = [
  'diagnóstico', 'prevención', 'rehabilitación', 'red de frio', 'análisis de laboratorio', 'tratamiento y mantenimiento de vida'
]
//maintenance
export const typeMaintenanceCollection: Curriculum['typeMaintenance'] = [
  'preventivo', 'correctivo', 'predictivo', 'reacondicionamiento y ajuste'
]
export const manualsMaintenanceCollection: Curriculum['manualsMaintenance'] = [
  'servicio', 'componentes', 'usuario', 'despiece'
]
export const typeSchedule: Schedule['type'][] = [
  'capacitación', 'mantenimiento', 'acta de asistencia'
]
export interface ServiceGroup { name: string, services: string[] }
export const groupCollection: ServiceGroup[] = [{
  name: 'Consulta externa',
  services: [
    'Pediatría',
    'Medicinas alternativas',
    'Consulta externa general',
    'Consulta odontologica general',
    'Consulta odontologica especializada',
    'Consulta externa especialidades medicas',
  ]
}, {
  name: 'Atención inmediata',
  services: [
    'Urgencias baja complejidad',
    'Urgencias mediana complejidad',
    'Urgencias alta complejidad',
    'atención prehospitalaria',
    'transporte asistencial',
    'atención del parto'
  ]
}, {
  name: 'Apoyo diagnostico y complementación terapéutica',
  services: [
    'Radioterapia',
    'Electrodiagnostico',
    'Laboratorio clínico',
    'Toma de muestras de laboratorio clínico',
    'Servicio farmacéutico baja complejidad',
    'Servicio farmacéutico mediana complejidad',
    'Servicio farmacéutico alta complejidad',
    'Toma e interpretación de radiografías odontológicas',
    'Radiología e imágenes diagnósticas baja complejidad',
    'Radiología e imágenes diagnósticas mediana complejidad',
    'Radiología e imágenes diagnósticas alta complejidad',
    'Ultrasonido',
    'Quimioterapia',
    'Medicina nuclear',
    'Transfusión sanguínea',
    'Diagnóstico cardiovascular',
    'Laboratorio clínico baja complejidad',
    'Laboratorio clínico mediana complejidad',
    'Laboratorio clínico alta complejidad',
    'Toma de muestras de cuello uterino y ginecológicas',
    'Laboratorio de citologías cervico-uterinas',
    'Laboratorio de función pulmonar',
    'Laboratorio de histotecnología',
    'Laboratorio de patología',
    'Terapias alternativas',
    'Endoscopia Digestiva',
    'Diálisis peritoneal',
    'Hemodiálisis',
    'Vacunación',
    'Neumología',
    'Hemodinamia'
  ]
}, {
  name: 'Urgencias',
  services: [
    'Urgencias de baja complejidad',
    'Urgencias de mediana complejidad',
    'Urgencias de alta complejidad',
  ]
}, {
  name: 'Transporte asistencial',
  services: [
    'Transporte asistencial básico',
    'Transporte asistencial medicalizado'
  ]
}, {
  name: 'Quirúrgicos',
  services: [
    'Cirugía baja complejidad',
    'Cirugía mediana complejidad',
    'Cirugía alta complejidad',
    'Cirugía ambulatoria',
    'Trasplante de órganos',
    'Trasplante de tejidos',
    'Trasplante de progenitores hematopoyéticos'
  ]
}, {
  name: 'Internación',
  services: [
    'Hospitalización baja complejidad',
    'Hospitalización mediana complejidad',
    'Hospitalización alta complejidad',
    'Hospitalización paciente crónico',
    'Hospitalización obstétrica baja complejidad',
    'Hospitalización obstétrica mediana complejidad',
    'Hospitalización obstétrica alta complejidad',
    'Hospitalización en unidad de salud mental',
    'Unidad de quemados adultos y/o pediátricos',
    'Cuidado básico del consumo de sustancias psicoactivas',
    'Cuidado básico neonatal',
    'Cuidado intermedio neonatal',
    'Cuidado intensivo neonatal',
    'Cuidado intermedio pediátrico',
    'Cuidado intensivo pediátrico',
    'Cuidado intermedio adultos',
    'Cuidado intensivo adultos',
    'Hospitalización parcial',
    'Internación parcial en hospital',
    'Atención institucional de paciente crónico',
    'Internación Hospitalaria e Internación Parcial para la atención al consumidor de Sustancias Psicoactivas'
  ]
}]
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default table values--------------------------------------------------*/
export const defaultStyles = 'px-8 flex items-center gap-2 hover:bg-accent/50 transition-all duration-200 relative group'
export const activeStyles = 'bg-white text-black shadow-sm after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary'
export const tableTranslations = {// to spanish
  and: 'y',
  edit: 'Editar',
  save: 'Guardar',
  search: 'Buscar',
  expand: 'Expandir',
  cancel: 'Cancelar',
  actions: 'Acciones',
  hideAll: 'Ocultar todo',
  showAll: 'Mostrar todo',
  groupedBy: 'Agrupado por ',
  expandAll: 'Expandir todo',
  clearFilter: 'Limpiar filtro',
  rowActions: 'Acciones de fila',
  clearSearch: 'Limpiar búsqueda',
  clearSort: 'Limpiar ordenamiento',
  toggleDensity: 'Alternar densidad',
  columnActions: 'Acciones de columna',
  groupByColumn: 'Agrupar por {column}',
  filterByColumn: 'Filtrar por {column}',
  hideColumn: 'Ocultar columna {column}',
  ungroupByColumn: 'Desagrupar por {column}',
  showHideFilters: 'Mostrar/Ocultar filtros',
  showHideColumns: 'Mostrar/Ocultar columnas',
  toggleSelectRow: 'Alternar selección de fila',
  toggleSelectAll: 'Alternar selección de todo',
  toggleFullScreen: 'Alternar pantalla completa',
  selectedCountOfRowCountRowsSelected: '{selectedCount} de {rowCount} fila(s) seleccionada(s)',
}
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------default styles values (pdf)--------------------------------------------------*/
export const styles = StyleSheet.create({ //styles basics
  page: {
    padding: '15pt',
    fontSize: '9pt',
    fontFamily: 'Helvetica',
  },
  container: {
    marginTop: '10pt',
    border: '2pt solid black',
  },
  // Header section
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  logoContainer: {
    width: '120pt',
  },
  logo: {
    width: '120pt',
    height: '50pt',
  },
  titleContainer: {
    flex: 1
  },
  mainTitle: {
    padding: '8pt',
    backgroundColor: '#000000',
  },
  titleText: {
    fontSize: '9pt',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  // Format info section
  formatInfo: {
    padding: '2pt',
    flexDirection: 'row',
    borderTop: '1pt solid black',
    borderBottom: '1pt solid black',
    justifyContent: 'space-between',
  },
  formatText: {
    fontSize: '7pt',
  },
  // Client section
  sectionTitle: {
    padding: '0pt',
    marginBottom: '0pt',
    backgroundColor: '#000000',
  },
  sectionTitleText: {
    color: '#FFFFFF',
    fontSize: '8pt',
    fontFamily: 'Helvetica-Bold',
  },
  infoRow: {
    minHeight: '12pt',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottom: '1pt solid black',
  },
  infoCol: {
    padding: '2pt',
    alignItems: 'center',
    flexDirection: 'row',
  },
  col2: { width: '50%' },
  col3: { width: '33.33%' },
  col4: { width: '25%' },
  label: {
    marginRight: '2pt',
    fontFamily: 'Helvetica-Bold',
  },
  // Equipment section
  equipmentContainer: {
    flexDirection: 'row'
  },
  equipmentInfo: {
    flex: 1
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
    flexWrap: 'wrap',
    padding: '1pt 0pt',
    flexDirection: 'row',
  },
  techItem: {
    width: '25%',
  },
  // Bio classification section
  tagContainer: {
    gap: '4pt',
    flexWrap: 'wrap',
    padding: '2pt 4pt',
    flexDirection: 'row',
  },
  tag: {
    fontSize: '9pt',
    padding: '2pt 4pt',
    borderRadius: '2pt',
    backgroundColor: '#e5e5e5',
  },
  classificationSection: {
    width: '50%',
    padding: '2pt 4pt',
    borderRight: '1pt solid black',
  },
  classificationRow: {
    flexDirection: 'row',
  },
  // Inspections section
  inspectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6pt',
  },
  inspectionText: {
    flex: 1,
    fontSize: '9pt',
    color: '#374151',
    fontFamily: 'Helvetica',
  },
  inspectionTag: {
    width: '25%',
    fontSize: '8pt',
    padding: '4pt 8pt',
    marginBottom: '4pt',
    borderRadius: '2pt',
    backgroundColor: '#e5e5e5',
    textAlign: 'left' as const,
  },
  checkmark: {
    width: '6pt',
    height: '12pt',
    marginRight: '2pt',
    transform: 'rotate(45deg)',
    borderRight: '2pt solid #059669',
    borderBottom: '2pt solid #059669',
    position: 'relative' as const,
  },
  // Characteristics section
  row: {
    gap: '4pt',
    flexDirection: 'row',
  },
  listItem: {
    gap: '2pt',
    flexDirection: 'row',
  },
  // ServiceProvider section
  providerContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  providerInfo: {
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: '15pt',
    alignItems: 'center',
    paddingRight: '20pt',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  infoGroup: {
    width: '100%',
    marginBottom: '5pt',
    alignItems: 'center',
    flexDirection: 'row',
  },
  providerLabel: {
    width: '140pt',
    fontSize: '10pt',
    fontFamily: 'Helvetica-Bold',
  },
  providerValue: {
    flex: 1,
    fontSize: '10pt',
  },
  providerLogo: {
    right: '0pt',
    width: '25%',
    height: '90pt',
    objectFit: 'contain',
    alignSelf: 'flex-end',
  },
  /*---------------------------------------------------------------------------------------------------------*/

  /*--------------------------------------------------maintenance--------------------------------------------------*/
  /* Maintenance - PDF */
  // Observations section
  sectionHeader: {
    gap: '6pt',
    padding: '5pt',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#000000',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: '10pt',
    fontFamily: 'Helvetica-Bold',
  },
  contentContainer: {
    borderRadius: '4pt',
    backgroundColor: '#f8f8f8',
  },
  // Status section
  statusContainer: {
    borderRadius: '2pt',
    flexDirection: 'row',
    border: '1pt solid #e0e0e0',
    backgroundColor: '#ffffff',
  },
  statusColumn: {
    padding: '5pt',
  },
  statusContent: {
    gap: '5pt',
    flexDirection: 'column',
  },
  statusLabel: {
    fontSize: '9pt',
    color: '#374151',
    fontFamily: 'Helvetica-Bold',
  },
  statusBadge: {
    padding: '4pt 12pt',
    borderWidth: '1pt',
    alignItems: 'center',
    borderRadius: '6pt',
    borderColor: '#FDE047',
    justifyContent: 'center',
    backgroundColor: '#FEF9C3',
  },
  statusText: {
    color: '#854D0E',
    fontSize: '9pt',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
  },
  // Estilos para diferentes estados
  statusSuccess: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  statusSuccessText: {
    color: '#166534',
  },
  statusWarning: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE047',
  },
  statusWarningText: {
    color: '#854D0E',
  },
  statusError: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  statusErrorText: {
    color: '#991B1B',
  },
  statusDefault: {
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  statusDefaultText: {
    color: '#000000',
  },
  // Estilos para las observaciones
  observationsContainer: {
    padding: '5pt',
    borderRadius: '4pt',
    backgroundColor: '#ffffff',
    border: '1pt solid #e0e0e0',
  },
  observationsTitle: {
    fontSize: '9pt',
    color: '#374151',
    marginBottom: '8pt',
    fontFamily: 'Helvetica-Bold',
  },
  observationsText: {
    fontSize: '9pt',
    lineHeight: 1.5,
    color: '#4B5563',
  },
  // ProviderService section
  mainContainer: {
    gap: '5pt',
    padding: '5pt',
    marginTop: '5pt',
    borderRadius: '4pt',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f8f8',
  },
  providerInfoContainer: {
    width: '25%',
  },
  providerTitle: {
    fontSize: '10pt',
    marginBottom: '10pt',
    fontFamily: 'Helvetica-Bold',
  },
  providerDetails: {
    fontSize: '9pt',
    marginBottom: '4pt',
  },
  signatureBox: {
    width: '25%',
  },
  signatureLabel: {
    fontSize: '8pt',
    textAlign: 'center',
    marginBottom: '5pt',
  },
  signatureLine: {
    width: '100%',
    height: '70pt',
    borderRadius: '4pt',
    border: '1pt solid black',
    backgroundColor: '#ffffff',
  },
  providerSignature: {
    width: '100%',
    height: '70pt',
    objectFit: 'contain',
  },
  providerLogoContainer: {
    flex: 1,
    width: '25%',
    marginTop: '13pt',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerCompanyLogo: {
    width: '100%',
    height: '70pt',
    objectFit: 'contain',
  },
  // Estilos para la sección de no referencia
  noReferenceContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100px',
    padding: '10px',
  },
  noReferenceTitleContainer: {
    marginBottom: '5px',
    alignItems: 'center'
  },
  noReferenceTitle: {
    textAlign: 'center',
    color: '#d32f2f',
    fontWeight: 500,
    fontSize: 14,
  },
  noReferenceContent: {
    textAlign: 'center',
    padding: '5px',
  },
  noReferenceText: {
    color: '#616161',
    lineHeight: 1.5,
    fontSize: 10,
  },
  // Estilos para la seccion de imagenes
  imagesContainer: {
    width: "100%",
    marginBottom: 5,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  imageWrapper: {
    padding: 3,
    width: "33%",
    boxSizing: "border-box",
  },
  maintenanceImage: {
    width: "100%",
    borderRadius: 4,
    objectFit: "cover",
    border: "1px solid #ccc",
  },
  // Estilos para la tabla de historial de mantenimientos
  maintenanceHistoryHeader: {
    padding: 5,
    backgroundColor: '#000000',
  },
  maintenanceHistoryHeaderText: {
    fontSize: 9,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  maintenanceTableHeader: {
    minHeight: 20,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderBottom: '1pt solid black',
  },
  maintenanceTableHeaderCell: {
    padding: 4,
    borderRight: '1pt solid black',
  },
  maintenanceTableHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  maintenanceTableRow: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1pt solid #ccc',
  },
  maintenanceTableRowEven: {
    backgroundColor: '#f9f9f9',
  },
  maintenanceTableRowOdd: {
    backgroundColor: 'white',
  },
  maintenanceTableCell: {
    padding: 4,
    borderRight: '1pt solid #ccc',
  },
  maintenanceTableCellText: {
    fontSize: 8,
  },
  maintenanceTableCellObservations: {
    fontSize: 8,
    lineHeight: 1.3,
  },
  maintenanceTableCellStatus: {
    fontSize: 8,
  },
  maintenanceTableColumnDate: {
    width: '15%',
  },
  maintenanceTableColumnType: {
    width: '15%',
  },
  maintenanceTableColumnStatus: {
    width: '20%',
  },
  maintenanceTableColumnObservations: {
    borderRight: 'none',
    width: '50%',
  }
})

export const attendanceStyles = StyleSheet.create({ //to attendance PDF
  tableContainer: {
    marginTop: '10pt',
    border: '1pt solid black',
  },
  tableHeader: {
    backgroundColor: '#000000',
    padding: '5pt',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: '10pt',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  columnHeaders: {
    flexDirection: 'row',
    borderBottom: '1pt solid black',
  },
  columnHeader: {
    padding: '4pt',
    borderRight: '1pt solid black',
    backgroundColor: '#FFFFFF',
  },
  columnHeaderText: {
    fontSize: '8pt',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid black',
  },
  tableCell: {
    padding: '3pt 5pt',
    borderRight: '1pt solid black',
    justifyContent: 'center',
    fontSize: '8pt',
  },
  tableCellText: {
    textAlign: 'center',
    fontSize: '8pt',
  },

  // Estilos para el footer (sin cambios)
  footerContainer: {
    marginTop: '10pt',
    flexDirection: 'row',
    borderTop: '1pt solid black',
    justifyContent: 'space-between',
  },
  providerSection: {
    width: '30%',
    padding: '10pt',
  },
  signatureImage: {
    width: '120pt',
    height: '60pt',
    marginLeft: '15pt',
    marginBottom: '5pt',
  },
  signatureLine: {
    borderBottom: '1pt solid black',
    marginBottom: '5pt',
  },
  providerName: {
    fontSize: '9pt',
    fontFamily: 'Helvetica-Bold',
  },
  providerDetail: {
    fontSize: '8pt',
    marginTop: '2pt',
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    borderLeft: '1pt solid black',
  },
  companyLogo: {
    width: '200pt',
    height: '130pt',
    // objectFit: 'contain',
  }
})