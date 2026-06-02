export type ContactLead = {
  id: string
  createdAt: string
  name: string
  email: string
  phone?: string
  message: string
  topic: 'quote' | 'appointment' | 'general'
  kvkkAccepted: true
}
