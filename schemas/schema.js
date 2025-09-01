// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator';

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';
import author from './documents/author';
import blog from './blog';
import bulletin from './bulletin';
import thesis from './thesis';
import award from './award';
import recipient from './documents/recipient';

export default createSchema({
  name: 'default',

  types: schemaTypes.concat([blog, author, bulletin, thesis, award, recipient]),
});
