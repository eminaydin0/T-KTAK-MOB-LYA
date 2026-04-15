import { useRef } from 'react'
import { Button } from './ui/Button'
import { Field, inputClass } from './ui/Field'
import { ImageThumb } from '../../shared/components/ImageThumb'

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

type Props = {
  label?: string
  value: string
  onChange: (url: string) => void
  inputId: string
  fileInputId: string
}

/** Kategori kapak görseli: URL veya dosya (data URL) */
export function CategoryImageField({ label = 'Kapak görseli', value, onChange, inputId, fileInputId }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-3">
      <Field
        label={label}
        htmlFor={inputId}
        hint="Vitrin kartları ve üst menüde kullanılır. HTTPS adresi yapıştırabilir veya dosya yükleyebilirsiniz."
      >
        <input
          id={inputId}
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <input
          id={fileInputId}
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={async (e) => {
            const f = e.target.files?.[0]
            e.target.value = ''
            if (!f) return
            try {
              const dataUrl = await readFileAsDataUrl(f)
              onChange(dataUrl)
            } catch {
              /* ignore */
            }
          }}
        />
        <Button type="button" variant="secondary" className="!text-xs" onClick={() => fileRef.current?.click()}>
          Dosya seç
        </Button>
        {value.trim() ? (
          <Button type="button" variant="ghost" className="!text-xs text-stone-500" onClick={() => onChange('')}>
            Görseli kaldır
          </Button>
        ) : null}
      </div>
      {value.trim() ? (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
          <ImageThumb
            src={value.trim()}
            alt=""
            className="h-36 w-full max-w-md object-cover"
            emptyClassName="flex h-36 max-w-md items-center justify-center text-xs text-stone-400"
          />
        </div>
      ) : null}
    </div>
  )
}
