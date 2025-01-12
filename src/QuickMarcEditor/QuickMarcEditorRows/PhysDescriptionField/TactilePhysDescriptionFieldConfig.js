import { STANDARD_PHYS_DESCR_FIELDS } from './constants';
import { SUBFIELD_TYPES } from '../BytesField';

const TactilePhysDescriptionFieldConfig = [
  ...STANDARD_PHYS_DESCR_FIELDS,
  {
    name: 'Class of braille writing',
    type: SUBFIELD_TYPES.STRING,
  },
  {
    name: 'Level of contraction',
    type: SUBFIELD_TYPES.BYTE,
  },
  {
    name: 'Braille music format',
    type: SUBFIELD_TYPES.STRING,
  },
  {
    name: 'Special physical characteristics',
    type: SUBFIELD_TYPES.BYTE,
  },
];

export default TactilePhysDescriptionFieldConfig;
