import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { DateTime, Settings } from 'luxon';

// import MessageBox from 'message-box';
// import '../theme/bootstrap.js';
import './main.html';

import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

// import '../theme/bootstrap.js';

import './theatre.css';
import './balloon.css';

// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.css'            // optional, default theme
// import '@fortawesome/fontawesome-free/js/all.js' // optional, is using FA5
// import popper from 'popper.js'

import popper from '@popperjs/core';
global.Popper = popper;
import TempusDominus from '@eonasdan/tempus-dominus';
// import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.css';
global.pickers = {};
global.TempusDominus = TempusDominus;
const nlLoc = {
  today: 'Vandaag',
  'clear': 'Verwijder selectie',
  'close': 'Sluit de picker',
  'selectMonth': 'Selecteer een maand',
  'previousMonth': 'Vorige maand',
  'nextMonth': 'Volgende maand',
  'selectYear': 'Selecteer een jaar',
  'previousYear': 'Vorige jaar',
  'nextYear': 'Volgende jaar',
  'selectDecade': 'Selecteer decennium',
  previousDecade: 'Vorige decennium',
  nextDecade: 'Volgende decennium',
  previousCentury: 'Vorige eeuw',
  nextCentury: 'Volgende eeuw',
  pickHour: 'Kies een uur',
  incrementHour: 'Verhoog uur',
  decrementHour: 'Verlaag uur',
  pickMinute: 'Kies een minute',
  incrementMinute: 'Verhoog  minuut',
  decrementMinute: 'Verlaag minuut',
  pickSecond: 'Kies een seconde',
  incrementSecond: 'Verhoog seconde',
  decrementSecond: 'Verlaag seconde',
  toggleMeridiem: 'Schakel tussen AM/PM',
  'selectTime': 'Selecteer een tijd',
  'selectDate': 'Selecteer een datum',
  dayViewHeaderFormat: { month: 'long', year: '2-digit' },
  'locale': 'nl',
  'startOfTheWeek': 1
}
TempusDominus.locales = {}
TempusDominus.locales['nl'] = {
  name: 'nl',
  localization: nlLoc
};
TempusDominus.loadLocale(TempusDominus.locales.nl);
console.log('default options',TempusDominus.DefaultOptions);
TempusDominus.DefaultOptions['display']['buttons'] = {
  today: true,
  clear: true,
  close: true,
};
TempusDominus.DefaultOptions['display']['theme'] = 'dark';
// TempusDominus.locale('nl');
console.log('td glob', TempusDominus);
// TempusDominus.loadLocale(TempusDominus.locales.en);
// TempusDominus.loadLocale(TempusDominus.locales.fr);

Settings.defaultLocale = 'nl';

// import 'meteor/aldeed:autoform/static'
// import { AutoFormThemeBootstrap4 } from 'meteor/communitypackages:autoform-bootstrap4/static'
import './theatre.js'
// AutoFormThemeBootstrap4.load();
// AutoForm.setDefaultTemplate('bootstrap4');
// AutoForm.setDefaultTemplateForType('quickForm', 'bootstrap4');

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.onRendered(function helloOnRendered() {
  // let $input = this.$('#mainDTP')[0];
  // console.log('tempus', $input, global.Tempusdominus);
  // // new tempusdominus.TempusDominus(document.getElementById('datetimepicker1'));
  // // const nl = {
  // //   today: 'Vandaag',
  // //   selectTime: 'Selecteer Tijd',
  // //   selectMonth: 'Selecteer Maand',
  // //   startOfTheWeek: 1,
  // //   locale: 'nl'
  // // }
  // const nl = {
  //   today: 'Vandaag',
  //   'clear': 'Verwijder selectie',
  //   'close': 'Sluit de picker',
  //   'selectMonth': 'Selecteer een maand',
  //   'previousMonth': 'Vorige maand',
  //   'nextMonth': 'Volgende maand',
  //   'selectYear': 'Selecteer een jaar',
  //   'previousYear': 'Vorige jaar',
  //   'nextYear': 'Volgende jaar',
  //   'selectDecade': 'Selecteer decennium',
  //   previousDecade: 'Vorige decennium',
  //   nextDecade: 'Volgende decennium',
  //   previousCentury: 'Vorige eeuw',
  //   nextCentury: 'Volgende eeuw',
  //   pickHour: 'Kies een uur',
  //   incrementHour: 'Verhoog uur',
  //   decrementHour: 'Verlaag uur',
  //   pickMinute: 'Kies een minute',
  //   incrementMinute: 'Verhoog  minuut',
  //   decrementMinute: 'Verlaag minuut',
  //   pickSecond: 'Kies een seconde',
  //   incrementSecond: 'Verhoog seconde',
  //   decrementSecond: 'Verlaag seconde',
  //   toggleMeridiem: 'Schakel tussen AM/PM',
  //   'selectTime': 'Selecteer een tijd',
  //   'selectDate': 'Selecteer een datum',
  //   dayViewHeaderFormat: { month: 'long', year: '2-digit' },
  //   'locale': 'nl',
  //   'startOfTheWeek': 1
  // }
  // this.picker = new global.Tempusdominus.TempusDominus($input, {
  //   display: {
  //     theme: 'dark'
  //   },
  //   // localization: nl
  // });
  // this.picker.locale(global.Tempusdominus.locales.nl.name);

  // console.log('picker', this.picker);
  // this.picker.locale(global.Tempusdominus.locales.ru.name);
  // this.picker.locale('nl');
  // var data = this.data;
  // var opts = data.atts.dateTimePickerOptions || {};
  // console.log('picker', this.picker, data, opts);
  // const parsedDate = this.picker.dates.parseInput(new Date());

  // this.picker.dates.setValue(parsedDate);

  // const datetimepicker1 = new global.Tempusdominus.TempusDominus(document.getElementById('datetimepicker1'));
  // const parsedDate = datetimepicker1.dates.parseInput(new Date());
  // parsedDate.setLocale('nl');
  // datetimepicker1.dates.setValue(parsedDate);


})

