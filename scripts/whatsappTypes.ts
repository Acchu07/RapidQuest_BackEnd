interface PayLoad {
  message:WhatsAppMessage;

  }

  

interface WhatsAppMessage{
  _id: string       // "wamid.xxx" - message.id
  wa_id: string     // "929967673820" - user ID 
  from: string      // "929967673820" - sender number
  text: string      // "Hi!"- body.text
  timestamp: Date // "1754401000" - convert or use created at
  direction: string // "incoming or outgoing" - derived //from === wa.id
  name:string //"Neha Joshi" 
  status: 'TBD' | 'sent' | 'delivered' | 'read'   // Initial value TBD
  // No To Assuming the business will only see from
}

interface WhatsAppMessageStatus{
  id:string;
  status: 'sent' | 'delivered' | 'read' 
}

  export type { WhatsAppMessage, WhatsAppMessageStatus }