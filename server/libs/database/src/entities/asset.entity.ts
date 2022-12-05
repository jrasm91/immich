import { Column, Entity, Index, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ExifEntity } from './exif.entity';
import { SmartInfoEntity } from './smart-info.entity';
import { TagEntity } from './tag.entity';

@Entity('assets')
@Unique('UQ_userid_checksum', ['userId', 'checksum'])
export class AssetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  deviceAssetId!: string;

  @Column()
  userId!: string;

  @Column()
  deviceId!: string;

  @Column()
  type!: AssetType;

  @Column()
  originalPath!: string;

  @Column({ type: 'varchar', nullable: true })
  resizePath!: string | null;

  @Column({ type: 'varchar', nullable: true, default: '' })
  webpPath!: string | null;

  @Column({ type: 'varchar', nullable: true, default: '' })
  encodedVideoPath!: string;

  @Column({ type: 'timestamptz' })
  createdAt!: string;

  @Column({ type: 'timestamptz' })
  modifiedAt!: string;

  @Column({ type: 'boolean', default: false })
  isFavorite!: boolean;

  @Column({ type: 'varchar', nullable: true })
  mimeType!: string | null;

  @Column({ type: 'bytea', nullable: true, select: false })
  @Index({ where: `'checksum' IS NOT NULL` }) // avoid null index
  checksum?: Buffer | null; // sha1 checksum

  @Column({ type: 'varchar', nullable: true })
  duration!: string | null;

  @Column({ type: 'boolean', default: true })
  isVisible!: boolean;

  @Column({ type: 'uuid', nullable: true })
  livePhotoVideoId!: string | null;

  @OneToOne(() => ExifEntity, (exifEntity) => exifEntity.asset)
  exifInfo?: ExifEntity;

  @OneToOne(() => SmartInfoEntity, (smartInfoEntity) => smartInfoEntity.asset)
  smartInfo?: SmartInfoEntity;

  // https://github.com/typeorm/typeorm/blob/master/docs/many-to-many-relations.md
  @ManyToMany(() => TagEntity, (tag) => tag.assets, { cascade: true })
  @JoinTable({ name: 'tag_asset' })
  tags!: TagEntity[];
}

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  OTHER = 'OTHER',
}
