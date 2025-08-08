import type { WhatsAppMessage, WhatsAppMessageStatus } from "./whatsappTypes.ts";
import { readFile,readdir } from 'node:fs/promises';

import {createManyMessages, updateManyMessages} from "./dbConnection.ts";

// TODO: Check if it is possible to load script into mongosh without using node to connect and update

async function parseWhatsAppMessage(){
    const arrayOfFiles = await parseJSONFromFiles();
    const extractedMessages: WhatsAppMessage[] = [];
    const extractedStatues: WhatsAppMessageStatus[] = [];
    arrayOfFiles.forEach((file)=> {
        const hasMessage = 'messages' in (file.metaData.entry[0].changes[0].value)
        if(hasMessage){
            const extractionPointer = file.metaData.entry[0].changes[0].value
            //  Validators but i am skipping them since all are type text        
            extractedMessages.push(messageToPush(extractionPointer))
        }
        const hasStatus = 'statuses' in (file.metaData.entry[0].changes[0].value)
        if(hasStatus){
            const extractionPointer = file.metaData.entry[0].changes[0].value
            const {id, status} = extractionPointer.statuses[0]
            extractedStatues.push({id, status})
        }
    })
    // TODO: Error Handling if msg present is there but make it more refined - Check if present before pushing data
    await createManyMessages(extractedMessages)
    await updateManyMessages(extractedStatues)
    // TODO CleanUp payloadFolder
}

function messageToPush(extractionPointer: any){
    let {type, ...messageExtracted} = extractionPointer.messages[0]
    const {text:{body:messageText}} = messageExtracted
    const id = extractionPointer.contacts[0].wa_id
    const name = extractionPointer.contacts[0].profile.name
    // ToDo Rethink the messages required _id shouldnt be required once inserted if status is modified in memory i wont need to update also
    const newMessage:WhatsAppMessage = {
        _id: messageExtracted.id,
        name,
        wa_id: id,
        from: messageExtracted.from,
        text:messageText,
        timestamp: new Date(messageExtracted.timestamp * 1000),
        direction: id === messageExtracted.from ? 'incoming' : 'outgoing',
        status:'TBD'
    }
    return newMessage
    
}

async function parseJSONFromFiles(): Promise<any[]> {
    const path = './payloadfolder';
    const filePath = new URL(path, import.meta.url);
// Fix Types for JSON
    let jsonFileContents: any[] = [];
    try {
        const files = await readdir(filePath);
        const individualFiles = files.map((file) => {
            const fileUrl = `${filePath}/${file}`
            return new URL(fileUrl);
        });
        
        const fileContents = await Promise.all(individualFiles.map(file=> readFile(file, {encoding:'utf-8'})));
        jsonFileContents = fileContents.map(fileContent=> JSON.parse(fileContent));
    } catch (err) {
        console.error(err);
    } 
    return jsonFileContents;
    
}

parseWhatsAppMessage();

            