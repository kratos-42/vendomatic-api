import { NotFoundException } from '@nestjs/common';
import { head } from 'lodash';
import {
  DataSource,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

// TODO: Add log after each operation.
export class BaseRepository<M extends ObjectLiteral> extends Repository<M> {
  // TODO: support multiple primary columns.
  private readonly primaryColumn: string;

  constructor(
    private readonly entity: EntityTarget<M>,
    readonly dataSource: DataSource,
  ) {
    super(entity, dataSource.createEntityManager());

    this.primaryColumn = head(
      this.dataSource
        .getMetadata(this.metadata.target)
        .primaryColumns.map((column) => column.propertyName),
    );
  }

  async findAll(conditions: FindManyOptions<M> = {}): Promise<FindAllResponse<M>> {
    const data = await this.find(conditions);

    return {
      data,
      message: `${this.metadata.tableName} successfully inserted and fetched`,
    };
  }

  async findById(id: string): Promise<InsertAndFetchResponse<M>> {
    const data = await this.findOne({
      where: { [this.primaryColumn]: id } as FindOptionsWhere<M>,
    });

    if (!data) {
      throw new NotFoundException(`${this.metadata.tableName} not found`);
    }

    return {
      data,
      message: `${this.metadata.tableName} successfully inserted and fetched`,
    };
  }

  async insertAndFetch(payload: Partial<M>): Promise<InsertAndFetchResponse<M>> {
    const {
      identifiers: [{ id }],
    } = await this.insert(payload);

    const data = await this.findOneBy({ id });

    return {
      data,
      message: `${this.metadata.tableName} successfully inserted and fetched`,
    };
  }

  async patchById(id: string, payload: Partial<M>): Promise<InsertAndFetchResponse<M>> {
    const qb = this.createQueryBuilder();
    const result = await qb
      .update()
      .set(payload)
      .where(`${this.primaryColumn} = :id`, { id })
      .returning('*')
      .execute();

    return {
      data: head(result.raw),
      message: `${this.metadata.tableName} successfully patched and fetched`,
    };
  }
}

/**
 * Types.
 */

type FindAllResponse<Model extends ObjectLiteral> = {
  data: Model[];
  message: string;
};

type InsertAndFetchResponse<Model extends ObjectLiteral = unknown> = {
  data: Model;
  message: string;
};
