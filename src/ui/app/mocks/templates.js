import ANSIBLE from './images/ansible.png';
import ELASTICSEARCH from './images/elasticsearch.png';
import NGINX from './images/nginx.png';
import MONGODB from './images/mongodb.png';
import JENKINS from './images/jenkins.png';
import REDIS from './images/redis.png';

const templates = [
    {
        name: 'Ansible',
        type: 'services',
        icon: ANSIBLE,
        owner: 'diego',
        members: 3,
        created: new Date(),
        updated: new Date('2-3-2016'),
        description: 'Automation platform for apps and IT infrastructure'
    }, {
        name: 'Elasticsearch',
        type: 'resource list',
        icon: ELASTICSEARCH,
        owner: 'alberto',
        members: 2,
        created: new Date(),
        updated: new Date('2-1-2016'),
        description: 'Open Source, Distributed, RESTful Search Engine'
    }, {
        name: 'Nginx',
        type: 'services',
        icon: NGINX,
        owner: 'matt',
        members: 5,
        created: new Date(),
        updated: new Date('2-5-2016'),
        description: 'A free, open-source, high-performance HTTP server'
    }, {
        name: 'MongoDB',
        type: 'persistent volumes',
        icon: MONGODB,
        owner: 'manuel',
        members: 1,
        created: new Date(),
        updated: new Date(),
        description: 'Open-Source document oriented NoSQL database'
    }, {
        name: 'Jenkins',
        type: 'resource list',
        icon: JENKINS,
        owner: 'paulino',
        members: 4,
        created: new Date(),
        updated: new Date('1-30-2016'),
        description: 'Open-Source continuous integration server'
    }, {
        name: 'Redis',
        type: 'resource list',
        icon: REDIS,
        owner: 'alberto',
        members: 7,
        created: new Date(),
        updated: new Date('2-5-2015'),
        description: 'Build software better, together'
    }
];

export default _.map(templates, (x, i) => {
    x.id = `${x.id}-${i}`;

    return x;
});
