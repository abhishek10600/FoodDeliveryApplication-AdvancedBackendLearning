import { CuisineStatus } from "../enums/cusine-status.enum.js";
import { CuisineName } from "../value-objects/cuisine-name.vo.js";
import { CuisineSlug } from "../value-objects/cuisine-slug.vo.js";

export class Cuisine {

  private readonly id: string;
  private name: CuisineName;
  private slug: CuisineSlug;
  private status: CuisineStatus;
  private readonly createdAt: Date;
  private updatedAt: Date

  constructor(props: {
    id: string;
    name: CuisineName;
    slug: CuisineSlug;
    status: CuisineStatus;
    createdAt: Date;
    updatedAt: Date
  }) {
    this.id = props.id
    this.name = props.name
    this.slug = props.slug
    this.status = props.status
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public static create(props: {
    name: CuisineName;
    slug?: CuisineSlug;
  }): Cuisine {
    const now = new Date()

    const slug = props.slug ?? CuisineSlug.fromName(props.name)

    return new Cuisine({
      id: crypto.randomUUID(),
      name: props.name,
      slug,
      status: CuisineStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    })
  }

  public static rehydrate(props: {
    id: string;
    name: CuisineName;
    slug: CuisineSlug;
    status: CuisineStatus;
    createdAt: Date;
    updatedAt: Date
  }): Cuisine {
    return new Cuisine({
      id: props.id,
      name: props.name,
      slug: props.slug,
      status: props.status,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    })
  }

  public update(props: {
    name?: CuisineName;
    slug?: CuisineSlug;
  }): void {
    if (props.name !== undefined) {
      this.name = props.name

      this.slug = props.slug ?? CuisineSlug.fromName(props.name)
    } else if (props.slug !== undefined) {
      this.slug = props.slug
    }

    this.touch()
  }

  public activate(): void {
    if (this.status === CuisineStatus.ACTIVE) {
      return
    }

    this.status = CuisineStatus.ACTIVE

    this.touch()
  }

  public deactivate(): void {
    if (this.status === CuisineStatus.INACTIVE) {
      return
    }

    this.status = CuisineStatus.INACTIVE

    this.touch()
  }

  public getId(): string {
    return this.id
  }

  public getName(): CuisineName {
    return this.name
  }

  public getSlug(): CuisineSlug {
    return this.slug
  }

  public getStatus(): CuisineStatus {
    return this.status
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  private touch(): void {
    this.updatedAt = new Date()
  }

}
