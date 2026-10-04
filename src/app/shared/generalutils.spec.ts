import { GeneralUtils } from './generalutils';

describe('WhatsApp and tracking', () => {
  const utils = new GeneralUtils();
  const target = window as Window & { dataLayer?: any[] };
  let previous: any[] | undefined;

  beforeEach(() => { previous = target.dataLayer; target.dataLayer = []; });
  afterEach(() => { target.dataLayer = previous; });

  it('opens the selected plan and identifies its position with one click event', () => {
    const open = spyOn(window, 'open');
    const url = utils.abrirWhatsApp({ position: 'plans', plan: { id: '500', name: '500 Mega' } });
    const message = new URL(url).searchParams.get('text')!;
    expect(message).toContain('Olá! Vim pelo site e tenho interesse no plano de 500 Mega. Quero consultar a cobertura.');
    expect(message).toContain('Origem no site: seção de planos.');
    expect(open).toHaveBeenCalledOnceWith(url, '_blank', 'noopener,noreferrer');
    expect(target.dataLayer!.length).toBe(1);
    expect(target.dataLayer![0]).toEqual(jasmine.objectContaining({ event: 'whatsapp_click', plan_id: '500', position: 'plans' }));
    expect(target.dataLayer![0].value).toBeUndefined();
    expect(target.dataLayer![0].currency).toBeUndefined();
  });

  it('does not track merely constructing a URL', () => {
    utils.criarLinkWhatsApp({ position: 'hero' });
    expect(target.dataLayer).toEqual([]);
  });

  it('clears plan context on the next generic click', () => {
    utils.registrarCliqueWhatsApp({ position: 'plans', plan: { id: '500', name: '500 Mega' } });
    utils.registrarCliqueWhatsApp({ position: 'footer' });
    expect(target.dataLayer![1].plan_id).toBeNull();
    expect(target.dataLayer![1].plan_name).toBeNull();
  });

  it('keeps personal data out of analytics, even for coverage messages', () => {
    spyOn(window, 'open');
    utils.abrirWhatsApp({ position: 'coverage_form', intent: 'expansion' }, 'Contato: pessoa@example.com\nRua: endereço privado');
    const payload = JSON.stringify(target.dataLayer);
    expect(payload).not.toContain('pessoa@example.com');
    expect(payload).not.toContain('endereço privado');
    expect(payload).not.toContain('api.whatsapp.com');
  });

  it('separates message preparation from a confirmed recruitment form submission', () => {
    utils.registrarFormularioPreparado('expansion');
    utils.registrarFormularioEnviado();
    expect(target.dataLayer!.map(item => item.event)).toEqual(['form_prepared', 'form_submitted']);
    expect(target.dataLayer![1].form_id).toBe('work_with_us');
    expect(target.dataLayer![1].intent).toBeNull();
  });

  it('continues opening WhatsApp if analytics is blocked', () => {
    spyOn(target.dataLayer!, 'push').and.throwError('blocked');
    const open = spyOn(window, 'open');
    expect(() => utils.abrirWhatsApp({ position: 'floating' })).not.toThrow();
    expect(open).toHaveBeenCalledTimes(1);
  });
});
