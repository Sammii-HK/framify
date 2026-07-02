'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { palettes as galleryPalettes, templates as galleryTemplates } from '@/lib/template-data'
import TemplateMockup from '@/components/TemplateMockup'
import ImageUpload from '@/components/ImageUpload'

type PaletteKey = 'dark-celestial' | 'earthy-sage' | 'ethereal-light' | 'crystal-rose' | 'steel-blue' | 'warm-amber'

const palettes: Record<PaletteKey, { name: string; bg: string; accent: string; text: string; description: string }> = {
  'dark-celestial': { name: 'Dark Celestial', bg: '#0D0B1A', accent: '#C9A84C', text: '#F5F0E8', description: 'Deep indigo with golden starlight' },
  'earthy-sage': { name: 'Earthy Sage', bg: '#1A1F1A', accent: '#8B9A6B', text: '#E8E0D4', description: 'Forest greens with warm stone' },
  'ethereal-light': { name: 'Ethereal Light', bg: '#F8F6FC', accent: '#9B8EC4', text: '#2D2B3D', description: 'Soft lavender with gentle violet' },
  'crystal-rose': { name: 'Crystal Rose', bg: '#1A1517', accent: '#D4A0A0', text: '#F0E6E8', description: 'Warm blush with dusty rose' },
  'steel-blue': { name: 'Steel Blue', bg: '#0F1923', accent: '#4A90D9', text: '#E8EDF2', description: 'Dark steel with strong blue' },
  'warm-amber': { name: 'Warm Amber', bg: '#1F1710', accent: '#D4943A', text: '#F0E8DC', description: 'Dark brown with warm amber gold' },
}

interface Service {
  title: string
  description: string
  price: string
  duration: string
}

interface Testimonial {
  quote: string
  name: string
  role: string
}

interface Treatment {
  name: string
  price: string
  duration: string
}

interface TeamMember {
  name: string
  role: string
}

interface MenuItem {
  name: string
  description: string
  price: string
}

interface MenuCategory {
  name: string
  items: MenuItem[]
}

interface OpeningHour {
  day: string
  hours: string
}

interface Project {
  title: string
  description: string
  imageUrl?: string
}

interface ProcessStep {
  title: string
  description: string
}

interface SiteContent {
  templateType: string
  businessName: string
  tagline: string
  description: string
  palette: PaletteKey
  services: Service[]
  testimonials: Testimonial[]
  contact: {
    email: string
    phone: string
    location: string
  }
  social: {
    instagram: string
    facebook: string
    twitter: string
  }
  images?: { hero?: string; gallery: { url: string; alt: string }[] }
  // Template-specific optional fields
  coverageArea?: string
  accreditations?: string[]
  emergencyAvailable?: boolean
  treatments?: Treatment[]
  teamMembers?: TeamMember[]
  bookingUrl?: string
  menuCategories?: MenuCategory[]
  openingHours?: OpeningHour[]
  cuisineType?: string
  projects?: Project[]
  specialisms?: string[]
  processSteps?: ProcessStep[]
}

const templateTypes = [
  { id: 'standard', name: 'Standard', description: 'Works for any business' },
  { id: 'trades', name: 'Trades & Services', description: 'Plumbers, builders, electricians' },
  { id: 'salon', name: 'Hair & Beauty', description: 'Salons, spas, beauty studios' },
  { id: 'restaurant', name: 'Food & Drink', description: 'Restaurants, cafes, takeaways' },
  { id: 'portfolio', name: 'Portfolio', description: 'Photographers, designers, artists' },
  { id: 'consultant', name: 'Professional', description: 'Consultants, coaches, freelancers' },
]

// Map generate page template IDs to gallery template types for previews
const templateToGalleryType: Record<string, string> = {
  standard: 'standard',
  trades: 'trades',
  salon: 'hair-beauty',
  restaurant: 'food-drink',
  portfolio: 'portfolio',
  consultant: 'professional',
}

const defaultGalleryPalette = galleryPalettes[0] // dark-celestial

function TemplateIcon({ id, className }: { id: string; className?: string }) {
  const cls = className || 'w-8 h-8'
  switch (id) {
    case 'standard':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    case 'trades':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    case 'salon':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <path d="M8.12 8.12L12 12" />
          <path d="M20 4L8.12 15.88" />
          <circle cx="6" cy="18" r="3" />
          <path d="M14.8 14.8L20 20" />
        </svg>
      )
    case 'restaurant':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      )
    case 'portfolio':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      )
    case 'consultant':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    default:
      return null
  }
}

const defaultDays: OpeningHour[] = [
  { day: 'Monday', hours: '' },
  { day: 'Tuesday', hours: '' },
  { day: 'Wednesday', hours: '' },
  { day: 'Thursday', hours: '' },
  { day: 'Friday', hours: '' },
  { day: 'Saturday', hours: '' },
  { day: 'Sunday', hours: '' },
]

