/*
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
*/

import moment from 'moment';

const EPOCH = 'epoch';

function humanizeDateFilter(input, format) {
    let formattedDuration;

    if (input) {
        const inputDate = format === EPOCH ? moment.unix(input).local() : moment.utc(input).local();
        const duration = moment.duration(moment.utc().local().diff(inputDate));

        formattedDuration = duration < moment.duration(5, 'minutes') ? 'a moment' : duration.humanize();
    } else {
        formattedDuration = '';
    }

    return formattedDuration;
}

export default humanizeDateFilter;
