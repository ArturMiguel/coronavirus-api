import { CollectionOf, Property } from "@tsed/schema";
import { StateModel } from "./StateModel";

export class CountryModel {
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

    @CollectionOf(StateModel)
    states: StateModel[];

    @Property()
    updatedAt: string;
}