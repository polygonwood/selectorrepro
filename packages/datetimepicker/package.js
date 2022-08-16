Package.describe({
    name: 'polygonwood:autoform-td-datetimepicker',
    summary: 'Custom tempus dominus datetimepicker input type for AutoForm 7.0',
    version: '1.0.0',
    //git: 'https://github.com/aldeed/meteor-autoform-bs-datetimepicker.git'
  });
  
  Package.onUse(function(api) {
    api.use('templating@1.0.0');
    api.use('blaze@2.0.0');
    api.use('ecmascript');
    api.use('underscore@1.0.0');
    api.use('aldeed:autoform@7.0.0');
    // api.use('luxon@2.3.2','client');
    // api.use('tempus-dominus@6.0.0','client');
  
    // Ensure momentjs packages load before this one if used
    // api.use('momentjs:moment@2.8.4', 'client', {weak: true});
    // api.use('mrt:moment-timezone@0.2.1', 'client', {weak: true});
  
    // api.addFiles([
    //   'autoform-bs-datetimepicker.html',
    //   'autoform-bs-datetimepicker.js'
    // ], 'client');
    api.mainModule('autoform-td-datetimepicker.js','client');
  });

  Npm.depends({
    'luxon': '2.3.2',
    '@eonasdan/tempus-dominus': '6.0.0-beta9'
  })