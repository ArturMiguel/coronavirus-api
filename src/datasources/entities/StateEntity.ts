import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { CountryEntity } from "./CountryEntity";

@Entity({ name: "states" })
export class StateEntity {
    @PrimaryColumn({ type: "varchar", length: 20 })
    id: string;

    @Column({ type: "varchar", nullable: false, length: 255 })
    name: string;

    @Column({ type: "varchar", nullable: false, length: 30 })
    confirmed: string;

    @Column({ type: "varchar", nullable: false, length: 30 })
    death: string;

    @ManyToOne(() => CountryEntity, countryEntity => countryEntity.states, { onDelete: "CASCADE" })
    @JoinColumn({ name: "country_id" })
    country: CountryEntity;

    @Column()
    country_id: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;
}