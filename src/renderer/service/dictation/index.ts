import _ from 'lodash';
// @ts-ignore
import books from '/@/data/books.json';

interface Criteria {
  book: string;
  units: number[];
  currentUnit: number;
  page: number;
}

interface Book {
  id: string;
  name: string;
  words: { unit: number; word: string }[];
}

const getWords = async (criteria: Criteria) => {
  const book = books.find((item) => item.name === criteria.book);
  if (!book) {
    return [];
  }
  let words: any[] = [];
  const units = criteria.units;
  if (criteria.currentUnit > 0) {
    const currentUnit = book.words.filter((item: { unit: number }) => item.unit === criteria.currentUnit);
    words = words.concat(currentUnit);
    _.remove(units, criteria.currentUnit);
  }
  const wordCountPerPage = 40;
  const totalCount = criteria.page * wordCountPerPage;
  let wordsFromOtherUnits: any[] = [];
  units.forEach((unit: number) => {
    const unitWords = book.words.filter((item: { unit: number }) => item.unit === unit);
    wordsFromOtherUnits = wordsFromOtherUnits.concat(unitWords);
  });

  const randomWordsFromOtherUnit = wordsFromOtherUnits.sort(() => Math.random() - Math.random()).slice(0, totalCount - words.length);
  words = words.concat(randomWordsFromOtherUnit);
  return words;
};

const getBooks = async (req: Request, res: Response) => {
  const result = books.map((book) => ({
    id: book.id,
    name: book.name,
    units: _.uniq(book.words.map((item) => item.unit))
  }));

  return result;
};

export {
  getWords,
  getBooks
}
