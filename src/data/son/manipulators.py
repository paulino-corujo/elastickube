"""
Copyright 2016 ElasticBox All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from pymongo.son_manipulator import SONManipulator


class KeyManipulator(SONManipulator):

    def __init__(self, replace=".", replacement="__dot__"):
        self.replace = replace
        self.replacement = replacement

    def transform_incoming(self, son, collection):
        return self._manipulate(son, collection, self._need_transform_key, self._transform_key)

    def transform_outgoing(self, son, collection):
        return self._manipulate(son, collection, self._need_revert_key, self._revert_key)

    def _need_transform_key(self, key):
        return self.replace in key

    def _transform_key(self, key):
        return key.replace(self.replace, self.replacement)

    def _need_revert_key(self, key):
        return self.replacement in key

    def _revert_key(self, key):
        return key.replace(self.replacement, self.replace)

    def _manipulate(self, son, collection, need_transform, transform):
        if isinstance(son, dict):
            for (key, value) in son.items():
                if need_transform(key):
                    if isinstance(value, dict):
                        son[transform(key)] = self._manipulate(son.pop(key), collection, need_transform, transform)
                    elif isinstance(value, list):
                        son[transform(key)] = [
                            self._manipulate(item, collection, need_transform, transform) for item in son.pop(key)]
                    else:
                        son[transform(key)] = son.pop(key)
                elif isinstance(value, dict):
                    son[key] = self._manipulate(value, collection, need_transform, transform)
                elif isinstance(value, list):
                    son[key] = [self._manipulate(item, collection, need_transform, transform) for item in value]

        return son
