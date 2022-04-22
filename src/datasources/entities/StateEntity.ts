import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CountryEntity } from "./CountryEntity";

@Entity({ name: "states" })
export class StateEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", nullable: false, length: 20, unique: true })
    googleId: string;

    @Column({ type: "varchar", nullable: false, length: 255 })
    name: string;

    @Column({ type: "varchar", nullable: false, length: 30 })
    confirmed: string;

    @Column({ type: "varchar", nullable: false, length: 30 })
    death: string;

    @ManyToOne(() => CountryEntity, countryEntity => countryEntity.states, { onDelete: "CASCADE" })
    @JoinColumn({ name: "countryId" })
    country: CountryEntity;

    @Column()
    countryId: string;

    @CreateDateColumn({ type: "timestamptz", select: false })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;
}