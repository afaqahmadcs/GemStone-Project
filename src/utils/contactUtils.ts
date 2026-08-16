/**
 * Formats client verified numbers and constructs pre-filled inquiry text links for WhatsApp
 */
export function getWhatsAppInquiryLink(gemstoneName: string, carat: number, origin: string): string {
  // Client verified phone number: 03341020791. 
  // Pakistan country code is +92. Sourced format clean: 923341020791.
  const verifiedPhone = "923341020791";
  
  const text = `Hello Blue Sapphire Gem Stones, I would like to make a private inquiry regarding the acquisition of: ${carat} Carat ${gemstoneName} from ${origin}.`;
  
  return `https://wa.me/${verifiedPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * General WhatsApp consultation link
 */
export function getWhatsAppGeneralLink(): string {
  const verifiedPhone = "923341020791";
  const text = "Hello Blue Sapphire Gem Stones, I would like to enquire about your gemstone collection. Please share more details.";
  return `https://wa.me/${verifiedPhone}?text=${encodeURIComponent(text)}`;
}
