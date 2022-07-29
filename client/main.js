import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
// import MessageBox from 'message-box';
// import '../theme/bootstrap.js';
import './main.html';

import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'            // optional, default theme
// import '@fortawesome/fontawesome-free/js/all.js' // optional, is using FA5
// import popper from 'popper.js'

// global.Popper = popper  s

import 'meteor/aldeed:autoform/static'
import { AutoFormThemeBootstrap4 } from 'meteor/communitypackages:autoform-bootstrap4/static'
AutoFormThemeBootstrap4.load();
AutoForm.setDefaultTemplate('bootstrap4');
AutoForm.setDefaultTemplateForType('quickForm', 'bootstrap4');

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

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

Template.route1.onCreated(function route1OnCreated(){
  Session.set('group',undefined);
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
          }
        }, { tracker: Tracker })
      }
    }
  }
});

AutoForm.hooks({
  'groupslabelForm': {
    'onSubmit': function (insertDoc, updateDoc, currentDoc) {
      // this.event.preventDefault();
      console.log('hook onsubmit insertDoc', insertDoc);
      Session.set('group', insertDoc['optionfield']);
      AutoForm.resetForm('groupslabelForm');
      this.done();
      return false;
    }
  },
});

Router.go('/');