Template.hello.events({
  'click #route1'(event, instance) {
    // increment the counter when button is clicked
    Router.go('/route1')
  },
  'click #route2'(event, instance) {
    // increment the counter when button is clicked
    Router.go('/route2')
  },
});

Template.route1.events({
  'click #back'(event, instance) {
    // increment the counter when button is clicked
    Router.go('/');
  },
});

Template.route1.helpers({
  optionselected() {
    return Session.get('group');
  }
})

Template.route1.onCreated(function route1OnCreated() {
  Session.set('group', undefined);
})

Router.route('/', {
  name: 'root',
  layoutTemplate: 'MenuLayout',
  action: function () {
    this.render('hello');
  },
});

Router.route('/route1', {
  name: 'route1',
  layoutTemplate: 'MenuLayout',
  action: function () {
    this.render('route1');
  },
  data: {
    label: {
      form: {
        id: 'groupslabelForm',
        field: 'groups',
        schema: new SimpleSchema({
          optionfield: {
            type: String,
            label: 'group',
            autoform: {
              label: false,
              options: function () {
                let groups = [
                  { label: 'All', value: '___ALL___' },
                  { label: 'Option 1', value: 'V1' },
                  { label: 'Option 2', value: 'V2' },
                  { label: 'Option 3', value: 'V3' },
                ]
                return groups;
              }
            }
          },
          date: {
            type: Date,
            label: 'First date to enter',
            custom: function() {
              console.log('custom validation date');
              return 'myerrordef';
            },
            autoform: {
              type: 'tempusdominus',
              manualInput: false,
              readonly: false,
              locale: function () {
                return 'nl';
              },
              dateTimePickerOptions: {
                // useCurrent: true,
                defaultDate: DateTime.local().startOf('hour').toJSDate(),
                // defaultDate: DateTime.fromFormat('2000-01-01','yyyy-MM-dd').toJSDate(),
                // viewDate: DateTime.fromFormat('2000-01-01','yyyy-MM-dd').toJSDate(),
                // promptTimeOnDateChange: true,
                // promptTimeOnDateChangeTransitionDelay:200,
                display: {
                  sideBySide: false,
                  components: {
                    decades: true,
                    year: true,
                    month: true,
                    date: true,
                    hours: true,
                    minutes: true,
                    seconds: false
                  },
                  viewMode: 'calendar',
                  inline: false
                }
              }
            }
          },
          date2: {
            type: Date,
            label: 'Second Date to enter',
            optional: true,
            autoform: {
              type: 'tempusdominus',
              manualInput: false,
              readonly: false,
              locale: function () {
                return 'en';
              },
              dateTimePickerOptions: {
                useCurrent: true,
                display: {
                  sideBySide: true,
                  viewMode: 'calendar',
                  inline: false
                }
              }
            }
          },
          simple: {
            type: String,
            label: 'Test required message'
          }
        }, { tracker: Tracker })
      }
    }
  }
});

Router.route('/route2', {
  name: 'route2',
  layoutTemplate: 'MenuLayout',
  action: function () {
    this.render('theatre');
  },
  data: {
    columns: 30 ,
    rows: 15
  }
});

AutoForm.hooks({
  'groupslabelForm': {
    'onSubmit': function (insertDoc, updateDoc, currentDoc) {
      // this.event.preventDefault();
      console.log('hook onsubmit insertDoc', insertDoc);
      Session.set('group', insertDoc['optionfield']);
      // AutoForm.resetForm('groupslabelForm');
      this.done();
      return false;
    }
  },
});

Router.go('/');
