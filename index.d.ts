
interface ISignOpts {
    expiresIn: string | number;
}

declare type sign = (payload: { [key: string]: any }, opts: ISignOpts) => string;

interface IWhiteList {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH'
}
interface IVerifyOpts {
    whiteList: string | IWhiteList[];
}

declare type verify = ({ whiteList }: IVerifyOpts) => void; 