const defaultContent: SiteContent = {
  templateType: '',
  businessName: '',
  tagline: '',
  description: '',
  palette: 'dark-celestial',
  services: [
    { title: '', description: '', price: '', duration: '' },
    { title: '', description: '', price: '', duration: '' },
    { title: '', description: '', price: '', duration: '' },
  ],
  testimonials: [
    { quote: '', name: '', role: '' },
    { quote: '', name: '', role: '' },
    { quote: '', name: '', role: '' },
  ],
  contact: { email: '', phone: '', location: '' },
  social: { instagram: '', facebook: '', twitter: '' },
  images: { gallery: [] },
}

function getSteps(templateType: string): string[] {
  const base = ['Template', 'Business', 'Style']
  const templateStep = templateType === 'trades' ? 'Trade Details'
    : templateType === 'salon' ? 'Salon Details'
    : templateType === 'restaurant' ? 'Menu & Hours'
    : templateType === 'portfolio' ? 'Projects'
    : templateType === 'consultant' ? 'Expertise'
    : 'Services'
  return [...base, templateStep, 'Testimonials', 'Contact', 'Preview']
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center"><div className="w-10 h-10 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <GeneratePageInner />
    </Suspense>
  )
}

function GeneratePageInner() {
  const searchParams = useSearchParams()
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [step, setStep] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [publishError, setPublishError] = useState('')
  const [needsSubscription, setNeedsSubscription] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [subdomain, setSubdomain] = useState('')
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null)
  const [newAccreditation, setNewAccreditation] = useState('')
  const [newSpecialism, setNewSpecialism] = useState('')

  // Load site data when editing an existing site, or restore a draft after login redirect
  useEffect(() => {
    const editId = searchParams.get('edit')
    const templateParam = searchParams.get('template')

    if (editId) {
      try {
        const raw = localStorage.getItem('craftmypage_edit_site')
        if (raw) {
          const site = JSON.parse(raw)
          if (site.id === editId) {
            setContent(site.content)
            setSubdomain(site.subdomain || '')
            setEditingSiteId(site.id)
            localStorage.removeItem('craftmypage_edit_site')
          }
        }
      } catch {
        // ignore malformed data
      }
      return
    }

    // Restore draft saved before auth or checkout redirect
    try {
      const draftRaw = localStorage.getItem('craftmypage_draft')
      if (draftRaw) {
        const draft = JSON.parse(draftRaw)
        if (draft.content) {
          setContent(draft.content)
          if (draft.subdomain) setSubdomain(draft.subdomain)
          if (draft.step) setStep(draft.step)
          // Auto-publish after returning from successful subscription checkout
          if (searchParams.get('subscribed') === 'true') {
            localStorage.removeItem('craftmypage_draft')
            // Delay slightly to allow state to settle
            setTimeout(() => {
              const publishBtn = document.querySelector('[data-publish-btn]') as HTMLButtonElement
              if (publishBtn) publishBtn.click()
            }, 500)
          } else {
            localStorage.removeItem('craftmypage_draft')
          }
          return
        }
      }
    } catch {
      // ignore
    }

    // Handle ?template= from gallery page
    if (templateParam) {
      const galleryToGenerate: Record<string, string> = {
        standard: 'standard',
        trades: 'trades',
        'hair-beauty': 'salon',
        'food-drink': 'restaurant',
        portfolio: 'portfolio',
        professional: 'consultant',
      }
      const genType = galleryToGenerate[templateParam] || templateParam
      if (templateTypes.some(t => t.id === genType)) {
        selectTemplate(genType)
        setStep(1)
      }
    }
  }, [searchParams])

  const steps = getSteps(content.templateType)
  const lastStep = steps.length - 1

  function updateService(index: number, field: keyof Service, value: string) {
    const updated = [...content.services]
    updated[index] = { ...updated[index], [field]: value }
    setContent({ ...content, services: updated })
  }

  function updateTestimonial(index: number, field: keyof Testimonial, value: string) {
    const updated = [...content.testimonials]
    updated[index] = { ...updated[index], [field]: value }
    setContent({ ...content, testimonials: updated })
  }

  function updateTreatment(index: number, field: keyof Treatment, value: string) {
    const treatments = [...(content.treatments || [])]
    treatments[index] = { ...treatments[index], [field]: value }
    setContent({ ...content, treatments })
  }

  function addTreatment() {
    setContent({ ...content, treatments: [...(content.treatments || []), { name: '', price: '', duration: '' }] })
  }

  function removeTreatment(index: number) {
    const treatments = [...(content.treatments || [])]
    treatments.splice(index, 1)
    setContent({ ...content, treatments })
  }

  function updateTeamMember(index: number, field: keyof TeamMember, value: string) {
    const teamMembers = [...(content.teamMembers || [])]
    teamMembers[index] = { ...teamMembers[index], [field]: value }
    setContent({ ...content, teamMembers })
  }

  function addTeamMember() {
    setContent({ ...content, teamMembers: [...(content.teamMembers || []), { name: '', role: '' }] })
  }

  function removeTeamMember(index: number) {
    const teamMembers = [...(content.teamMembers || [])]
    teamMembers.splice(index, 1)
    setContent({ ...content, teamMembers })
  }

  function updateMenuCategory(catIndex: number, field: 'name', value: string) {
    const cats = [...(content.menuCategories || [])]
    cats[catIndex] = { ...cats[catIndex], [field]: value }
    setContent({ ...content, menuCategories: cats })
  }

  function updateMenuItem(catIndex: number, itemIndex: number, field: keyof MenuItem, value: string) {
    const cats = [...(content.menuCategories || [])]
    const items = [...cats[catIndex].items]
    items[itemIndex] = { ...items[itemIndex], [field]: value }
    cats[catIndex] = { ...cats[catIndex], items }
    setContent({ ...content, menuCategories: cats })
  }

  function addMenuCategory() {
    setContent({
      ...content,
      menuCategories: [...(content.menuCategories || []), { name: '', items: [{ name: '', description: '', price: '' }] }],
    })
  }

  function removeMenuCategory(index: number) {
    const cats = [...(content.menuCategories || [])]
    cats.splice(index, 1)
    setContent({ ...content, menuCategories: cats })
  }

  function addMenuItem(catIndex: number) {
    const cats = [...(content.menuCategories || [])]
    cats[catIndex] = { ...cats[catIndex], items: [...cats[catIndex].items, { name: '', description: '', price: '' }] }
    setContent({ ...content, menuCategories: cats })
  }

  function removeMenuItem(catIndex: number, itemIndex: number) {
    const cats = [...(content.menuCategories || [])]
    const items = [...cats[catIndex].items]
    items.splice(itemIndex, 1)
    cats[catIndex] = { ...cats[catIndex], items }
    setContent({ ...content, menuCategories: cats })
  }

  function updateOpeningHour(index: number, hours: string) {
    const oh = [...(content.openingHours || defaultDays)]
    oh[index] = { ...oh[index], hours }
    setContent({ ...content, openingHours: oh })
  }

  function updateProject(index: number, field: keyof Project, value: string) {
    const projects = [...(content.projects || [])]
    projects[index] = { ...projects[index], [field]: value }
    setContent({ ...content, projects })
  }

  function addProject() {
    setContent({ ...content, projects: [...(content.projects || []), { title: '', description: '', imageUrl: '' }] })
  }

  function removeProject(index: number) {
    const projects = [...(content.projects || [])]
    projects.splice(index, 1)
    setContent({ ...content, projects })
  }

  function updateProcessStep(index: number, field: keyof ProcessStep, value: string) {
    const processSteps = [...(content.processSteps || [])]
    processSteps[index] = { ...processSteps[index], [field]: value }
    setContent({ ...content, processSteps })
  }

  function addProcessStep() {
    setContent({ ...content, processSteps: [...(content.processSteps || []), { title: '', description: '' }] })
  }

  function removeProcessStep(index: number) {
    const processSteps = [...(content.processSteps || [])]
    processSteps.splice(index, 1)
    setContent({ ...content, processSteps })
  }

  function addAccreditation() {
    const val = newAccreditation.trim()
    if (!val) return
    setContent({ ...content, accreditations: [...(content.accreditations || []), val] })
    setNewAccreditation('')
  }

  function removeAccreditation(index: number) {
    const acc = [...(content.accreditations || [])]
    acc.splice(index, 1)
    setContent({ ...content, accreditations: acc })
  }

  function addSpecialism() {
    const val = newSpecialism.trim()
    if (!val) return
    setContent({ ...content, specialisms: [...(content.specialisms || []), val] })
    setNewSpecialism('')
  }

  function removeSpecialism(index: number) {
    const specs = [...(content.specialisms || [])]
    specs.splice(index, 1)
    setContent({ ...content, specialisms: specs })
  }

  function selectTemplate(id: string) {
    const updates: Partial<SiteContent> = { templateType: id }
    // Initialise template-specific defaults
    if (id === 'trades') {
      updates.coverageArea = content.coverageArea || ''
      updates.accreditations = content.accreditations || []
      updates.emergencyAvailable = content.emergencyAvailable ?? false
    } else if (id === 'salon') {
      updates.treatments = content.treatments || [{ name: '', price: '', duration: '' }]
      updates.teamMembers = content.teamMembers || [{ name: '', role: '' }]
      updates.bookingUrl = content.bookingUrl || ''
    } else if (id === 'restaurant') {
      updates.cuisineType = content.cuisineType || ''
      updates.menuCategories = content.menuCategories || [{ name: '', items: [{ name: '', description: '', price: '' }] }]
      updates.openingHours = content.openingHours || [...defaultDays]
    } else if (id === 'portfolio') {
      updates.projects = content.projects || [{ title: '', description: '', imageUrl: '' }]
    } else if (id === 'consultant') {
      updates.specialisms = content.specialisms || []
      updates.processSteps = content.processSteps || [{ title: '', description: '' }]
    }
    setContent({ ...content, ...updates })
  }

  async function handleGenerate() {
    setGenerating(true)
    try {
      const res = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
    } catch (err) {
      console.error('Generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  function handleDownload() {
    if (!previewUrl) return
    const a = document.createElement('a')
    a.href = previewUrl
    a.download = `${content.businessName.toLowerCase().replace(/\s+/g, '-') || 'my-site'}.html`
    a.click()
  }

  async function handlePublish() {
    const slug = subdomain || content.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!slug) return
    setPublishing(true)
    try {
      const res = await fetch('/api/publish-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, subdomain: slug }),
      })
      const data = await res.json()

      if (res.status === 401) {
        // Save draft so they don't lose work after login
        localStorage.setItem('craftmypage_draft', JSON.stringify({ content, subdomain: slug, step }))
        window.location.href = '/auth/login?returnTo=/generate'
        return
      }

      if (data.error === 'subscription_required' || data.error === 'subscription_inactive') {
        // Save draft so they don't lose work
        localStorage.setItem('craftmypage_draft', JSON.stringify({ content, subdomain: slug, step }))
        setPublishError(data.message || 'A subscription is required to publish.')
        setNeedsSubscription(true)
        return
      }

      if (data.url) {
        setPublishedUrl(data.url)
        localStorage.removeItem('craftmypage_draft')
      } else {
        console.error('Publish failed:', data.error)
        setPublishError(data.error || 'Failed to publish. Please try again.')
      }
    } catch (err) {
      console.error('Publish failed:', err)
      setPublishError('Something went wrong. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  async function handleCheckout(tier: 'starter' | 'pro', interval: 'monthly' | 'yearly') {
    const slug = subdomain || content.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (!slug) return
    setCheckingOut(true)
    try {
      localStorage.setItem('craftmypage_draft', JSON.stringify({ content, subdomain: slug, step }))
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, interval, subdomain: slug }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setPublishError(data.error || 'Failed to start checkout.')
      }
    } catch {
      setPublishError('Something went wrong. Please try again.')
    } finally {
      setCheckingOut(false)
    }
  }

  const inputClass = "w-full p-3 rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1"
  const addBtnClass = "text-sm text-brand-600 hover:text-brand-700 font-medium mt-2"
  const removeBtnClass = "text-sm text-red-500 hover:text-red-600"
  const tagClass = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-sm"

  // Map step index to content type
  // Steps: 0=Template, 1=Business, 2=Style, 3=Template-specific, 4=Testimonials, 5=Contact, 6=Preview
  const stepIndex = {
    template: 0,
    business: 1,
    style: 2,
    templateSpecific: 3,
    testimonials: 4,
    contact: 5,
    preview: 6,
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Build your website</h1>
        <p className="text-neutral-500 mb-8">Fill in your details and get a beautiful website in seconds.</p>

        {/* Step indicator */}
        <div className="flex gap-1 mb-8">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => i <= step && setStep(i)}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                i <= step ? 'bg-brand-500' : 'bg-neutral-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-neutral-500 mb-6">Step {step + 1}: {steps[step]}</p>

        {/* Step 0: Template picker */}
        {step === stepIndex.template && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600 mb-2">What type of business is this for?</p>
            <div className="grid grid-cols-2 gap-4">
              {templateTypes.map((t) => {
                const galleryType = templateToGalleryType[t.id]
                const galleryTemplate = galleryTemplates.find(gt => gt.type === galleryType)
                return (
                  <button
                    key={t.id}
                    onClick={() => selectTemplate(t.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      content.templateType === t.id
                        ? 'border-brand-500 ring-2 ring-brand-200'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {galleryTemplate && (
                      <div className="mb-3 pointer-events-none">
                        <TemplateMockup palette={defaultGalleryPalette} template={galleryTemplate} isDark={true} />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <TemplateIcon id={t.id} className="w-5 h-5" />
                      <p className="font-medium text-neutral-900">{t.name}</p>
                    </div>
                    <p className="text-sm text-neutral-500">{t.description}</p>
                  </button>
                )
              })}
            </div>
            <p className="text-center text-sm text-neutral-400 mt-2">
              <Link href="/templates" className="text-brand-600 hover:text-brand-700 font-medium">
                Browse all 21 templates
              </Link>
            </p>
          </div>
        )}

        {/* Step 1: Business basics */}
        {step === stepIndex.business && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Business name</label>
              <input
                className={inputClass}
                placeholder="Hartley Plumbing"
                value={content.businessName}
                onChange={e => setContent({ ...content, businessName: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input
                className={inputClass}
                placeholder="Quality work you can trust"
                value={content.tagline}
                onChange={e => setContent({ ...content, tagline: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>About your business</label>
              <textarea
                className={inputClass}
                rows={3}
                placeholder="A brief description of what you do and who you serve..."
                value={content.description}
                onChange={e => setContent({ ...content, description: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Your photos</label>
              {editingSiteId ? (
                <ImageUpload
                  siteId={editingSiteId}
                  maxImages={20}
                  onUpload={({ url, alt }) => setContent({
                    ...content,
                    images: content.images?.hero
                      ? { ...content.images, gallery: [...(content.images?.gallery || []), { url, alt }] }
                      : { ...content.images, hero: url, gallery: content.images?.gallery || [] },
                  })}
                  onDelete={(url) => setContent({
                    ...content,
                    images: {
                      hero: content.images?.hero === url ? undefined : content.images?.hero,
                      gallery: (content.images?.gallery || []).filter(g => g.url !== url),
                    },
                  })}
                  onAltChange={(url, alt) => setContent({
                    ...content,
                    images: {
                      ...content.images,
                      gallery: (content.images?.gallery || []).map(g => g.url === url ? { ...g, alt } : g),
                    },
                  })}
                />
              ) : (
                <p className="text-sm text-neutral-500 p-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50">
                  Publish your site first, then come back here to add your own photos — the first one becomes your hero background, up to 20 photos total, 5MB each.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Palette selection */}
        {step === stepIndex.style && (
          <div className="grid grid-cols-2 gap-4">
            {(Object.entries(palettes) as [PaletteKey, typeof palettes[PaletteKey]][]).map(([key, palette]) => (
              <button
                key={key}
                onClick={() => setContent({ ...content, palette: key })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  content.palette === key
                    ? 'border-brand-500 ring-2 ring-brand-200'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {/* Mini site mockup */}
                <div
                  className="w-full rounded-lg mb-3 overflow-hidden"
                  style={{ backgroundColor: palette.bg }}
                >
                  {/* Nav bar */}
                  <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: `1px solid ${palette.accent}25` }}>
                    <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: palette.accent }} />
                    <div className="flex gap-1">
                      <div className="w-5 h-1 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.3 }} />
                      <div className="w-5 h-1 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.3 }} />
                    </div>
                  </div>
                  {/* Hero */}
                  <div className="px-3 py-3">
                    <div className="w-3/4 h-1.5 rounded-full mb-1" style={{ backgroundColor: palette.text, opacity: 0.9 }} />
                    <div className="w-1/2 h-1.5 rounded-full mb-2" style={{ backgroundColor: palette.text, opacity: 0.4 }} />
                    <div className="w-12 h-4 rounded" style={{ backgroundColor: palette.accent }} />
                  </div>
                  {/* Cards */}
                  <div className="px-3 pb-2 grid grid-cols-3 gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="rounded p-1.5" style={{ backgroundColor: `${palette.text}10` }}>
                        <div className="w-full h-1 rounded-full mb-0.5" style={{ backgroundColor: palette.accent, opacity: 0.4 }} />
                        <div className="w-3/4 h-1 rounded-full" style={{ backgroundColor: palette.text, opacity: 0.2 }} />
                      </div>
                    ))}
                  </div>
                </div>
                <p className="font-medium text-neutral-900">{palette.name}</p>
                <p className="text-sm text-neutral-500">{palette.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Template-specific fields */}
        {step === stepIndex.templateSpecific && (
          <div className="space-y-6">
            <p className="text-sm text-neutral-400">These fields are optional. Skip this step if you do not have this information yet.</p>
            {/* Standard — Services (same as before) */}
            {content.templateType === 'standard' && (
              <>
                {content.services.map((service, i) => (
                  <div key={i} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3">
                    <p className="text-sm font-medium text-neutral-500">Service {i + 1}</p>
                    <input
                      className={inputClass}
                      placeholder="Emergency Repairs"
                      value={service.title}
                      onChange={e => updateService(i, 'title', e.target.value)}
                    />
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder="A brief description of this service..."
                      value={service.description}
                      onChange={e => updateService(i, 'description', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={inputClass}
                        placeholder="From £75"
                        value={service.price}
                        onChange={e => updateService(i, 'price', e.target.value)}
                      />
                      <input
                        className={inputClass}
                        placeholder="60 minutes"
                        value={service.duration}
                        onChange={e => updateService(i, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Trades */}
            {content.templateType === 'trades' && (
              <>
                <div>
                  <label className={labelClass}>Coverage area</label>
                  <input
                    className={inputClass}
                    placeholder="Greater London, Surrey, Kent"
                    value={content.coverageArea || ''}
                    onChange={e => setContent({ ...content, coverageArea: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelClass}>Accreditations</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(content.accreditations || []).map((acc, i) => (
                      <span key={i} className={tagClass}>
                        {acc}
                        <button onClick={() => removeAccreditation(i)} className="text-neutral-400 hover:text-red-500">&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className={inputClass}
                      placeholder="Gas Safe, NICEIC, NAPIT..."
                      value={newAccreditation}
                      onChange={e => setNewAccreditation(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAccreditation() } }}
                    />
                    <button
                      onClick={addAccreditation}
                      className="px-4 py-2 text-sm bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={content.emergencyAvailable ?? false}
                      onChange={e => setContent({ ...content, emergencyAvailable: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                  <span className="text-sm font-medium text-neutral-700">Emergency callout available</span>
                </div>

                <hr className="border-neutral-200" />
                <p className="text-sm font-medium text-neutral-700">Services</p>
                {content.services.map((service, i) => (
                  <div key={i} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3">
                    <p className="text-sm font-medium text-neutral-500">Service {i + 1}</p>
                    <input
                      className={inputClass}
                      placeholder="Boiler installation"
                      value={service.title}
                      onChange={e => updateService(i, 'title', e.target.value)}
                    />
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder="A brief description of this service..."
                      value={service.description}
                      onChange={e => updateService(i, 'description', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={inputClass}
                        placeholder="From £75"
                        value={service.price}
                        onChange={e => updateService(i, 'price', e.target.value)}
                      />
                      <input
                        className={inputClass}
                        placeholder="2 hours"
                        value={service.duration}
                        onChange={e => updateService(i, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Salon */}
            {content.templateType === 'salon' && (
              <>
                <div>
                  <label className={labelClass}>Booking URL (optional)</label>
                  <input
                    className={inputClass}
                    placeholder="https://booksy.com/your-salon"
                    value={content.bookingUrl || ''}
                    onChange={e => setContent({ ...content, bookingUrl: e.target.value })}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-3">Treatments</p>
                  {(content.treatments || []).map((treatment, i) => (
                    <div key={i} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3 mb-3">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-neutral-500">Treatment {i + 1}</p>
                        {(content.treatments || []).length > 1 && (
                          <button onClick={() => removeTreatment(i)} className={removeBtnClass}>Remove</button>
                        )}
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Cut and blow dry"
                        value={treatment.name}
                        onChange={e => updateTreatment(i, 'name', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          className={inputClass}
                          placeholder="£45"
                          value={treatment.price}
                          onChange={e => updateTreatment(i, 'price', e.target.value)}
                        />
                        <input
                          className={inputClass}
                          placeholder="45 minutes"
                          value={treatment.duration}
                          onChange={e => updateTreatment(i, 'duration', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button onClick={addTreatment} className={addBtnClass}>+ Add another treatment</button>
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-3">Team members</p>
                  {(content.teamMembers || []).map((member, i) => (
                    <div key={i} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3 mb-3">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-neutral-500">Team member {i + 1}</p>
                        {(content.teamMembers || []).length > 1 && (
                          <button onClick={() => removeTeamMember(i)} className={removeBtnClass}>Remove</button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          className={inputClass}
                          placeholder="Sarah"
                          value={member.name}
                          onChange={e => updateTeamMember(i, 'name', e.target.value)}
                        />
                        <input
                          className={inputClass}
                          placeholder="Senior stylist"
                          value={member.role}
                          onChange={e => updateTeamMember(i, 'role', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <button onClick={addTeamMember} className={addBtnClass}>+ Add another team member</button>
                </div>
              </>
            )}

            {/* Restaurant */}
            {content.templateType === 'restaurant' && (
              <>
                <div>
                  <label className={labelClass}>Cuisine type</label>
                  <input
                    className={inputClass}
                    placeholder="Italian, Indian, Modern British..."
                    value={content.cuisineType || ''}
                    onChange={e => setContent({ ...content, cuisineType: e.target.value })}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-3">Menu</p>
                  {(content.menuCategories || []).map((cat, ci) => (
                    <div key={ci} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <input
                          className={`${inputClass} font-medium`}
                          placeholder="Starters, Mains, Desserts..."
                          value={cat.name}
                          onChange={e => updateMenuCategory(ci, 'name', e.target.value)}
                        />
                        {(content.menuCategories || []).length > 1 && (
                          <button onClick={() => removeMenuCategory(ci)} className={`${removeBtnClass} ml-2 whitespace-nowrap`}>Remove category</button>
                        )}
                      </div>
                      {cat.items.map((item, ii) => (
                        <div key={ii} className="pl-3 border-l-2 border-neutral-100 space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-neutral-400">Item {ii + 1}</p>
                            {cat.items.length > 1 && (
                              <button onClick={() => removeMenuItem(ci, ii)} className={removeBtnClass}>Remove</button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              className={inputClass}
                              placeholder="Dish name"
                              value={item.name}
                              onChange={e => updateMenuItem(ci, ii, 'name', e.target.value)}
                            />
                            <input
                              className={inputClass}
                              placeholder="Description"
                              value={item.description}
                              onChange={e => updateMenuItem(ci, ii, 'description', e.target.value)}
                            />
                            <input
                              className={inputClass}
                              placeholder="£12.50"
                              value={item.price}
                              onChange={e => updateMenuItem(ci, ii, 'price', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addMenuItem(ci)} className={addBtnClass}>+ Add another item</button>
                    </div>
                  ))}
                  <button onClick={addMenuCategory} className={addBtnClass}>+ Add another category</button>
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-3">Opening hours</p>
                  <div className="space-y-2">
                    {(content.openingHours || defaultDays).map((oh, i) => (
                      <div key={oh.day} className="grid grid-cols-3 gap-3 items-center">
                        <span className="text-sm text-neutral-600">{oh.day}</span>
                        <input
                          className={`${inputClass} col-span-2`}
                          placeholder="9:00 - 22:00 or Closed"
                          value={oh.hours}
                          onChange={e => updateOpeningHour(i, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Portfolio */}
            {content.templateType === 'portfolio' && (
              <>
                <p className="text-sm font-medium text-neutral-700 mb-3">Projects</p>
                {(content.projects || []).map((project, i) => (
                  <div key={i} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3 mb-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-neutral-500">Project {i + 1}</p>
                      {(content.projects || []).length > 1 && (
                        <button onClick={() => removeProject(i)} className={removeBtnClass}>Remove</button>
                      )}
                    </div>
                    <input
                      className={inputClass}
                      placeholder="Project title"
                      value={project.title}
                      onChange={e => updateProject(i, 'title', e.target.value)}
                    />
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder="Brief description of the project..."
                      value={project.description}
                      onChange={e => updateProject(i, 'description', e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Image URL (optional)"
                      value={project.imageUrl || ''}
                      onChange={e => updateProject(i, 'imageUrl', e.target.value)}
                    />
                  </div>
                ))}
                <button onClick={addProject} className={addBtnClass}>+ Add another project</button>
              </>
            )}

            {/* Consultant */}
            {content.templateType === 'consultant' && (
              <>
                <div>
                  <label className={labelClass}>Specialisms</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(content.specialisms || []).map((spec, i) => (
                      <span key={i} className={tagClass}>
                        {spec}
                        <button onClick={() => removeSpecialism(i)} className="text-neutral-400 hover:text-red-500">&times;</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className={inputClass}
                      placeholder="Strategy, leadership, marketing..."
                      value={newSpecialism}
                      onChange={e => setNewSpecialism(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSpecialism() } }}
                    />
                    <button
                      onClick={addSpecialism}
                      className="px-4 py-2 text-sm bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-700 mb-3">Process steps</p>
                  {(content.processSteps || []).map((ps, i) => (
                    <div key={i} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3 mb-3">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-neutral-500">Step {i + 1}</p>
                        {(content.processSteps || []).length > 1 && (
                          <button onClick={() => removeProcessStep(i)} className={removeBtnClass}>Remove</button>
                        )}
                      </div>
                      <input
                        className={inputClass}
                        placeholder="Discovery call"
                        value={ps.title}
                        onChange={e => updateProcessStep(i, 'title', e.target.value)}
                      />
                      <textarea
                        className={inputClass}
                        rows={2}
                        placeholder="What happens in this step..."
                        value={ps.description}
                        onChange={e => updateProcessStep(i, 'description', e.target.value)}
                      />
                    </div>
                  ))}
                  <button onClick={addProcessStep} className={addBtnClass}>+ Add another step</button>
                </div>

                <hr className="border-neutral-200" />
                <p className="text-sm font-medium text-neutral-700">Services</p>
                {content.services.map((service, i) => (
                  <div key={i} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3">
                    <p className="text-sm font-medium text-neutral-500">Service {i + 1}</p>
                    <input
                      className={inputClass}
                      placeholder="1:1 coaching"
                      value={service.title}
                      onChange={e => updateService(i, 'title', e.target.value)}
                    />
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder="A brief description of this service..."
                      value={service.description}
                      onChange={e => updateService(i, 'description', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={inputClass}
                        placeholder="From £150"
                        value={service.price}
                        onChange={e => updateService(i, 'price', e.target.value)}
                      />
                      <input
                        className={inputClass}
                        placeholder="60 minutes"
                        value={service.duration}
                        onChange={e => updateService(i, 'duration', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Step 4: Testimonials */}
        {step === stepIndex.testimonials && (
          <div className="space-y-6">
            <p className="text-sm text-neutral-400">No testimonials yet? Skip this step — the section will not appear on your site.</p>
            {content.testimonials.map((testimonial, i) => (
              <div key={i} className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3">
                <p className="text-sm font-medium text-neutral-500">Testimonial {i + 1}</p>
                <textarea
                  className={inputClass}
                  rows={2}
                  placeholder="Brilliant service, would recommend to anyone..."
                  value={testimonial.quote}
                  onChange={e => updateTestimonial(i, 'quote', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className={inputClass}
                    placeholder="James T."
                    value={testimonial.name}
                    onChange={e => updateTestimonial(i, 'name', e.target.value)}
                  />
                  <input
                    className={inputClass}
                    placeholder="Homeowner"
                    value={testimonial.role}
                    onChange={e => updateTestimonial(i, 'role', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 5: Contact */}
        {step === stepIndex.contact && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Email</label>
              <input
                className={inputClass}
                type="email"
                placeholder="hello@your-business.com"
                value={content.contact.email}
                onChange={e => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                className={inputClass}
                placeholder="+44 123 456 789"
                value={content.contact.phone}
                onChange={e => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                className={inputClass}
                placeholder="London, UK"
                value={content.contact.location}
                onChange={e => setContent({ ...content, contact: { ...content.contact, location: e.target.value } })}
              />
            </div>
            <hr className="my-4 border-neutral-200" />
            <p className="text-sm font-medium text-neutral-700">Social links (optional)</p>
            <input
              className={inputClass}
              placeholder="Instagram URL"
              value={content.social.instagram}
              onChange={e => setContent({ ...content, social: { ...content.social, instagram: e.target.value } })}
            />
            <input
              className={inputClass}
              placeholder="Facebook URL"
              value={content.social.facebook}
              onChange={e => setContent({ ...content, social: { ...content.social, facebook: e.target.value } })}
            />
          </div>
        )}

        {/* Step 6: Preview & Download */}
        {step === stepIndex.preview && (
          <div className="space-y-6">
            {!previewUrl && !generating && (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">Ready to generate</h2>
                <p className="text-neutral-500 mb-6">
                  {content.businessName || 'Your site'} with {palettes[content.palette].name} palette
                </p>
                <button
                  onClick={handleGenerate}
                  className="px-8 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
                >
                  Generate my website
                </button>
              </div>
            )}

            {generating && (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-neutral-500">Generating your website...</p>
              </div>
            )}

            {previewUrl && (
              <div className="space-y-4">
                <iframe
                  src={previewUrl}
                  className="w-full h-[600px] rounded-xl border border-neutral-200"
                  title="Site preview"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
                  >
                    Download HTML
                  </button>
                  <button
                    onClick={() => { setPreviewUrl(null); handleGenerate() }}
                    className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-100"
                  >
                    Regenerate
                  </button>
                </div>

                {/* Publish section */}
                {!publishedUrl ? (
                  <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3">
                    <p className="text-sm font-medium text-neutral-700">Publish to the web</p>
                    <div className="flex gap-2 items-center">
                      <input
                        className={inputClass}
                        placeholder={content.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'my-site'}
                        value={subdomain}
                        onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      />
                      <span className="text-sm text-neutral-400 whitespace-nowrap">.craftmypage.com</span>
                    </div>
                    <button
                      data-publish-btn
                      onClick={handlePublish}
                      disabled={publishing}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      {publishing ? 'Publishing...' : 'Publish live'}
                    </button>
                    <p className="text-xs text-neutral-400 text-center">You can update your site content any time from your dashboard.</p>
                    {publishError && !needsSubscription && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-800">{publishError}</p>
                      </div>
                    )}
                    {needsSubscription && (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-4">
                        <p className="text-sm font-medium text-amber-800">Choose a plan to publish your site</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg border border-neutral-200 bg-white p-3 space-y-2">
                            <p className="text-sm font-semibold text-neutral-900">Starter</p>
                            <p className="text-xs text-neutral-500">Single-page site</p>
                            <p className="text-lg font-bold text-neutral-900">£9<span className="text-xs font-normal text-neutral-400">/mo</span></p>
                            <button
                              onClick={() => handleCheckout('starter', 'monthly')}
                              disabled={checkingOut}
                              className="w-full py-2 text-xs font-semibold rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                            >
                              {checkingOut ? 'Loading...' : 'Subscribe'}
                            </button>
                          </div>
                          <div className="rounded-lg border-2 border-brand-600 bg-white p-3 space-y-2">
                            <p className="text-sm font-semibold text-neutral-900">Pro</p>
                            <p className="text-xs text-neutral-500">Multi-page site</p>
                            <p className="text-lg font-bold text-neutral-900">£19<span className="text-xs font-normal text-neutral-400">/mo</span></p>
                            <button
                              onClick={() => handleCheckout('pro', 'monthly')}
                              disabled={checkingOut}
                              className="w-full py-2 text-xs font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
                            >
                              {checkingOut ? 'Loading...' : 'Subscribe'}
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-400 text-center">30-day money-back guarantee. Cancel any time.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Success banner */}
                    <div className="p-5 rounded-xl border border-green-200 bg-green-50 space-y-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-semibold text-green-800">Your site is live!</p>
                      </div>
                      <a
                        href={publishedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 underline text-sm break-all block"
                      >
                        {publishedUrl}
                      </a>
                    </div>

                    {/* Upsell cards */}
                    <div className="p-5 rounded-xl border border-neutral-200 bg-white space-y-4">
                      <p className="text-sm font-semibold text-neutral-900">Make it yours</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => window.location.href = '/dashboard'}
                          className="p-4 rounded-lg border border-neutral-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all text-left group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                            <span className="text-sm font-semibold text-neutral-900">Custom domain</span>
                          </div>
                          <p className="text-xs text-neutral-500">
                            Use yourbusiness.co.uk instead of a subdomain. From £10/yr.
                          </p>
                        </button>
                        <button
                          onClick={() => window.location.href = '/dashboard'}
                          className="p-4 rounded-lg border border-neutral-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all text-left group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                            <span className="text-sm font-semibold text-neutral-900">Remove branding</span>
                          </div>
                          <p className="text-xs text-neutral-500">
                            Remove the CraftMyPage footer for a clean, white-label look. £3/mo.
                          </p>
                        </button>
                      </div>
                      <a
                        href="/dashboard"
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                      >
                        Go to dashboard to manage your site
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-6 py-2 text-neutral-600 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            {(step === stepIndex.templateSpecific || step === stepIndex.testimonials) && step < lastStep && (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                Skip this step
              </button>
            )}
            {step < lastStep && (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 0 && !content.templateType}
                className="px-6 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
