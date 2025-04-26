import DocumentPreview from "@/components/common/fields/DocumentPreview"
import { ThemeContextProps } from "@/interfaces/context.interface"
import CardIterable from "@/components/common/fields/CardIterable"
import DocumentField from "@/components/common/fields/Document"
import HeaderCustom from "#/common/elements/HeaderCustom"
import AreaField from "#/common/fields/Area"
import { cn } from "@/lib/utils"

interface CharacteristicsProps extends ThemeContextProps { id: boolean }

const CharacteristicsSection = ({ id, theme }: CharacteristicsProps) => (
  <div className="space-y-6">
    <HeaderCustom
      theme={theme}
      to="component"
      iconSpan="warn"
      title="Características"
      span="Campos opcionales"
      className="text-2xl font-light"
    />

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <AreaField
        theme={theme}
        name="characteristics"
        label="Características"
        placeholder="Ingrese las características del equipo"
      />
      <AreaField
        theme={theme}
        name="recommendationsManufacturer"
        label="Recomendaciones del Fabricante"
        placeholder="Ingrese las recomendaciones del fabricante"
      />
    </div>

    <div className="md:col-span-5 space-y-2">
      <div className={cn(!id ? 'hidden' : 'block')}>
        <DocumentPreview
          theme={theme}
          name="annexesPreview"
          label="Documentos anexos existentes"
        />
      </div>
      <CardIterable
        limit={3}
        theme={theme}
        name="newAnnexes"
        titleButton={cn(!id ? 'Anexar documento' : 'Añadir nuevo documento')}
        fields={fields.map(field => ({ name: field.name, component: <DocumentField {...field} theme={theme} /> }))}
      />
    </div>
  </div>
)

export default CharacteristicsSection
/*---------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------tools--------------------------------------------------*/
const fields = [{ name: "newAnnexes.file", label: "Documentos del equipo" }]