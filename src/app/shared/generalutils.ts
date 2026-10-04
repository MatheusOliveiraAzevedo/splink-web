import { links } from './model/links';

export type WhatsAppPosition = 'hero' | 'plans' | 'floating' | 'footer' | 'about'
    | 'watch_tv' | 'wifi_6' | 'coverage_form';
export type ContactIntent = 'coverage' | 'expansion';
export interface WhatsAppContext {
    position: WhatsAppPosition;
    plan?: { id: string; name: string };
    intent?: ContactIntent;
}

type TrackingWindow = Window & { dataLayer?: unknown[] };
const positionLabels: Record<WhatsAppPosition, string> = {
    hero: 'banner principal', plans: 'seção de planos', floating: 'botão flutuante',
    footer: 'rodapé', about: 'quem somos', watch_tv: 'Watch TV', wifi_6: 'Wi-Fi 6',
    coverage_form: 'formulário de cobertura',
};

export class GeneralUtils {
    private pushEvent(event: string, fields: Record<string, string | null>): void {
        // Nunca incluir endereço, contato, mensagem ou URL do WhatsApp no dataLayer.
        // Uma falha no rastreamento não pode impedir o atendimento.
        try {
            const target = window as TrackingWindow;
            target.dataLayer = target.dataLayer || [];
            target.dataLayer.push({
                event, source: 'splink_site',
                position: null, plan_id: null, plan_name: null, intent: null, form_id: null,
                ...fields,
            });
        } catch { /* O contato continua disponível se as tags estiverem bloqueadas. */ }
    }

    registrarCliqueWhatsApp(context: WhatsAppContext): void {
        this.pushEvent('whatsapp_click', {
            position: context.position,
            plan_id: context.plan?.id ?? null,
            plan_name: context.plan?.name ?? null,
            intent: context.intent ?? 'coverage',
        });
    }

    registrarFormularioPreparado(intent: ContactIntent): void {
        this.pushEvent('form_prepared', { form_id: 'coverage', position: 'coverage_form', intent });
    }

    registrarFormularioEnviado(): void {
        // Chamado apenas após confirmação explícita de recebimento pela API.
        this.pushEvent('form_submitted', { form_id: 'work_with_us', position: 'work_with_us' });
    }

    criarLinkWhatsApp(context: WhatsAppContext, message?: string): string {
        const introduction = context.plan
            ? `Olá! Vim pelo site e tenho interesse no ${context.plan.name === 'Plano Empresarial' ? 'plano empresarial' : `plano de ${context.plan.name}`}. Quero consultar a cobertura.`
            : context.position === 'watch_tv' || context.position === 'wifi_6'
                ? `Olá! Vim pelo site e quero conhecer os planos com ${positionLabels[context.position]}. Quero consultar a cobertura.`
                : 'Olá! Vim pelo site e quero consultar a cobertura e conhecer os planos.';
        const text = `${message ?? introduction}\n\nOrigem no site: ${positionLabels[context.position]}.`;
        return `${links.whatsappBase}${encodeURIComponent(text)}`;
    }

    abrirWhatsApp(context: WhatsAppContext, message?: string): string {
        const url = this.criarLinkWhatsApp(context, message);
        this.registrarCliqueWhatsApp(context);
        window.open(url, '_blank', 'noopener,noreferrer');
        return url;
    }
}
