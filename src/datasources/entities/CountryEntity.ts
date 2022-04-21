import { BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { StateEntity } from "./StateEntity";

@Entity({ name: "countries"})
export class CountryEntity {
    @PrimaryColumn({ type: "varchar", length: 20 })
    id: string;

    @Column({ type: "varchar", nullable: false, length: 255 })
    name: string;

    @Column({ type: "varchar", nullable: false, length: 30 })
    confirmed: string;

    @Column({ type: "varchar", nullable: false, length: 30 })
    death: string;

    @OneToMany(() => StateEntity, stateEntity => stateEntity.country)
    states: StateEntity[];

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;
}