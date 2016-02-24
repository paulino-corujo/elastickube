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
