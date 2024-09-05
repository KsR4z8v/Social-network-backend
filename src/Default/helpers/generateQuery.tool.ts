/* eslint-disable @typescript-eslint/no-explicit-any */
export const generateQuery = (table: string): Record<string, any> => {
  const generatePayload = (
    type: string,
    data: Record<string, string>,
  ): Record<string, any[]> => {
    const keys: unknown[] = [];
    const values: unknown[] = [];
    let index = 1;
    for (const i in data) {
      if (type === "to_update" || type === "to_select") {
        keys.push(`${i} = ${"$" + index}`);
      }
      if (type === "to_insert") {
        keys.push(`${"$" + index}`);
      }
      values.push(data[i]);
      index++;
    }
    return { keys, values };
  };
  return {
    update: (
      condition: Record<string, any>,
      data: Record<string, string>,
      returns: string[],
    ) => {
      const { keys, values } = generatePayload("to_update", data);

      const keyCondition: string = Object.keys(condition)[0];

      values.push(condition[keyCondition]);
      const query = `UPDATE ${table} SET  ${keys.join(
        ", ",
      )} WHERE ${keyCondition}=${"$" + values.length} RETURNING ${returns.join(
        ",",
      )}`;
      return { query, values };
    },
    insert: (data: Record<string, string>, returns: string[]) => {
      const { keys, values } = generatePayload("to_insert", data);
      const query = `INSERT INTO ${table} (${Object.keys(data).join(
        ", ",
      )} ) VALUES (${keys.join(", ")}) RETURNING ${returns.join(",")}`;
      return { query, values };
    },
    select: (
      filters: Record<string, string>,
      selectors: string[],
      joins: string[],
    ) => {
      const { keys, values } = generatePayload("to_select", filters);
      const query = `SELECT ${selectors.join(",")} FROM ${table} ${joins.join(
        " ",
      )} WHERE ${keys.join(" or ")}`;
      return { query, values };
    },
  };
};
