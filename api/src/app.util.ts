import { getConnection, Brackets } from 'typeorm';
import { isString, isBoolean, isNumber } from 'util';

export const executeTasks = async (tasks: any[], dto: any) => {

  const tasks_data = new Map<string, any>();

  for (const t of tasks) {
    await t(dto, tasks_data);
  }

  return Promise.resolve(tasks_data);
};

export const executeReadQuery = async (
    entity_name: string,
    start: number,
    end: number,
    filters: [any, string][],
    sorting: any,
    joins?: { property: string, alias: string }[],
  ) => {

  // build query
  let query_builder = getConnection()
    .getRepository(entity_name)
    .createQueryBuilder(entity_name);

  query_builder = query_builder
    .where(new Brackets(qb => {
      filters.forEach(f => {
        if (isString(f['0'])) {
          qb.andWhere(`${f['1']} like :${f['1']}`, { [f['1']]: `%${f['0']}%` });
        } else if (isBoolean(f['0']) || isNumber(f['0'])) {
          qb.andWhere(`${f['1']} = :${f['1']}`, { [f['1']]: f['0'] });
        }
      });
    }))
    .orderBy(Object.keys(sorting).length === 0 ? {
      [`${entity_name}.id`]: 'ASC',
    } : sorting);

  if (joins) {
    joins.forEach(j => {
      query_builder = query_builder.leftJoinAndSelect(j.property, j.alias);
    });
  }

  if (!isNaN(start)) {

    query_builder = query_builder.skip(start - 1);
    query_builder = query_builder.take(end - (start - 1));
  }

  // execute query
  return await query_builder.getManyAndCount();
};

export const validateRange = (dto: any): boolean => {

  // only validate if there's a filter range param
  if (!dto.params_start && !dto.params_end) {
    return false;
  }

  const validations = [
    // range should both have start and end values
    (!dto.params_start || !dto.params_end),
    // range should both be numeric values
    (isNaN(parseInt(dto.params_start, 10)) || isNaN(parseInt(dto.params_end, 10))),
    // start range should be < end range
    (parseInt(dto.params_start, 10) >= parseInt(dto.params_end, 10)),
  ];

  return validations.find(v => v === true) != null;
};