import { faker } from "@faker-js/faker";

export type Person = {
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

const newPerson = (index: number): Person => {
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
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((_, index): Person => {
      return {
        ...newPerson(index),
      };
    });
  };

  return makeDataLevel();
}
