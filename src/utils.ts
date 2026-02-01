import { faker } from "@faker-js/faker";
import { z } from "zod";

export type Data = {
  id: string;
  translated_text: string;
  translated_chunks: string;
  // og_chunks: string;
  // og_full_text: string;
  og_language_score: number;
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newData = (): Data => {
  return {
    id: `<urn:uuid:${faker.string.uuid()}>`,
    translated_text: faker.lorem.sentences({ min: 3, max: 6 }),
    translated_chunks: faker.lorem.sentences({ min: 3, max: 6 }),
    // og_chunks: faker.lorem.sentences({ min: 3, max: 6 }),
    // og_full_text: faker.lorem.sentences({ min: 3, max: 6 }),
    og_language_score: faker.number.float({ fractionDigits: 6 }),
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Data[] => {
    const len = lens[depth]!;
    return range(len).map((_): Data => {
      return {
        ...newData(),
      };
    });
  };

  return makeDataLevel();
}

export function inferZodSchema(sample: Record<string, unknown>): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const [key, value] of Object.entries(sample)) {
    if (value === null) {
      shape[key] = z.null();
    } else if (typeof value === "string") {
      shape[key] = z.string();
    } else if (typeof value === "number") {
      shape[key] = z.number();
    } else if (typeof value === "boolean") {
      shape[key] = z.boolean();
    } else if (Array.isArray(value)) {
      shape[key] = z.array(z.unknown());
    } else if (typeof value === "object") {
      shape[key] = inferZodSchema(value as Record<string, unknown>);
    } else {
      shape[key] = z.unknown();
    }
  }

  return z.object(shape);
}
