import type { Events, HitOptions, InitParameters, People, UserParameters, VisitParameters } from './types.js';
export * from './types.js';
export declare class YandexMetrika implements Events {
    #private;
    static src(cdn?: boolean): "https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js" | "https://mc.yandex.ru/metrika/tag.js";
    constructor(id: string);
    get debug(): boolean;
    set debug(value: boolean);
    get verification(): string | null;
    set verification(value: string | null);
    get id(): string;
    init(options?: Partial<InitParameters>): void;
    addFileExtension(extensions?: string | string[]): void;
    extLink<CTX>(url: string, options?: Omit<HitOptions<CTX>, 'referer'>): void;
    file<CTX>(url: string, options?: HitOptions<CTX>): void;
    firstPartyParams(people: People): void;
    firstPartyParamsHashed(people: People): void;
    getClientID(cb: (clientID: number) => void): void;
    hit<CTX>(url?: string, options?: HitOptions<CTX>): void;
    notBounce<CTX>(options?: Pick<HitOptions<CTX>, 'ctx' | 'callback'>): void;
    params(params?: VisitParameters): void;
    reachGoal<CTX>(target: string, params: VisitParameters, callback?: (this: CTX) => void, ctx?: CTX): void;
    setUserID(userId: string): void;
    userParams(params?: UserParameters): void;
}
