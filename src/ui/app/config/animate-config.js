function animateConfiguration($animateProvider) {
    'ngInject';

    $animateProvider.classNameFilter(/\banimate\b/);
}

export default animateConfiguration;
