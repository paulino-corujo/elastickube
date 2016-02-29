function themeConfiguration($mdThemingProvider) {
    'ngInject';

    const ekPalette = $mdThemingProvider.extendPalette('cyan', {
        contrastDefaultColor: 'light'
    });

    $mdThemingProvider.definePalette('ekPalette', ekPalette);

    $mdThemingProvider
        .theme('default')
        .primaryPalette('ekPalette');
}

export default themeConfiguration;
