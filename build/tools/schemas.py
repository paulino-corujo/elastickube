#!/usr/bin/env python
import argparse
import json
import os
import sys

from collections import OrderedDict


def run(schemas_dir):
    for (schema_path, _, files) in os.walk(schemas_dir):
        for filename in files:
            _, file_extension = os.path.splitext(filename)
            if file_extension == '.json':
                with open(os.path.join(schema_path, filename), 'r') as schema_file:
                    schemas = json.load(schema_file, encoding='ascii', object_hook=OrderedDict)

                with open(os.path.join(schema_path, filename), 'w') as schema_file:
                    json.dump(_walk_and_reorder(schemas), schema_file, separators=(',', ': '), indent=2)
                    schema_file.write('\n')


def _reorder_property(schema, ordered_schema):
    if '$schema' in schema:
        ordered_schema['$schema'] = schema['$schema']
        del schema['$schema']

    if 'id' in schema:
        ordered_schema['id'] = _walk_and_reorder(schema['id'])
        del schema['id']

    if 'type' in schema:
        ordered_schema['type'] = _walk_and_reorder(schema['type'])
        del schema['type']

    if 'required' in schema:
        ordered_schema['required'] = schema['required']
        del schema['required']

    if 'minLength' in schema:
        ordered_schema['minLength'] = schema['minLength']
        del schema['minLength']

    if 'maxLength' in schema:
        ordered_schema['maxLength'] = schema['maxLength']
        del schema['maxLength']

    if 'default' in schema:
        ordered_schema['default'] = _walk_and_reorder(schema['default'])
        del schema['default']

    if 'description' in schema:
        ordered_schema['description'] = schema['description']
        del schema['description']


def _walk_and_reorder(schema):
    if isinstance(schema, dict):
        ordered_schema = OrderedDict()
        schema_properties = dict()
        schema_arrays = dict()

        _reorder_property(schema, ordered_schema)

        for (property_name, property_value) in schema.items():
            if (isinstance(property_value, dict) and
                'type' in property_value and
                    property_value['type'] == 'array'):
                schema_arrays[property_name] = _walk_and_reorder(property_value)
            elif (isinstance(property_value, dict) and
                  'type' in property_value and
                  property_value['type'] == 'enum'):
                schema_arrays[property_name] = _walk_and_reorder(property_value)
            else:
                schema_properties[property_name] = _walk_and_reorder(property_value)

        for key in sorted(schema_properties.keys()):
            ordered_schema[key] = schema_properties[key]

        for key in sorted(schema_arrays.keys()):
            ordered_schema[key] = schema_arrays[key]

        return ordered_schema
    elif isinstance(schema, list):
        return [_walk_and_reorder(item) for item in schema]
    else:
        return schema


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--schemas-dir', required=True, dest='schemas_dir', help='Schemas base directory')
    arguments = parser.parse_args()
    if not run(arguments.schemas_dir):
        sys.exit(1)
