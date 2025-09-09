import { conversions } from "./model/google-tags";


declare var gtag: Function;

export class GeneralUtils {

    registrarConversao( type: keyof typeof conversions, value: number = 1.0, currency: string = 'BRL') {
        const sendTo = conversions[type];

        if (typeof gtag === 'function') {
            gtag('event', 'conversion', {send_to: sendTo, value, currency});
        }
    }

}