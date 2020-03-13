
interface IList {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | '*'
}

interface IVerifyOpts {
    whiteList?: string | IList[];
    blackList?: IList[];
}

declare namespace jwt {
    function sign(payload: { [key: string]: any }, opts?: { expiresIn?: string | number }): string;
    function verify({ whiteList, blackList }: IVerifyOpts): () => any;
}

declare global {
    namespace Express {
        interface Request {
            jwt: Record<string, any>;
        }
    }
}

export default jwt