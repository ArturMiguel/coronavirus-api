import { Property } from "@tsed/schema";

export class StateModel {
    @Property()
    id: string;

    @Property()
    googleId: string;

    @Property()
    name: string;

    @Property()
    confirmed: string;

    @Property()
    death: string;

    @Property()
    countryId: string;

    @Property()
    updatedAt: Date;
}