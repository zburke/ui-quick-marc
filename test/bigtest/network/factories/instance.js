import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: () => faker.random.uuid(),
  title: () => faker.lorem.sentence(),
});
