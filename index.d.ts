
interface ISignOpts {
    expiresIn: string | number;
}

declare type sign = (payload: { [key: string]: any }, opts: ISignOpts) => string;

interface IList {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | '*'
}
interface IVerifyOpts {
    whiteList: string | IList[];
    blackList: IList[];
}

declare type verify = (opts: IVerifyOpts) => void; 