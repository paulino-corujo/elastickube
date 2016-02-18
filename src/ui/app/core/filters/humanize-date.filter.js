import moment from 'moment';

function humanizeDateFilter(input) {
    let formattedDuration;

    if (input) {
        const duration = moment.duration(moment.utc().local().diff(moment.utc(input).local()));

        formattedDuration = duration < moment.duration(5, 'minutes') ? 'a moment' : duration.humanize();
    } else {
        formattedDuration = '';
    }

    return formattedDuration;
}

export default humanizeDateFilter;
