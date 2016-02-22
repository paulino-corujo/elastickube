import MANUEL_ICON from './images/manolakis.jpeg';
import PAULINO_ICON from './images/paulino.jpg';
import ALBERTO_ICON from './images/alberto.jpg';
import DIEGO_ICON from './images/diego.png';
import MATT_ICON from './images/matt.jpg';

const users = [
    { id: 'manuel', name: 'Manuel Martin', icon: MANUEL_ICON, email: 'manuel@elasticbox.com', created: new Date() },
    { id: 'paulino', name: 'Paulino Corujo', icon: PAULINO_ICON, email: 'paulino@elasticbox.com', created: new Date() },
    { id: 'alberto', name: 'Alberto Arias', icon: ALBERTO_ICON, email: 'alberto@elasticbox.com', created: new Date() },
    { id: 'diego', name: 'Diego Sanjuan', icon: DIEGO_ICON, email: 'diego@elasticbox.com', created: new Date() },
    { id: 'matt', name: 'Matt Nickles', icon: MATT_ICON, email: 'matt@elasticbox.com', created: new Date() }
];

let data = users;

_.range(1000).forEach(() => {
    data = data.concat(_.map(users, (x) => {
        const user = angular.copy(x);

        user.id += _.uniqueId();

        return user;
    }));
});

export default users;
