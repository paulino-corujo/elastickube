import WORDPRESS_ICON from './images/docker.png';
import HAPROXY_ICON from './images/services.png';
import KIBANA_ICON from './images/kibana.png';
import MY_SQL_ICON from './images/mysql.png';
import NODEJS_ICON from './images/nodejs.png';
import NGINX_ICON from './images/nginx.png';

const instancesDefault = [{
    name: 'default-blog-prod-us-a',
    state: 'online',
    serviceId: 'ek-106hk',
    labels: ['blog', 'prod', 'usa'],
    owner: 'matt',
    updated: new Date('2-1-2016'),
    icon: WORDPRESS_ICON
}, {
    name: 'default-kibana-prod',
    state: 'unavailable',
    serviceId: 'ek-dv66d',
    labels: ['kibana', 'prod'],
    owner: 'alberto',
    updated: new Date('2-3-2016'),
    icon: KIBANA_ICON
}];

const instancesEngineering = [{
    name: 'blog-prod-us-a',
    state: 'online',
    serviceId: 'ek-106hk',
    labels: ['blog', 'prod', 'usa'],
    owner: 'matt',
    updated: new Date('2-1-2016'),
    icon: WORDPRESS_ICON
}, {
    name: 'kibana-prod',
    state: 'unavailable',
    serviceId: 'ek-dv66d',
    labels: ['kibana', 'prod'],
    owner: 'alberto',
    updated: new Date('2-3-2016'),
    icon: KIBANA_ICON
}, {
    name: 'mysql-prod-us-a',
    state: 'online',
    serviceId: 'ek-a323f',
    labels: ['database', 'prod', 'mysql'],
    owner: 'diego',
    updated: new Date(),
    icon: MY_SQL_ICON
}, {
    name: 'multi-bastion-prod-us-a',
    state: 'online',
    serviceId: 'ek-li2a9',
    labels: ['bastion'],
    owner: 'paulino',
    updated: new Date(),
    icon: NGINX_ICON
}, {
    name: 'services-prod-us-a',
    state: 'online',
    serviceId: 'ek-gr43d',
    labels: ['services', 'prod'],
    owner: 'alberto',
    updated: new Date('2-5-2016'),
    icon: NODEJS_ICON
}, {
    name: 'website-prod-us-a',
    state: 'online',
    serviceId: 'ek-ot32e',
    labels: ['website'],
    owner: 'manuel',
    updated: new Date(),
    icon: HAPROXY_ICON
}];

const instances = {
    default: addInstanceIds(instancesDefault),
    engineering: addInstanceIds(instancesEngineering)
};

function addInstanceIds(ss) {
    return _.map(ss, (x, i) => {
        x.id = `${x.id}-${i}`;

        return x;
    });
}

export default instances;
