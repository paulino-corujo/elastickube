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


def filter_namespaces(data, user):
    if user["role"] != "administrator":
        if isinstance(data, list):
            for item in data:
                if "members" not in item or user["username"] not in item["members"]:
                    data.remove(item)

            return data
        else:
            if "members" not in data or user["username"] not in data["members"]:
                return None
    else:
        return data
