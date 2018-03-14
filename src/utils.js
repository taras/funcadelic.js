import stable from './stable';
import getOwnPropertyDescriptors from 'object.getownpropertydescriptors';

export const propertiesOf = stable(getOwnPropertyDescriptors);
