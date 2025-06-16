const messageTemplates = {
  rental_confirmation: (businessName: string, equipmentName: string, deliveryDate: string) =>
    `🏗️ ${businessName}: Your rental of ${equipmentName} is confirmed for ${deliveryDate}. We'll send delivery updates soon!`,
  
  delivery_reminder: (businessName: string, equipmentName: string, timeWindow: string) =>
    `🚚 ${businessName}: Your ${equipmentName} will be delivered today between ${timeWindow}. Please ensure someone is available on-site.`,
  
  pickup_reminder: (businessName: string, equipmentName: string, pickupDate: string) =>
    `📦 ${businessName}: Pickup scheduled for ${equipmentName} on ${pickupDate}. Please have equipment ready and accessible.`,
  
  payment_due: (businessName: string, amount: string, dueDate: string) =>
    `💳 ${businessName}: Payment of ${amount} is due by ${dueDate}. Pay online at [link] or call us.`,
}

export function getTemplateMessage(
  type: keyof typeof messageTemplates,
  businessName: string,
  ...args: string[]
): string {
  const template = messageTemplates[type]
  if (!template) return ''
  
  try {
    // Use apply to safely spread arguments
    return template.apply(null, [businessName, ...args] as any)
  } catch (error) {
    console.error('Error generating SMS template:', error)
    return ''
  }
}

export type SMSTemplateType = keyof typeof messageTemplates