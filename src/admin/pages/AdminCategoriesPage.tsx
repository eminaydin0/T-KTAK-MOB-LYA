import { type FormEvent, useMemo, useState } from 'react'
import type { CatalogCategory, CategoryQuestion } from '../../core/catalog/types'
import { useCatalog, type CategoryQuestionDraft } from '../../core/context/CatalogContext'
import { ImageThumb } from '../../shared/components/ImageThumb'
import { CategoryImageField } from '../components/CategoryImageField'
import { Button } from '../components/ui/Button'
import { Field, inputClass } from '../components/ui/Field'
import { Modal } from '../components/ui/Modal'

function emptyDraftRow(): CategoryQuestionDraft {
  return { label: '', placeholder: '' }
}

export function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCatalog()

  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [createImageUrl, setCreateImageUrl] = useState('')
  const [questionDrafts, setQuestionDrafts] = useState<CategoryQuestionDraft[]>([emptyDraftRow()])

  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<CatalogCategory | null>(null)
  const [editName, setEditName] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editQuestions, setEditQuestions] = useState<CategoryQuestion[]>([])

  const closeCreate = () => {
    setCreateOpen(false)
    setName('')
    setCreateImageUrl('')
    setQuestionDrafts([emptyDraftRow()])
  }

  const openEdit = (c: CatalogCategory) => {
    setEditing(c)
    setEditName(c.name)
    setEditImageUrl(c.imageUrl ?? '')
    setEditQuestions(c.questions.map((q) => ({ ...q })))
    setEditOpen(true)
  }

  const closeEdit = () => {
    setEditOpen(false)
    setEditing(null)
    setEditName('')
    setEditImageUrl('')
    setEditQuestions([])
  }

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    const drafts = questionDrafts.filter((q) => q.label.trim())
    addCategory(name, drafts.length ? drafts : undefined, createImageUrl.trim() || undefined)
    closeCreate()
  }

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const trimmed = editName.trim()
    const questions = editQuestions
      .filter((q) => q.label.trim())
      .map((q) => ({
        id: q.id || `q_${editing.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        label: q.label.trim(),
        placeholder: q.placeholder?.trim() || undefined,
      }))
    updateCategory(editing.id, {
      name: trimmed || editing.name,
      questions,
      imageUrl: editImageUrl,
    })
    closeEdit()
  }

  const addQuestionRow = () => {
    setQuestionDrafts((rows) => [...rows, emptyDraftRow()])
  }

  const updateDraft = (index: number, patch: Partial<CategoryQuestionDraft>) => {
    setQuestionDrafts((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const removeDraft = (index: number) => {
    setQuestionDrafts((rows) => rows.filter((_, i) => i !== index))
  }

  const addEditQuestion = () => {
    if (!editing) return
    setEditQuestions((qs) => [
      ...qs,
      {
        id: `q_${editing.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        label: '',
        placeholder: undefined,
      },
    ])
  }

  const updateEditQuestion = (index: number, patch: Partial<CategoryQuestion>) => {
    setEditQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)))
  }

  const removeEditQuestion = (index: number) => {
    setEditQuestions((qs) => qs.filter((_, i) => i !== index))
  }

  const hint = useMemo(
    () =>
      'Her kategori icin urun formunda cikacak sorulari tanimlayin (orn. Sehpa: tabla olcusu, raf sayisi).',
    []
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">Kategoriler</h2>
          <p className="mt-1 text-sm text-stone-600">{hint}</p>
        </div>
        <Button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="shrink-0 shadow-md shadow-amber-500/10"
        >
          <span className="text-lg leading-none">+</span>
          Yeni kategori
        </Button>
      </div>

      <Modal
        open={createOpen}
        onClose={closeCreate}
        title="Yeni kategori"
        description="Kategori adı vitrinde kullanılır. Kapak görseli ana sayfa kartları ve üst menüde gösterilir."
        size="md"
      >
        <form className="space-y-6" onSubmit={handleCreate}>
          <Field label="Kategori adi" htmlFor="cat-name">
            <input
              id="cat-name"
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Orn: Sehpa"
              autoFocus
              required
            />
          </Field>

          <CategoryImageField
            value={createImageUrl}
            onChange={setCreateImageUrl}
            inputId="cat-cover-url"
            fileInputId="cat-cover-file"
          />

          <div className="space-y-3 rounded-xl border border-stone-200 bg-stone-50/80 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-stone-800">Urun formu sorulari</p>
              <Button type="button" variant="ghost" className="!py-1 !text-xs" onClick={addQuestionRow}>
                + Soru satiri
              </Button>
            </div>
            <p className="text-xs text-stone-500">
              Bos birakilan satirlar yok sayilir. Ornek: &quot;Ust tabla olculeri (cm)&quot;
            </p>
            <div className="space-y-3">
              {questionDrafts.map((row, i) => (
                <div
                  key={i}
                  className="grid gap-2 rounded-lg border border-stone-100 bg-white p-3 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <Field label="Soru metni" htmlFor={`cq-l-${i}`}>
                    <input
                      id={`cq-l-${i}`}
                      className={inputClass}
                      value={row.label}
                      onChange={(e) => updateDraft(i, { label: e.target.value })}
                      placeholder="Orn: Ayak malzemesi"
                    />
                  </Field>
                  <Field label="Ipuucu (istege bagli)" htmlFor={`cq-p-${i}`}>
                    <input
                      id={`cq-p-${i}`}
                      className={inputClass}
                      value={row.placeholder ?? ''}
                      onChange={(e) => updateDraft(i, { placeholder: e.target.value })}
                      placeholder="Placeholder"
                    />
                  </Field>
                  <div className="flex items-end sm:justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      className="!text-xs text-stone-500"
                      onClick={() => removeDraft(i)}
                      disabled={questionDrafts.length <= 1}
                    >
                      Kaldir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={closeCreate}>
              Vazgec
            </Button>
            <Button type="submit">Kaydet</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={editOpen}
        onClose={closeEdit}
        title={editing ? `Kategori: ${editing.name}` : 'Kategori'}
        description="Kapak görseli vitrinde kullanılır. Soru metinleri değişince mevcut ürün cevapları aynı alanda kalır (soru kimliği korunur)."
        size="md"
      >
        <form className="space-y-6" onSubmit={handleSaveEdit}>
          <Field label="Kategori adi" htmlFor="ecat-name">
            <input
              id="ecat-name"
              className={inputClass}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </Field>

          <CategoryImageField
            value={editImageUrl}
            onChange={setEditImageUrl}
            inputId="ecat-cover-url"
            fileInputId="ecat-cover-file"
          />

          <div className="space-y-3 rounded-xl border border-stone-200 bg-stone-50/80 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-stone-800">Sorular</p>
              <Button type="button" variant="ghost" className="!py-1 !text-xs" onClick={addEditQuestion}>
                + Soru ekle
              </Button>
            </div>
            <div className="space-y-3">
              {editQuestions.map((q, i) => (
                <div
                  key={q.id || i}
                  className="grid gap-2 rounded-lg border border-stone-100 bg-white p-3 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <Field label="Soru metni" htmlFor={`eq-l-${i}`}>
                    <input
                      id={`eq-l-${i}`}
                      className={inputClass}
                      value={q.label}
                      onChange={(e) => updateEditQuestion(i, { label: e.target.value })}
                    />
                  </Field>
                  <Field label="Ipuucu" htmlFor={`eq-p-${i}`}>
                    <input
                      id={`eq-p-${i}`}
                      className={inputClass}
                      value={q.placeholder ?? ''}
                      onChange={(e) => updateEditQuestion(i, { placeholder: e.target.value || undefined })}
                    />
                  </Field>
                  <div className="flex items-end sm:justify-end">
                    <Button type="button" variant="ghost" className="!text-xs text-stone-500" onClick={() => removeEditQuestion(i)}>
                      Sil
                    </Button>
                  </div>
                </div>
              ))}
              {editQuestions.length === 0 ? (
                <p className="text-sm text-stone-500">Henuz soru yok; urun formunda ek alan cikmaz.</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={closeEdit}>
              Vazgec
            </Button>
            <Button type="submit">Kaydet</Button>
          </div>
        </form>
      </Modal>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 bg-stone-50/80 px-4 py-3 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Liste</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="w-16 px-4 py-3 font-medium sm:px-6">Görsel</th>
                <th className="px-4 py-3 font-medium sm:px-6">Ad</th>
                <th className="px-4 py-3 font-medium sm:px-6">Soru</th>
                <th className="w-56 px-4 py-3 text-right font-medium sm:px-6">Islem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-14 text-center sm:px-6">
                    <p className="text-stone-500">Henuz kategori yok.</p>
                    <Button type="button" variant="ghost" className="mt-3" onClick={() => setCreateOpen(true)}>
                      Ilk kategoriyi ekle
                    </Button>
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="transition hover:bg-stone-50/80">
                    <td className="px-4 py-3 sm:px-6">
                      <div className="h-12 w-12 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                        <ImageThumb
                          src={c.imageUrl ?? ''}
                          alt=""
                          className="h-full w-full object-cover"
                          emptyClassName="flex h-full w-full items-center justify-center text-[10px] text-stone-400"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-stone-900 sm:px-6">{c.name}</td>
                    <td className="px-4 py-3.5 text-stone-600 sm:px-6">{c.questions?.length ?? 0}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right sm:px-6">
                      <Button
                        type="button"
                        variant="ghost"
                        className="!mr-1 !py-1.5 !text-xs text-amber-900"
                        onClick={() => openEdit(c)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        className="!py-1.5 !text-xs"
                        onClick={() => deleteCategory(c.id)}
                      >
                        Sil
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
