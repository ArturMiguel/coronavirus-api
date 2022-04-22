import { IState } from "./IState";

export interface ICountry {
    id?: string;
    googleId: string;
    name: string;
    confirmed: string;
    death: string;
    states?: IState[];
}